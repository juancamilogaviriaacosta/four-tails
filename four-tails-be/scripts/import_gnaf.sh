
#!/usr/bin/env bash
#datasource=https://data.gov.au/data/dataset/19432f89-dc3a-4ef3-b943-5326ef1dbecc/resource/340dfee4-027d-411d-acdf-4944b102ede7/download/g-naf_nov26_allstates_gda94_psv_120.zip

set -Eeuo pipefail

# ============================================================
# GNAF DATA IMPORTER
# ============================================================

CONTAINER="${POSTGRES_CONTAINER:-postgres-container}"
DB="${POSTGRES_DB:-four-tails}"
DB_USER="${POSTGRES_USER:-postgres}"

SCHEMA="gnaf"
TMP_DIR="/tmp/gnaf-import"

GNAF_DIR="${1:-}"
RESET="${2:-}"

if [[ -z "$GNAF_DIR" || ! -d "$GNAF_DIR" ]]; then
    echo "Usage: $0 /path/to/gnaf/files [--reset]"
    exit 1
fi

if [[ "$RESET" != "" && "$RESET" != "--reset" ]]; then
    echo "Unknown option: $RESET"
    exit 1
fi

# Import order: parent tables before dependent tables.
TABLES=(
    address_alias_type_aut
    address_change_type_aut
    address_type_aut
    flat_type_aut
    geocoded_level_type_aut
    geocode_reliability_aut
    geocode_type_aut
    level_type_aut
    locality_alias_type_aut
    locality_class_aut
    mb_match_code_aut
    ps_join_type_aut
    street_class_aut
    street_locality_alias_type_aut
    street_suffix_aut
    street_type_aut

    state
    address_site
    mb_2016
    mb_2021
    locality
    street_locality
    address_detail

    address_alias
    address_default_geocode
    address_feature
    address_mesh_block_2016
    address_mesh_block_2021
    address_site_geocode
    locality_alias
    locality_neighbour
    locality_point
    primary_secondary
    street_locality_alias
    street_locality_point
)

declare -A FILES

echo "======================================"
echo " GNAF IMPORT"
echo "======================================"
echo "Directory: $GNAF_DIR"
echo "Container: $CONTAINER"
echo "Database:  $DB"
echo "Schema:    $SCHEMA"
echo

# Check Docker container
docker inspect "$CONTAINER" >/dev/null

# Check database connection
docker exec "$CONTAINER" \
    psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB" \
    -c "SELECT 1 FROM information_schema.schemata WHERE schema_name='$SCHEMA';" \
    >/dev/null

# Build mapping between files and tables
for file in "$GNAF_DIR"/*_psv.psv; do

    [[ -f "$file" ]] || continue

    filename=$(basename "$file")
    name="${filename%_psv.psv}"

    # Remove Australian territory prefix
    if [[ "$name" =~ ^(ACT|NSW|NT|OT|QLD|SA|TAS|VIC|WA)_(.+)$ ]]; then
        name="${BASH_REMATCH[2]}"
    fi

    table=$(echo "$name" | tr '[:upper:]' '[:lower:]')

    FILES["$table"]+="$file"$'\n'

done

# Prepare container directory
docker exec "$CONTAINER" sh -c \
    "rm -rf '$TMP_DIR' && mkdir -p '$TMP_DIR'"

# Copy PSV files into PostgreSQL container
echo "Copying PSV files to container..."
docker cp "$GNAF_DIR/." "$CONTAINER:$TMP_DIR/"

echo

# Optional clean import
if [[ "$RESET" == "--reset" ]]; then

    echo "WARNING: Clearing existing GNAF data..."

    table_list=$(printf 'gnaf.%s,' "${TABLES[@]}")
    table_list="${table_list%,}"

    docker exec "$CONTAINER" \
        psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB" \
        -c "TRUNCATE TABLE $table_list CASCADE;"

fi

# Import files
TOTAL_FILES=0
SUCCESS_FILES=0
FAILED_FILES=0

for table in "${TABLES[@]}"; do

    files="${FILES[$table]:-}"

    if [[ -z "$files" ]]; then
        echo "[SKIP] $table - no corresponding PSV file"
        continue
    fi

    while IFS= read -r file; do

        [[ -n "$file" ]] || continue

        filename=$(basename "$file")
        TOTAL_FILES=$((TOTAL_FILES + 1))

        echo "--------------------------------------"
        echo "Importing: $filename"
        echo "Target:    $SCHEMA.$table"

        if docker exec "$CONTAINER" \
            psql -v ON_ERROR_STOP=1 \
            -U "$DB_USER" \
            -d "$DB" \
            -c "\copy $SCHEMA.$table FROM '$TMP_DIR/$filename' WITH (FORMAT CSV, DELIMITER '|', HEADER TRUE, NULL '', ENCODING 'UTF8')"
        then
            SUCCESS_FILES=$((SUCCESS_FILES + 1))
            echo "[OK] $filename"
        else
            FAILED_FILES=$((FAILED_FILES + 1))
            echo "[ERROR] $filename"
        fi

    done <<< "$files"

done

echo
echo "======================================"
echo " IMPORT SUMMARY"
echo "======================================"
echo "Total files:    $TOTAL_FILES"
echo "Successful:     $SUCCESS_FILES"
echo "Failed:         $FAILED_FILES"
echo "======================================"

if [[ "$FAILED_FILES" -gt 0 ]]; then
    exit 1
fi

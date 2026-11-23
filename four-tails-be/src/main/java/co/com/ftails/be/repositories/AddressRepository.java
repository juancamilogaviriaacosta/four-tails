package co.com.ftails.be.repositories;

import co.com.ftails.be.dtos.AddressSuggestionDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AddressRepository {

    private final JdbcTemplate jdbcTemplate;

    public AddressRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AddressSuggestionDto> searchAddressSuggestions(String query) {

        String sql = """
            SELECT
                address_detail_pid,

                CONCAT_WS(', ',

                    NULLIF(
                        CONCAT_WS(' ',
                            NULLIF(building_name, ''),
                            NULLIF(
                                CONCAT_WS(' ',
                                    NULLIF(flat_type, ''),
                                    NULLIF(
                                        CONCAT_WS('',
                                            flat_number_prefix,
                                            flat_number::text,
                                            flat_number_suffix
                                        ), ''
                                    )
                                ), ''
                            ),
                            NULLIF(
                                CONCAT_WS(' ',
                                    NULLIF(level_type, ''),
                                    NULLIF(
                                        CONCAT_WS('',
                                            level_number_prefix,
                                            level_number::text,
                                            level_number_suffix
                                        ), ''
                                    )
                                ), ''
                            ),
                            NULLIF(
                                CONCAT_WS('',
                                    number_first_prefix,
                                    number_first::text,
                                    number_first_suffix
                                ) ||
                                CASE
                                    WHEN number_last IS NOT NULL
                                    THEN '-' || CONCAT(
                                        number_last_prefix,
                                        number_last::text,
                                        number_last_suffix
                                    )
                                    ELSE ''
                                END,
                                ''
                            ),
                            NULLIF(
                                CONCAT_WS(' ',
                                    NULLIF(street_name, ''),
                                    NULLIF(street_type_code, ''),
                                    NULLIF(street_suffix_type, '')
                                ), ''
                            )
                        ), ''
                    ),

                    NULLIF(locality_name, ''),

                    NULLIF(
                        CONCAT_WS(' ',
                            NULLIF(state_abbreviation, ''),
                            NULLIF(postcode, '')
                        ), ''
                    )

                ) AS address,

                latitude,
                longitude

            FROM gnaf.address_view

            WHERE street_name ILIKE ?
              AND latitude IS NOT NULL
              AND longitude IS NOT NULL

            ORDER BY
                street_name,
                number_first NULLS LAST

            LIMIT 10
            """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new AddressSuggestionDto(
                        rs.getString("address_detail_pid"),
                        rs.getString("address"),
                        rs.getBigDecimal("latitude").doubleValue(),
                        rs.getBigDecimal("longitude").doubleValue()
                ),
                query + "%"
        );
    }
}
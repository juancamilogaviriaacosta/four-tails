
package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    @Query(value = """
        SELECT DISTINCT p.*
        FROM providers p
        INNER JOIN service_fees sf ON p.id = sf.provider_id
        WHERE sf.service_id = :serviceId
        AND p.location IS NOT NULL
        AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326 )::geography, :radiusMeters)
    """, nativeQuery = true)
    List<Provider> findNearbyProviders(
            @Param("serviceId") Long serviceId,
            @Param("longitude") double longitude,
            @Param("latitude") double latitude,
            @Param("radiusMeters") double radiusMeters
    );
}

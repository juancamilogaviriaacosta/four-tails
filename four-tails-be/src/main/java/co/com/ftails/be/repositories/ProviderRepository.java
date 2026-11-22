
package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    @Query(value = """
        SELECT p.*
        FROM providers p
        WHERE p.location IS NOT NULL
          AND ST_DWithin(
              p.location,
              ST_SetSRID(
                  ST_MakePoint(:longitude, :latitude),
                  4326
              )::geography,
              :radiusMeters
          )
        ORDER BY ST_Distance(
            p.location,
            ST_SetSRID(
                ST_MakePoint(:longitude, :latitude),
                4326
            )::geography
        )
        """, nativeQuery = true)
    List<Provider> findNearbyProviders(
            @Param("longitude") double longitude,
            @Param("latitude") double latitude,
            @Param("radiusMeters") double radiusMeters
    );
}


package co.com.ftails.be.services;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

@Service
public class GeoLocationService {

    private static final int SRID = 4326;

    private static final GeometryFactory GEOMETRY_FACTORY =
            new GeometryFactory(new PrecisionModel(), SRID);

    public Point createPoint(Double longitude, Double latitude) {

        if (longitude == null && latitude == null) {
            return null;
        }

        if (longitude == null || latitude == null) {
            throw new IllegalArgumentException(
                    "Longitude and latitude must be provided together."
            );
        }

        if (!Double.isFinite(longitude) || !Double.isFinite(latitude)) {
            throw new IllegalArgumentException(
                    "Coordinates must be valid numbers."
            );
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException(
                    "Longitude must be between -180 and 180."
            );
        }

        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException(
                    "Latitude must be between -90 and 90."
            );
        }

        Point point = GEOMETRY_FACTORY.createPoint(
                new Coordinate(longitude, latitude)
        );

        point.setSRID(SRID);

        return point;
    }
}

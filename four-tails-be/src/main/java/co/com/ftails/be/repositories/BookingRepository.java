package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where b.client.user.id = :userId")
    List<Booking> findBookingsForClient(@Param("userId") Long userId);

    @Query("select b from Booking b where b.provider.user.id = :userId")
    List<Booking> findBookingsForProvider(@Param("userId") Long userId);
}
package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
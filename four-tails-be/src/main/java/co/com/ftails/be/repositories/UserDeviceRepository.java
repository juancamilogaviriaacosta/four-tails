package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDeviceRepository extends JpaRepository<UserDevice, Long> {
    Optional<UserDevice> findByToken(String token);
    List<UserDevice> findByUserIdAndActiveTrue(Long userId);
    Optional<UserDevice> findByIdAndActiveTrue(Long id);
}

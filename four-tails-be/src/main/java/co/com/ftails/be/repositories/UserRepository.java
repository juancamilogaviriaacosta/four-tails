package co.com.ftails.be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

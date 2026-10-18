package co.com.ftails.be.repositories;

import co.com.ftails.be.dtos.UserDto;
import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.User;
import org.springframework.security.core.Authentication;

public interface UserRepository extends JpaRepository <User, Long> {

}

package co.com.ftails.be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.User;

public interface UserRepository extends JpaRepository <User, Long> {
	
}

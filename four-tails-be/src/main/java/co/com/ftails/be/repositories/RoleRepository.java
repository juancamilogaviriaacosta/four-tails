package co.com.ftails.be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.Role;

public interface RoleRepository extends JpaRepository <Role, Long> {
	
}
package co.com.ftails.be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.Service;

public interface ServiceRepository extends JpaRepository <Service, Long> {
	
}

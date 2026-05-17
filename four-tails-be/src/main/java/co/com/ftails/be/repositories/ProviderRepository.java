package co.com.ftails.be.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.com.ftails.be.entities.Provider;

public interface ProviderRepository extends JpaRepository <Provider, Long> {
	
}
package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

}
package co.com.ftails.be.repositories;

import co.com.ftails.be.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("Select c From Client c WHERE c.user.email = :email")
    Client finByUserEmail(String email);
}
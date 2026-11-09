package co.com.ftails.be.entities;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id;

	@Version
	private Long version;
	
	@Column(nullable = false)
    private Instant createdAt;
	
	@Column(nullable = false)
    private Instant updatedAt;
	
	@Column(nullable = false, unique = true)
	private String name;

	@PrePersist
	public void onCreate() {
		createdAt = Instant.now();
		updatedAt = createdAt;
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = Instant.now();
	}
}
package co.com.ftails.be.entities;

import java.time.Instant;

import jakarta.persistence.*;

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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
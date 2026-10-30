package co.com.ftails.be.entities;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "services")
public class Service {
	
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
	
	@Column
	private String name;
	
	@Column
	private String picture;

	@Column(length = 7)
	private String color;
	
	@ManyToMany(mappedBy = "services")
    private List<Provider> providers;
}
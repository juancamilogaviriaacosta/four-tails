package co.com.ftails.be.entities;

import java.awt.*;
import java.time.Instant;
import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "providers")
public class Provider {

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
	private String description;

	@Column
	private Boolean verified;

	@Column
	private Double rating;

	@Column
	private Integer reviews;

	@Column(precision = 10, scale = 2)
	private BigDecimal fare;

	@Column(length = 255)
	private String address;

	@Column(length = 100)
	private String city;

	@Column(length = 100)
	private String neighborhood;

	@JdbcTypeCode(SqlTypes.GEOGRAPHY)
	@Column(columnDefinition = "geography(Point,4326)")
	private Point location;

	@ManyToOne
	private User user;

	@ManyToMany
	@JoinTable(
			name = "provider_services",
			joinColumns = @JoinColumn(name = "provider_id"),
			inverseJoinColumns = @JoinColumn(name = "service_id")
	)
	private List<Service> services;

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
package co.com.ftails.be.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

	@Column(length = 255)
	private String address;

	@Column
	private Double coverageRadius;

	@Column(length = 100)
	private String city;

	@Column(length = 100)
	private String neighborhood;

	@JdbcTypeCode(SqlTypes.GEOGRAPHY)
	@Column(columnDefinition = "geography(Point,4326)")
	private Point location;

	@OneToOne(optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ServiceFee> serviceFees;

	@PrePersist
	public void onCreate() {
		createdAt = Instant.now();
		updatedAt = createdAt;
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = Instant.now();
	}

	public void addServiceFee(ServiceFee serviceFee) {
		if (serviceFees == null) {
			serviceFees = new ArrayList<>();
		}
		serviceFees.add(serviceFee);
		serviceFee.setProvider(this);
	}
}
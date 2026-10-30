package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class BookingDto {
    private Long userId;
    private String userName;
    private Long providerId;
    private String providerName;
    private Long serviceId;
    private String serviceName;
    private Instant startDate;
    private Instant endDate;
    private BigDecimal fare;
    private String pets;
    private String address;
    private String color;
    private String notes;
}

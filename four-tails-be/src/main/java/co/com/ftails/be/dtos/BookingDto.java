package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class BookingDto {
    private Long clientId;
    private String clientName;
    private Long providerId;
    private String providerName;
    private Long serviceId;
    private String serviceName;
    private String serviceColor;
    private Instant startDate;
    private Instant endDate;
    private BigDecimal fare;
    private String pets;
    private String address;
    private String color;
    private String notes;
}

package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class BookingRequestDto {
    private Long clientId;
    private Long providerId;
    private Long serviceId;
    private Instant startDate;
    private Instant endDate;
    private BigDecimal fare;
    private String notes;
}

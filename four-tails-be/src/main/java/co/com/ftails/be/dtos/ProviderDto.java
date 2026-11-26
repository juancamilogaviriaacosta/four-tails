package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ProviderDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String rating;
    private Integer reviews;
    private BigDecimal feeToDisplay;
    private List<ServiceFeeDto> serviceFees;
    private Instant lastSeen;
    private List<String> photos;
    private Double coverageRadius;
    private Double latitude;
    private Double longitude;
}

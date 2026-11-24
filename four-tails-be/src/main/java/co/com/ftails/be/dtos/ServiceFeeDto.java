package co.com.ftails.be.dtos;

import co.com.ftails.be.entities.PricingUnit;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ServiceFeeDto {
    private Long serviceId;
    private String serviceName;
    private BigDecimal amount;
    private String currency;
    private String pricingUnit;
}

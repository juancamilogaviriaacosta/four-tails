package co.com.ftails.be.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddressSuggestionDto {
    private String addressDetailPid;
    private String address;
    private Double latitude;
    private Double longitude;
}

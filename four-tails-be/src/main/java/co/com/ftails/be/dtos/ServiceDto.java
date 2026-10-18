package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ServiceDto {
	
	private Long id;
    private String name;
    private String picture;
    private List<ProviderDto> providers;
}
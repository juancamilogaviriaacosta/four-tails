package co.com.ftails.be.dtos;

import java.util.List;

public class ServiceDto {
	
	private Long id;
    private String name;
    private String picture;
    private List<ProviderDto> providers;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public List<ProviderDto> getProviders() {
		return providers;
	}
	public void setProviders(List<ProviderDto> providers) {
		this.providers = providers;
	}
}
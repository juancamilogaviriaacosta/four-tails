package co.com.ftails.be.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import co.com.ftails.be.dtos.ProviderDto;
import co.com.ftails.be.dtos.ServiceDto;
import co.com.ftails.be.entities.Provider;
import co.com.ftails.be.entities.Service;
import co.com.ftails.be.repositories.ProviderRepository;
import co.com.ftails.be.repositories.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceService {

	@Autowired
	private ServiceRepository sr;
	
	@Autowired
	private ProviderRepository pr;
	
	public ResponseEntity<Map<String, String>> initDatabase() {
		Service service1 = new Service();
		service1.setName("Dog walker");
		service1.setPicture("https://img.magnific.com/fotos-premium/seccion-baja-paseador-perros-caminando-grupo-perros-su-correa-calle_629685-88059.jpg");
		sr.save(service1);
		
		Service service2 = new Service();
		service2.setName("Host");
		service2.setPicture("https://img.magnific.com/fotos-premium/monton-juguetes-perros-sala-estar-muchos-perros-jugando-corriendo-creados-ia-generativa_124507-171711.jpg");
		sr.save(service2);
		
		Provider provider1 = new Provider();
		provider1.setName("Mary");
		provider1.setPicture("https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg");
		provider1.setServices(Arrays.asList(service1, service2));
		pr.save(provider1);
		
		Provider provider2 = new Provider();
		provider2.setName("Martin");
		provider2.setPicture("https://img.magnific.com/foto-gratis/retrato-joven-atractivo-caminando-calle-mochila-sobre-hombros-concepto-urbano_58466-11938.jpg");
		provider2.setServices(Arrays.asList(service1));
		pr.save(provider2);
		
		Provider provider3 = new Provider();
		provider3.setName("Daniel");
		provider3.setPicture("https://img.magnific.com/foto-gratis/persona-hombre-negocios-africano-feliz_1303-2141.jpg");
		provider3.setServices(Arrays.asList(service2));
		pr.save(provider3);
		
		return ResponseEntity.ok(Map.of("message","ok"));
	}

	public ResponseEntity<List<ServiceDto>> getServices() {
		List<Service> services = sr.findAll();
	    List<ServiceDto> response = new ArrayList<>();
	    for (Service service : services) {
	        List<ProviderDto> providers = new ArrayList<>();
	        for (Provider provider : service.getProviders()) {
	            ProviderDto pDto = new ProviderDto();
	            pDto.setId(provider.getId());
	            pDto.setName(provider.getName());
	            pDto.setPicture(provider.getPicture());
	            providers.add(pDto);
	        }
	        ServiceDto sDto = new ServiceDto();
	        sDto.setId(service.getId());
	        sDto.setName(service.getName());
	        sDto.setPicture(service.getPicture());
	        sDto.setProviders(providers);
	        response.add(sDto);
	    }
	    return ResponseEntity.ok(response);
	}
}

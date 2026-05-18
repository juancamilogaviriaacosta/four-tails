package co.com.ftails.be.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import co.com.ftails.be.dtos.ProviderDto;
import co.com.ftails.be.dtos.ServiceDto;
import co.com.ftails.be.entities.IdentityProvider;
import co.com.ftails.be.entities.Provider;
import co.com.ftails.be.entities.Role;
import co.com.ftails.be.entities.RoleType;
import co.com.ftails.be.entities.Service;
import co.com.ftails.be.entities.User;
import co.com.ftails.be.repositories.ProviderRepository;
import co.com.ftails.be.repositories.RoleRepository;
import co.com.ftails.be.repositories.ServiceRepository;
import co.com.ftails.be.repositories.UserRepository;


@org.springframework.stereotype.Service
public class ServiceService {

	@Autowired
	private ServiceRepository sr;
	
	@Autowired
	private UserRepository ur;
	
	@Autowired
	private ProviderRepository pr;
		
	@Autowired
	private RoleRepository rr;
		
	@Transactional
	public ResponseEntity<Map<String, String>> initDatabase() {
		Instant now = Instant.now();
		
		Service service1 = new Service();
		service1.setCreatedAt(now);
		service1.setUpdatedAt(now);
		service1.setName("Dog walker");
		service1.setPicture("https://img.magnific.com/fotos-premium/seccion-baja-paseador-perros-caminando-grupo-perros-su-correa-calle_629685-88059.jpg");
		sr.save(service1);
		
		Service service2 = new Service();
		service2.setCreatedAt(now);
		service2.setUpdatedAt(now);
		service2.setName("Host");
		service2.setPicture("https://img.magnific.com/fotos-premium/monton-juguetes-perros-sala-estar-muchos-perros-jugando-corriendo-creados-ia-generativa_124507-171711.jpg");
		sr.save(service2);
		
		Role roleAdmin = new Role();
		roleAdmin.setCreatedAt(now);
		roleAdmin.setUpdatedAt(now);
		roleAdmin.setName(RoleType.ADMIN.name());
		rr.save(roleAdmin);
		
		Role roleProvider = new Role();
		roleProvider.setCreatedAt(now);
		roleProvider.setUpdatedAt(now);
		roleProvider.setName(RoleType.PROVIDER.name());
		rr.save(roleProvider);
		
		Role roleClient = new Role();
		roleClient.setCreatedAt(now);
		roleClient.setUpdatedAt(now);
		roleClient.setName(RoleType.CLIENT.name());
		rr.save(roleClient);
		
		User user0 = new User();
		user0.setCreatedAt(now);
		user0.setUpdatedAt(now);
		user0.setFirstName("Admin");
		user0.setLastName("Four Tails");
		user0.setEmailVerified(true);
		user0.setEmail("admin.fourtails@example.com");
		user0.setPassword("123456");
		user0.setIdentityProvider(IdentityProvider.LOCAL.name());
		user0.setIdentityProviderId(null);
		user0.setEnabled(true);
		user0.setImageUrl("https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg");
		user0.setRoles(Arrays.asList(roleAdmin));
		ur.save(user0);
		
		User user1 = new User();
		user1.setCreatedAt(now);
		user1.setUpdatedAt(now);
		user1.setFirstName("Mary");
		user1.setLastName("Ortega");
		user1.setEmailVerified(true);
		user1.setEmail("mary.ortega@example.com");
		user1.setPassword("123456");
		user1.setIdentityProvider(IdentityProvider.LOCAL.name());
		user1.setIdentityProviderId(null);
		user1.setEnabled(true);
		user1.setImageUrl("https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg");
		user1.setRoles(Arrays.asList(roleProvider));
		ur.save(user1);
		
		User user2 = new User();
		user2.setCreatedAt(now);
		user2.setUpdatedAt(now);
		user2.setFirstName("Martin");
		user2.setLastName("Gaviria");
		user2.setEmailVerified(true);
		user2.setEmail("martin.gaviria@example.com");
		user2.setPassword("123456");
		user2.setIdentityProvider(IdentityProvider.LOCAL.name());
		user2.setIdentityProviderId(null);
		user2.setEnabled(true);
		user2.setImageUrl("https://img.magnific.com/foto-gratis/retrato-joven-atractivo-caminando-calle-mochila-sobre-hombros-concepto-urbano_58466-11938.jpg");
		user2.setRoles(Arrays.asList(roleProvider));
		ur.save(user2);
		
		User user3 = new User();
		user3.setCreatedAt(now);
		user3.setUpdatedAt(now);
		user3.setFirstName("Daniel");
		user3.setLastName("Gomez");
		user3.setEmailVerified(true);
		user3.setEmail("daniel.gomez@example.com");
		user3.setPassword("123456");
		user3.setIdentityProvider(IdentityProvider.LOCAL.name());
		user3.setIdentityProviderId(null);
		user3.setEnabled(true);
		user3.setImageUrl("https://img.magnific.com/foto-gratis/persona-hombre-negocios-africano-feliz_1303-2141.jpg");
		user3.setRoles(Arrays.asList(roleProvider, roleClient));
		ur.save(user3);
		
		Provider provider1 = new Provider();
		provider1.setCreatedAt(now);
		provider1.setUpdatedAt(now);
		provider1.setDescription(null);
		provider1.setRating(4.9);
		provider1.setVerified(true);
		provider1.setUser(user1);
		provider1.setServices(Arrays.asList(service1, service2));
		pr.save(provider1);
		
		Provider provider2 = new Provider();
		provider2.setCreatedAt(now);
		provider2.setUpdatedAt(now);
		provider2.setDescription(null);
		provider2.setRating(4.8);
		provider2.setVerified(true);
		provider2.setUser(user2);
		provider2.setServices(Arrays.asList(service1));
		pr.save(provider2);
		
		Provider provider3 = new Provider();
		provider3.setCreatedAt(now);
		provider3.setUpdatedAt(now);
		provider3.setDescription(null);
		provider3.setRating(4.7);
		provider3.setVerified(true);
		provider3.setUser(user3);
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
	            pDto.setName(provider.getUser().getFirstName());
	            pDto.setPicture(provider.getUser().getImageUrl());
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

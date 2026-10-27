package co.com.ftails.be.services;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

import co.com.ftails.be.entities.*;
import co.com.ftails.be.repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import co.com.ftails.be.dtos.ProviderDto;
import co.com.ftails.be.dtos.ServiceDto;

@org.springframework.stereotype.Service
@AllArgsConstructor
public class ServiceService {

	private final ServiceRepository sr;
	private final UserRepository ur;
	private final ProviderRepository pr;
	private final RoleRepository rr;
	private final KindOfPetRepository kr;

	@Transactional
	public Map<String, String> initDatabase() {
		Instant now = Instant.now();

		Service service1 = new Service();
		service1.setCreatedAt(now);
		service1.setUpdatedAt(now);
		service1.setName("Hosting");
		service1.setPicture("https://img.magnific.com/fotos-premium/monton-juguetes-perros-sala-estar-muchos-perros-jugando-corriendo-creados-ia-generativa_124507-171711.jpg");
		sr.save(service1);

		Service service2 = new Service();
		service2.setCreatedAt(now);
		service2.setUpdatedAt(now);
		service2.setName("Sitting");
		sr.save(service2);

		Service service3 = new Service();
		service3.setCreatedAt(now);
		service3.setUpdatedAt(now);
		service3.setName("Daycare");
		sr.save(service3);

		Service service4 = new Service();
		service4.setCreatedAt(now);
		service4.setUpdatedAt(now);
		service4.setName("House visits");
		sr.save(service4);

		Service service5 = new Service();
		service5.setCreatedAt(now);
		service5.setUpdatedAt(now);
		service5.setName("Walking");
		service5.setPicture("https://img.magnific.com/fotos-premium/seccion-baja-paseador-perros-caminando-grupo-perros-su-correa-calle_629685-88059.jpg");
		sr.save(service5);

		Service service6 = new Service();
		service6.setCreatedAt(now);
		service6.setUpdatedAt(now);
		service6.setName("Grooming");
		sr.save(service6);

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
        user0.setAddress("Williamsburg, Brooklyn, NY");
        user0.setEmailVerified(true);
        user0.setEmail("admin.fourtails@example.com");
        user0.setPassword("123456");
        user0.setIdentityProvider(IdentityProvider.LOCAL.name());
        user0.setIdentityProviderId(null);
        user0.setEnabled(true);
        user0.setRoles(Arrays.asList(roleAdmin));
        user0.setPhotos(createPhotos(user0,
            "https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg"
        ));
        ur.save(user0);

        User user1 = new User();
        user1.setCreatedAt(now);
        user1.setUpdatedAt(now);
        user1.setFirstName("Ashley");
        user1.setLastName("Dombrowsky");
        user1.setAddress("Williamsburg, Brooklyn, NY");
        user1.setEmailVerified(true);
        user1.setEmail("Ashley.dombrowsky@example.com");
        user1.setPassword("123456");
        user1.setIdentityProvider(IdentityProvider.LOCAL.name());
        user1.setIdentityProviderId(null);
        user1.setEnabled(true);
        user1.setRoles(Arrays.asList(roleProvider));
        user1.setLastSeen(now);
        user1.setPhotos(createPhotos(user1,
            "https://img.magnific.com/foto-gratis/vista-frontal-hermosa-mujer-abrazando-su-gato-atigrado-parque_23-2148045835.jpg",
            "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user1);

        User user2 = new User();
        user2.setCreatedAt(now);
        user2.setUpdatedAt(now);
        user2.setFirstName("Maya");
        user2.setLastName("Watson");
        user2.setAddress("Williamsburg, Brooklyn, NY");
        user2.setEmailVerified(true);
        user2.setEmail("maya.watson@example.com");
        user2.setPassword("123456");
        user2.setIdentityProvider(IdentityProvider.LOCAL.name());
        user2.setIdentityProviderId(null);
        user2.setEnabled(true);
        user2.setRoles(Arrays.asList(roleProvider));
        user2.setLastSeen(now);
        user2.setPhotos(createPhotos(user2,
                "https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user2);

        User user3 = new User();
        user3.setCreatedAt(now);
        user3.setUpdatedAt(now);
        user3.setFirstName("Liam");
        user3.setLastName("Parker");
        user3.setAddress("Williamsburg, Brooklyn, NY");
        user3.setEmailVerified(true);
        user3.setEmail("liam.parker@example.com");
        user3.setPassword("123456");
        user3.setIdentityProvider(IdentityProvider.LOCAL.name());
        user3.setIdentityProviderId(null);
        user3.setEnabled(true);
        user3.setRoles(Arrays.asList(roleProvider));
        user3.setLastSeen(now);
        user3.setPhotos(createPhotos(user3,
                "https://img.magnific.com/foto-gratis/paseo-matutino-perro_158595-4280.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user3);

        User user4 = new User();
        user4.setCreatedAt(now);
        user4.setUpdatedAt(now);
        user4.setFirstName("Jenny");
        user4.setLastName("Anderson");
        user4.setAddress("Williamsburg, Brooklyn, NY");
        user4.setEmailVerified(true);
        user4.setEmail("jenny.anderson@example.com");
        user4.setPassword("123456");
        user4.setIdentityProvider(IdentityProvider.LOCAL.name());
        user4.setIdentityProviderId(null);
        user4.setEnabled(true);
        user4.setRoles(Arrays.asList(roleProvider));
        user4.setLastSeen(now);
        user4.setPhotos(createPhotos(user4,
                "https://img.magnific.com/foto-gratis/vista-joven-mujer-caucasica-jugando-entrenando-su-perro-dalmata_158595-7698.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user4);

        User user5 = new User();
        user5.setCreatedAt(now);
        user5.setUpdatedAt(now);
        user5.setFirstName("Martin");
        user5.setLastName("Dawson");
        user5.setAddress("Williamsburg, Brooklyn, NY");
        user5.setEmailVerified(true);
        user5.setEmail("martin.dawson@example.com");
        user5.setPassword("123456");
        user5.setIdentityProvider(IdentityProvider.LOCAL.name());
        user5.setIdentityProviderId(null);
        user5.setEnabled(true);
        user5.setRoles(Arrays.asList(roleProvider));
        user5.setLastSeen(now);
        user5.setPhotos(createPhotos(user5,
                "https://img.magnific.com/foto-gratis/retrato-joven-atractivo-caminando-calle-mochila-sobre-hombros-concepto-urbano_58466-11938.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user5);

        User user6 = new User();
        user6.setCreatedAt(now);
        user6.setUpdatedAt(now);
        user6.setFirstName("Sarah");
        user6.setLastName("Chen");
        user6.setAddress("Williamsburg, Brooklyn, NY");
        user6.setEmailVerified(true);
        user6.setEmail("sarah.chen@example.com");
        user6.setPassword("123456");
        user6.setIdentityProvider(IdentityProvider.LOCAL.name());
        user6.setIdentityProviderId(null);
        user6.setEnabled(true);
        user6.setRoles(Arrays.asList(roleProvider));
        user6.setLastSeen(now);
        user6.setPhotos(createPhotos(user6,
                "https://img.magnific.com/foto-gratis/mujer-asiatica-paseando-su-perro-husky-al-aire-libre_23-2150764844.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user6);

        User user7 = new User();
        user7.setCreatedAt(now);
        user7.setUpdatedAt(now);
        user7.setFirstName("Lilian");
        user7.setLastName("Alper");
        user7.setAddress("Williamsburg, Brooklyn, NY");
        user7.setEmailVerified(true);
        user7.setEmail("lilian.alper@example.com");
        user7.setPassword("123456");
        user7.setIdentityProvider(IdentityProvider.LOCAL.name());
        user7.setIdentityProviderId(null);
        user7.setEnabled(true);
        user7.setRoles(Arrays.asList(roleProvider));
        user7.setLastSeen(now);
        user7.setPhotos(createPhotos(user7,
                "https://img.magnific.com/foto-gratis/persona-que-trabaja-casa-perro-mascota_23-2149104714.jpg",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85",
                "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85"
        ));
        ur.save(user7);
		
		Provider provider1 = new Provider();
		provider1.setCreatedAt(now);
		provider1.setUpdatedAt(now);
		provider1.setDescription("Calm, attentive care for dogs who love a little extra company.");
		provider1.setRating(4.9);
        provider1.setReviews(12);
        provider1.setFare(BigDecimal.valueOf(30));
		provider1.setVerified(true);
		provider1.setUser(user1);
		provider1.setServices(Arrays.asList(service1, service2));
		pr.save(provider1);
		
		Provider provider2 = new Provider();
		provider2.setCreatedAt(now);
		provider2.setUpdatedAt(now);
        provider2.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider2.setRating(4.9);
        provider2.setReviews(12);
        provider2.setFare(BigDecimal.valueOf(30));
		provider2.setVerified(true);
		provider2.setUser(user2);
		provider2.setServices(Arrays.asList(service1));
		pr.save(provider2);
		
		Provider provider3 = new Provider();
		provider3.setCreatedAt(now);
		provider3.setUpdatedAt(now);
        provider3.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider3.setRating(4.9);
        provider3.setReviews(12);
        provider3.setFare(BigDecimal.valueOf(30));
		provider3.setVerified(true);
		provider3.setUser(user3);
		provider3.setServices(Arrays.asList(service2));
		pr.save(provider3);

        Provider provider4 = new Provider();
        provider4.setCreatedAt(now);
        provider4.setUpdatedAt(now);
        provider4.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider4.setRating(4.9);
        provider4.setReviews(12);
        provider4.setFare(BigDecimal.valueOf(30));
        provider4.setVerified(true);
        provider4.setUser(user4);
        provider4.setServices(Arrays.asList(service2));
        pr.save(provider4);

        Provider provider5 = new Provider();
        provider5.setCreatedAt(now);
        provider5.setUpdatedAt(now);
        provider5.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider5.setRating(4.9);
        provider5.setReviews(12);
        provider5.setFare(BigDecimal.valueOf(30));
        provider5.setVerified(true);
        provider5.setUser(user5);
        provider5.setServices(Arrays.asList(service2));
        pr.save(provider5);

        Provider provider6 = new Provider();
        provider6.setCreatedAt(now);
        provider6.setUpdatedAt(now);
        provider6.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider6.setRating(4.9);
        provider6.setReviews(12);
        provider6.setFare(BigDecimal.valueOf(30));
        provider6.setVerified(true);
        provider6.setUser(user6);
        provider6.setServices(Arrays.asList(service2));
        pr.save(provider6);

        Provider provider7 = new Provider();
        provider7.setCreatedAt(now);
        provider7.setUpdatedAt(now);
        provider7.setDescription("Calm, attentive care for dogs who love a little extra company.");
        provider7.setRating(4.9);
        provider7.setReviews(12);
        provider7.setFare(BigDecimal.valueOf(30));
        provider7.setVerified(true);
        provider7.setUser(user7);
        provider7.setServices(Arrays.asList(service2));
        pr.save(provider7);

		KindOfPet kp1 =  new KindOfPet();
		kp1.setCreatedAt(now);
		kp1.setUpdatedAt(now);
		kp1.setName("Dog");
		kr.save(kp1);

		KindOfPet kp2 =  new KindOfPet();
		kp2.setCreatedAt(now);
		kp2.setUpdatedAt(now);
		kp2.setName("Cat");
		kr.save(kp2);

		KindOfPet kp3 =  new KindOfPet();
		kp3.setCreatedAt(now);
		kp3.setUpdatedAt(now);
		kp3.setName("Bird");
		kr.save(kp3);
		return Map.of("message","ok");
	}

    private List<UserPhoto> createPhotos(User user, String ... urls) {
        Instant now = Instant.now();
        List<UserPhoto> photos = new ArrayList<>();
        for (int i = 0; i < urls.length ; i++) {
            UserPhoto photo = new UserPhoto();
            photo.setCreatedAt(now);
            photo.setUpdatedAt(now);
            photo.setUrl(urls[i]);
            photo.setPrimary(i==0);
            photo.setUser(user);
            photos.add(photo);
        }
        return photos;
    }

    public List<ServiceDto> getServices() {
		List<Service> services = sr.findAll();
	    List<ServiceDto> response = new ArrayList<>();
	    for (Service service : services) {
	        List<ProviderDto> providers = new ArrayList<>();
	        for (Provider provider : service.getProviders()) {
	            ProviderDto pDto = new ProviderDto();
	            pDto.setId(provider.getId());
	            pDto.setName(provider.getUser().getFirstName());
	            providers.add(pDto);
	        }
	        ServiceDto sDto = new ServiceDto();
	        sDto.setId(service.getId());
	        sDto.setName(service.getName());
	        sDto.setPicture(service.getPicture());
	        sDto.setProviders(providers);
	        response.add(sDto);
	    }
	    return response;
	}

    public List<ProviderDto> getProviders(String pets, String address, String service, String startDate, String endDate) {
        List<ProviderDto> response = new ArrayList<>();
        List<Provider> all = pr.findAll();
        for (Provider provider : all) {
            ProviderDto dto = new ProviderDto();
            dto.setId(provider.getId());
            dto.setName(provider.getUser().getFirstName() + " " + provider.getUser().getLastName());
            dto.setDescription(provider.getDescription());
            dto.setAddress(provider.getUser().getAddress());
            dto.setRating(provider.getRating() == null ? null : String.valueOf(provider.getRating()));
            dto.setReviews(provider.getReviews());
            dto.setFare(provider.getFare());
            dto.setLastSeen(provider.getUser().getLastSeen());
            dto.setPhotos(provider.getUser().getPhotos().stream().map(UserPhoto::getUrl).toList());
            response.add(dto);
        }
        return response;
    }

    public ProviderDto getProvider(Long id) {
        Provider provider = pr.findById(id).get();
        ProviderDto dto = new ProviderDto();
        dto.setId(provider.getId());
        dto.setName(provider.getUser().getFirstName() + " " + provider.getUser().getLastName());
        dto.setDescription(provider.getDescription());
        dto.setAddress(provider.getUser().getAddress());
        dto.setRating(provider.getRating() == null ? null : String.valueOf(provider.getRating()));
        dto.setReviews(provider.getReviews());
        dto.setFare(provider.getFare());
        dto.setLastSeen(provider.getUser().getLastSeen());
        dto.setPhotos(provider.getUser().getPhotos().stream().map(UserPhoto::getUrl).toList());
        return dto;
    }
}

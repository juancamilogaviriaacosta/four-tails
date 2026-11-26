package co.com.ftails.be.services;

import co.com.ftails.be.dtos.ProviderDto;
import co.com.ftails.be.dtos.ServiceFeeDto;
import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.entities.*;
import co.com.ftails.be.repositories.*;
import co.com.ftails.be.util.JwtService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@AllArgsConstructor
public class UserService {

    private final UserRepository ur;
    private final RoleRepository rr;
    private final ClientRepository cr;
    private final ServiceRepository sr;
    private final ProviderRepository pr;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserDto signUp(Authentication authentication, UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setIdentityProvider(IdentityProvider.LOCAL.name());
        user.setEnabled(true);
        user.setEmailVerified(false);
        user.setRoles(Arrays.asList(rr.findByName(RoleType.CLIENT.name())));
        User savedUser = ur.save(user);

        Client client = new Client();
        client.setUser(user);
        cr.save(client);
        return userToDto(savedUser);
    }

    public String authenticate(String email, String password) {
        if (email == null || password == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = ur.findByEmail(email)
                .filter(candidate -> passwordEncoder.matches(password, candidate.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        return jwtService.generateToken(user);
    }

    private UserDto userToDto(User user) {
        UserDto response = new UserDto();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRoles().getFirst().getName());
        response.setBirthDate(user.getBirthDate());
        response.setAddress(user.getAddress());
        response.setPhone(user.getPhone());
        response.setToken(jwtService.generateToken(user));
        return response;
    }

    public UserDto getProfile(Long id) {
        User user = ur.findById(id).get();
        return userToDto(user);
    }

    public UserDto setProfile(UserDto userDto) {
        User user = ur.findById(userDto.getId()).get();
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setBirthDate(userDto.getBirthDate());
        user.setAddress(userDto.getAddress());
        user.setPhone(userDto.getPhone());
        User savedUser = ur.save(user);
        return userToDto(savedUser);
    }

    public ProviderDto getProvider(Authentication authentication) {
        Provider provider = pr.findByUserEmail(authentication.getName()).get();
        return providerToDto(provider);
    }

    @Transactional
    public ProviderDto setSitterProfile(ProviderDto providerDto, Authentication authentication) {
        String email = authentication.getName();
        Provider provider = pr.findByUserEmail(email)
            .orElseGet(() -> {
                Provider newProvider = new Provider();
                User user = ur.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
                newProvider.setUser(user);
                newProvider.setVerified(false);
                return newProvider;
            });

        provider.setAddress(providerDto.getAddress());
        provider.setCoverageRadius(providerDto.getCoverageRadius());

        if (providerDto.getLatitude() != null && providerDto.getLongitude() != null) {
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
            Point location = geometryFactory.createPoint(new Coordinate(providerDto.getLongitude(), providerDto.getLatitude()));
            provider.setLocation(location);
        }

        provider.setServiceFees(new ArrayList<>());
        for (ServiceFeeDto feeDto : providerDto.getServiceFees()) {
            Service service = sr.findById(feeDto.getServiceId()).orElseThrow(() -> new EntityNotFoundException("Service not found: " + feeDto.getServiceId()));
            ServiceFee serviceFee = new ServiceFee();
            serviceFee.setService(service);
            serviceFee.setAmount(feeDto.getAmount());
            serviceFee.setCurrency(feeDto.getCurrency());
            provider.addServiceFee(serviceFee);
        }
        Provider savedProvider = pr.save(provider);
        return providerToDto(savedProvider);
    }

    private ProviderDto providerToDto(Provider savedProvider) {
        ProviderDto dto = new ProviderDto();
        dto.setId(savedProvider.getId());
        dto.setName(savedProvider.getUser().getFirstName() + " " + savedProvider.getUser().getLastName());
        dto.setDescription(savedProvider.getDescription());
        dto.setAddress(savedProvider.getAddress());
        dto.setRating(savedProvider.getRating() != null ? savedProvider.getRating().toString() : null);
        dto.setReviews(savedProvider.getReviews());
        dto.setLastSeen(savedProvider.getUser().getLastSeen());
        dto.setCoverageRadius(savedProvider.getCoverageRadius());
        if (savedProvider.getLocation() != null) {
            dto.setLatitude(savedProvider.getLocation().getY());
            dto.setLongitude(savedProvider.getLocation().getX());
        }
        if (savedProvider.getServiceFees() != null) {
            List<ServiceFeeDto> serviceFees = new ArrayList<>();
            for (ServiceFee serviceFee : savedProvider.getServiceFees()) {
                ServiceFeeDto serviceFeeDto = new ServiceFeeDto();
                serviceFeeDto.setServiceId(serviceFee.getService().getId());
                serviceFeeDto.setServiceName(serviceFee.getService().getName());
                serviceFeeDto.setAmount(serviceFee.getAmount());
                serviceFeeDto.setCurrency(serviceFee.getCurrency());
                serviceFeeDto.setPricingUnit(serviceFee.getService().getPricingUnit().name());
                serviceFees.add(serviceFeeDto);
            }
            dto.setServiceFees(serviceFees);
        }
        if (savedProvider.getUser().getPhotos() != null) {
            List<String> photos = new ArrayList<>();
            for (UserPhoto photo : savedProvider.getUser().getPhotos()) {
                photos.add(photo.getUrl());
            }
            dto.setPhotos(photos);
        }
        return dto;
    }
}

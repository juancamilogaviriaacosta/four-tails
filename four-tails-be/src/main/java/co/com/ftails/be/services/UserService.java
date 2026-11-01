package co.com.ftails.be.services;

import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.entities.*;
import co.com.ftails.be.repositories.ClientRepository;
import co.com.ftails.be.repositories.RoleRepository;
import co.com.ftails.be.repositories.UserRepository;
import co.com.ftails.be.util.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository ur;
    private final RoleRepository rr;
    private final ClientRepository cr;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserDto signUp(Authentication authentication, UserDto userDto) {
        Instant now = Instant.now();
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setIdentityProvider(IdentityProvider.LOCAL.name());
        user.setEnabled(true);
        user.setEmailVerified(false);
        user.setRoles(Arrays.asList(rr.findByName(RoleType.CLIENT.name())));
        User savedUser = ur.save(user);

        Client client = new Client();
        client.setCreatedAt(now);
        client.setUpdatedAt(now);
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
        user.setUpdatedAt(Instant.now());
        User savedUser = ur.save(user);
        return userToDto(savedUser);
    }
}

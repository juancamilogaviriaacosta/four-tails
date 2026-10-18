package co.com.ftails.be.services;

import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.entities.IdentityProvider;
import co.com.ftails.be.entities.User;
import co.com.ftails.be.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository ur;

    public String signUp(Authentication authentication, UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPassword(userDto.getPassword());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setIdentityProvider(IdentityProvider.LOCAL.name());
        user.setEnabled(true);
        user.setEmailVerified(false);
        ur.save(user);
        return "ok";
    }
}

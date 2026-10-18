package co.com.ftails.be.controllers;

import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserService us;

    @PostMapping(path = "api/signUp", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> signUp(Authentication authentication, @RequestBody UserDto userDto) {
        String response = us.signUp(authentication, userDto);
        return ResponseEntity.ok(response);
    }
}

package co.com.ftails.be.controllers;

import co.com.ftails.be.dtos.BookingDto;
import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserService us;

    @PostMapping(path = "api/signUp", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> signUp(Authentication authentication, @RequestBody UserDto userDto) {
        UserDto response = us.signUp(authentication, userDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/getProfile/{id}")
    public ResponseEntity<UserDto> getProfile(@PathVariable("id") Long id) {
        UserDto response = us.getProfile(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "api/setProfile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> setProfile(@RequestBody UserDto userDto) {
        UserDto response = us.setProfile(userDto);
        return ResponseEntity.ok(response);
    }
}

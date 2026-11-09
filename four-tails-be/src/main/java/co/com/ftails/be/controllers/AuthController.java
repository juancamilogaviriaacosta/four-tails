package co.com.ftails.be.controllers;

import co.com.ftails.be.dtos.RegisterDeviceDto;
import co.com.ftails.be.dtos.UserDto;
import co.com.ftails.be.entities.User;
import co.com.ftails.be.services.UserDeviceService;
import co.com.ftails.be.services.UserService;
import lombok.AllArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserDeviceService userDeviceService;

    @PostMapping(path = "/api/auth")
    public ResponseEntity<Map<String, String>> auth(@RequestBody UserDto userDto) {
        String token = userService.authenticate(userDto.getEmail(), userDto.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("api/devices/register")
    public ResponseEntity<Void> register(@RequestBody RegisterDeviceDto registerDeviceDto, Authentication authentication) {
        userDeviceService.register(registerDeviceDto, authentication);
        return ResponseEntity.ok().build();
    }
}

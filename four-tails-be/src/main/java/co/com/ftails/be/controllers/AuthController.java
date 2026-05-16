package co.com.ftails.be.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
	
	@GetMapping("/")
    public String hola() {
        return "Hola Mundo";
    }

}

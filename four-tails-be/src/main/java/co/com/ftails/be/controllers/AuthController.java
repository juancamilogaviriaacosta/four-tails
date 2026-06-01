package co.com.ftails.be.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
	
	@PostMapping(path = "/api/auth")
    public ResponseEntity<Map<String, String>> auth(@RequestBody Map<String, String> map) {
		try {
			Thread.sleep(1000);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(Map.of("token","ASEFNLSKJFNLKASENFKLASD=="));
	}

}

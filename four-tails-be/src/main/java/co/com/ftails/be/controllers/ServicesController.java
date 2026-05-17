package co.com.ftails.be.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.ftails.be.dtos.ServiceDto;
import co.com.ftails.be.services.ServiceService;

@RestController
public class ServicesController {
	
	@Autowired
	private ServiceService ss;
	
	@GetMapping("api/initDatabase")
    public ResponseEntity<Map<String, String>> initDatabase() {
        return ss.initDatabase();
    }
	
	@GetMapping("api/getServices")
    public ResponseEntity<List<ServiceDto>> getServices() {
        return ss.getServices();
    }
}

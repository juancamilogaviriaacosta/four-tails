package co.com.ftails.be.controllers;

import java.util.List;
import java.util.Map;

import co.com.ftails.be.dtos.KindOfPetDto;
import co.com.ftails.be.services.KindOfPetService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.ftails.be.dtos.ServiceDto;
import co.com.ftails.be.services.ServiceService;

@RestController
@AllArgsConstructor
public class ServicesController {

	private final ServiceService ss;
    private final KindOfPetService ks;
	
	@GetMapping("/api/initDatabase")
    public ResponseEntity<Map<String, String>> initDatabase() {
        return ResponseEntity.ok(ss.initDatabase());
    }
	
	@GetMapping("/api/getServices")
    public ResponseEntity<List<ServiceDto>> getServices() {
        return ResponseEntity.ok(ss.getServices());
    }

    @GetMapping("/api/getKindOfPets")
    public ResponseEntity<List<KindOfPetDto>> getKindOfPets() {
        return ResponseEntity.ok(ks.getKindOfPets());
    }
}

package co.com.ftails.be.controllers;

import java.util.List;
import java.util.Map;

import co.com.ftails.be.dtos.KindOfPetDto;
import co.com.ftails.be.dtos.ProviderDto;
import co.com.ftails.be.dtos.BookingRequestDto;
import co.com.ftails.be.services.KindOfPetService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/api/getProviders")
    public ResponseEntity<List<ProviderDto>> getProviders(
            @RequestParam(defaultValue = "") String pets,
            @RequestParam(defaultValue = "") String address,
            @RequestParam(defaultValue = "") String service,
            @RequestParam(defaultValue = "") String startDate,
            @RequestParam(defaultValue = "") String endDate) {
        return ResponseEntity.ok(ss.getProviders(pets, address, service, startDate, endDate));
    }

    @GetMapping("/api/getProvider/{id}")
    public ResponseEntity<ProviderDto> getProvider(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ss.getProvider(id));
    }

    @PostMapping("/api/confirmBooking")
    public ResponseEntity<Map<String, String>> confirmBooking(@RequestBody BookingRequestDto bookingRequestDto) {
        return ResponseEntity.ok(ss.confirmBooking(bookingRequestDto));
    }
}

package co.com.ftails.be.controllers;

import co.com.ftails.be.services.FirebaseMessagingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class NotificationTestController {

    private final FirebaseMessagingService firebaseMessagingService;

    public NotificationTestController(FirebaseMessagingService firebaseMessagingService) {
        this.firebaseMessagingService = firebaseMessagingService;
    }

    //TODO REMOVE
    @PostMapping("/api/notifications/test")
    public ResponseEntity<String> test(@RequestParam String token) throws Exception {
        String messageId = firebaseMessagingService.sendNotification(token, "4Tails 🐾", "¡Las notificaciones están funcionando!", "");
        return ResponseEntity.ok(messageId);
    }
}
package co.com.ftails.be.controllers;

import co.com.ftails.be.dtos.NotificationDto;
import co.com.ftails.be.entities.User;
import co.com.ftails.be.repositories.UserRepository;
import co.com.ftails.be.services.FirebaseMessagingService;
import co.com.ftails.be.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class NotificationController {
    private final FirebaseMessagingService firebaseMessagingService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    /*TODO REMOVE*/
    @PostMapping("/api/notifications/test")
    public ResponseEntity<String> test(@RequestParam String token) throws Exception {
        String messageId = firebaseMessagingService.sendNotification(token, "4Tails 🐾", "¡Las notificaciones están funcionando!", "");
        return ResponseEntity.ok(messageId);
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        return user.getId();
    }

    @GetMapping("/api/notifications/getNotifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @GetMapping("/api/notifications/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @PatchMapping("/api/notifications/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.noContent().build();
    }
}
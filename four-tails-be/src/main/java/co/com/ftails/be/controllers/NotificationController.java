package co.com.ftails.be.controllers;

import co.com.ftails.be.dtos.NotificationDto;
import co.com.ftails.be.entities.NotificationType;
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
    @PostMapping("/api/notifications/sendNotificationAllDevices")
    public ResponseEntity<String> sendNotificationAllDevices(Authentication authentication) throws Exception {
        notificationService.sendToUser(
                getAuthenticatedUserId(authentication),
                "Booking TEST confirmed",
                "Your booking has been confirmed!",
                NotificationType.BOOKING_CONFIRMED,
                "/my-bookings",
                "BOOKING",
                1L);
        return ResponseEntity.ok("ok");
    }

    /*TODO REMOVE*/
    @PostMapping("/api/notifications/sendNotification")
    public ResponseEntity<String> sendNotification(@RequestParam String token, Authentication authentication) throws Exception {
        String messageId = firebaseMessagingService.sendNotification(token, "4Tails 🐾", "¡Las notificaciones están funcionando!", "/my-bookings");
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

    @GetMapping("/api/notifications/getUnreadCount")
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
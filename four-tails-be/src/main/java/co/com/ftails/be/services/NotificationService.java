
package co.com.ftails.be.services;

import co.com.ftails.be.entities.*;
import co.com.ftails.be.repositories.NotificationRepository;
import co.com.ftails.be.repositories.UserDeviceRepository;
import co.com.ftails.be.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserDeviceRepository userDeviceRepository;
    private final FirebaseMessagingService firebaseMessagingService;

    @Transactional
    public Notification sendToUser(Long userId, String title, String body, NotificationType type, String actionUrl, String referenceType, Long referenceId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType(type);
        notification.setActionUrl(actionUrl);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notification = notificationRepository.save(notification);

        List<UserDevice> devices = userDeviceRepository.findByUserIdAndActiveTrue(userId);
        for (UserDevice device : devices) {
            try {
                firebaseMessagingService.sendNotification(device.getToken(), title, body, actionUrl);
            } catch (Exception e) {
                log.error("Failed to send notification to device {}", device.getId(), e);
            }
        }
        return notification;
    }
}

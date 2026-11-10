package co.com.ftails.be.dtos;

import co.com.ftails.be.entities.Notification;

import java.time.Instant;

public record NotificationDto(Long id, String title, String body, String type, boolean read, Instant readAt,
                              String actionUrl, String referenceType, Long referenceId, Instant createdAt) {
    public static NotificationDto from(Notification notification) {
        return new NotificationDto(notification.getId(), notification.getTitle(), notification.getBody(),
                notification.getType().name(), notification.isRead(), notification.getReadAt(), notification.getActionUrl(),
                notification.getReferenceType(), notification.getReferenceId(), notification.getCreatedAt());
    }
}

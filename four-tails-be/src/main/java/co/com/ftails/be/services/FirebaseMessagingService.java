
package co.com.ftails.be.services;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class FirebaseMessagingService {

    public String sendNotification(String token, String title, String body, String url) throws Exception {
        Message message = Message.builder()
                .setToken(token)
                .setNotification(
                        com.google.firebase.messaging.Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build()
                )
                .putData("title", title)
                .putData("body", body)
                .putData("url", url != null ? url : "/")
                .build();
        return FirebaseMessaging.getInstance().send(message);
    }
}

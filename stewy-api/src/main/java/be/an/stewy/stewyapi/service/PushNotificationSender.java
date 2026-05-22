package be.an.stewy.stewyapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@Service
public class PushNotificationSender implements NotificationSender {

    private static final String EXPO_PUSH_API = "https://exp.host/--/api/v2/push/send";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public PushNotificationSender(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
    }

    @Override
    public void send(NotificationEvent event, String pushToken) {
        if (pushToken == null || pushToken.isBlank()) return;

        try {
            Map<String, Object> body = Map.of(
                    "to", pushToken,
                    "title", event.type().name().replace("_", " "),
                    "body", event.message(),
                    "data", Map.of(
                            "type", event.type().name(),
                            "gameId", event.gameId() != null ? event.gameId().toString() : "",
                            "volunteerId", event.targetVolunteerId() != null ? event.targetVolunteerId().toString() : ""
                    )
            );

            String json = objectMapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EXPO_PUSH_API))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            // Log and silently fail - push notifications are best-effort
            System.err.println("Failed to send push notification: " + e.getMessage());
        }
    }
}

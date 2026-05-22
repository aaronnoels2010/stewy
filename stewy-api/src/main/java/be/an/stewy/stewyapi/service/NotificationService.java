package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final List<NotificationSender> senders;
    private final VolunteerRepository volunteerRepository;

    public NotificationService(List<NotificationSender> senders, VolunteerRepository volunteerRepository) {
        this.senders = senders;
        this.volunteerRepository = volunteerRepository;
    }

    public void dispatch(NotificationEvent event) {
        if (event.targetVolunteerId() != null) {
            String volunteerTopic = "/topic/volunteer/" + event.targetVolunteerId() + "/notifications";
            sendToWebSocket(event, volunteerTopic);

            Volunteer volunteer = volunteerRepository.findByVolunteerId(event.targetVolunteerId());
            if (volunteer != null && volunteer.getUser() != null
                    && volunteer.getUser().getPushToken() != null
                    && !volunteer.getUser().getPushToken().isBlank()) {
                sendToPush(event, volunteer.getUser().getPushToken());
            }
        }

        if (event.targetClubId() != null) {
            String clubTopic = "/topic/club/" + event.targetClubId() + "/notifications";
            sendToWebSocket(event, clubTopic);
        }
    }

    private void sendToWebSocket(NotificationEvent event, String destination) {
        senders.stream()
                .filter(s -> s instanceof WebSocketNotificationSender)
                .forEach(s -> s.send(event, destination));
    }

    private void sendToPush(NotificationEvent event, String pushToken) {
        senders.stream()
                .filter(s -> s instanceof PushNotificationSender)
                .forEach(s -> s.send(event, pushToken));
    }
}

package be.an.stewy.stewyapi.service;

public interface NotificationSender {
    void send(NotificationEvent event, String destination);
}

package be.an.stewy.stewyapi.service;

import java.util.UUID;

public record NotificationEvent(
        NotificationType type,
        UUID targetVolunteerId,
        UUID targetClubId,
        UUID gameId,
        String message
) {
    public enum NotificationType {
        INVITE_SENT,
        INVITE_ACCEPTED,
        INVITE_REJECTED,
        REQUEST_SUBMITTED,
        REQUEST_APPROVED,
        REQUEST_REJECTED,
        PARTICIPATION_CANCELLED,
        PARTICIPATION_WITHDRAWN,
        CLUB_MEMBERSHIP_PENDING,
        CLUB_MEMBERSHIP_APPROVED
    }
}

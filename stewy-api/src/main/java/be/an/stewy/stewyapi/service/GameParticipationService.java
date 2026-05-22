package be.an.stewy.stewyapi.service;

import java.util.List;
import java.util.UUID;

public interface GameParticipationService {
    void requestParticipation(UUID volunteerId, UUID gameId);
    void approveParticipation(UUID volunteerId, UUID gameId);
    void rejectParticipation(UUID volunteerId, UUID gameId);

    void approveByHoofdSteward(UUID gameId, UUID volunteerId);
    void rejectByHoofdSteward(UUID gameId, UUID volunteerId);

    void inviteVolunteer(UUID gameId, UUID volunteerId);
    void acceptInvitation(UUID volunteerId, UUID gameId);
    void declineInvitation(UUID volunteerId, UUID gameId);

    void cancelParticipation(UUID gameId, UUID volunteerId);
    void withdrawParticipation(UUID volunteerId, UUID gameId);

    List<VolunteerGameDto> getPendingRequestsForGame(UUID gameId);
    List<VolunteerGameDto> getInvitationsForVolunteer(UUID volunteerId);
}

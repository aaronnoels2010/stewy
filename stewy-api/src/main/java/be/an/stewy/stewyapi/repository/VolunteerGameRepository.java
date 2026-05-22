package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.domain.VolunteerGame;

import java.util.List;
import java.util.UUID;

public interface VolunteerGameRepository {
    List<VolunteerGame> findGamesWithParticipationStatus(UUID volunteerId);
    void assignVolunteerToGame(VolunteerGame volunteerGame);
    VolunteerGame findByVolunteerIdAndGameId(UUID volunteerId, UUID gameId);
    List<VolunteerGame> findByGameId(UUID gameId);
    void update(VolunteerGame volunteerGame);
}

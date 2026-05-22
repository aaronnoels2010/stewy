package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.domain.Volunteer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public interface VolunteerRepository {
    void saveVolunteer(Volunteer volunteer);

    Volunteer findByVolunteerId(UUID id);

    Volunteer findByUserId(UUID userId);

    void deleteVolunteer(Volunteer newVolunteer);

    List<Volunteer> findAllVolunteers(Sort sort, Pageable pageable);

    void deleteAllVolunteers(List<Volunteer> volunteers);

    long totalCountVolunteers();

    void update(Volunteer volunteer1);

    void assignVolunteerToGame(UUID volunteerId, UUID gameId);
    List<Volunteer> findByProfileStatus(String profileStatus);
    List<Volunteer> findByClubIdAndClubStatus(UUID clubId, String clubStatus);
    List<Volunteer> findByClubId(UUID clubId);
}

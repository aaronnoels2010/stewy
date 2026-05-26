package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthorizationService {

    private final VolunteerRepository volunteerRepository;
    private final GameRepository gameRepository;

    public AuthorizationService(VolunteerRepository volunteerRepository, GameRepository gameRepository) {
        this.volunteerRepository = volunteerRepository;
        this.gameRepository = gameRepository;
    }

    public Volunteer getCurrentVolunteer(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        Volunteer volunteer = volunteerRepository.findByUserId(userId);
        if (volunteer == null) {
            throw new AccessDeniedException("Volunteer profile not found");
        }
        return volunteer;
    }

    public Volunteer checkHoofdSteward(Authentication authentication, UUID clubId) {
        UUID userId = UUID.fromString(authentication.getName());
        Volunteer volunteer = volunteerRepository.findByUserId(userId);
        if (volunteer == null) {
            throw new AccessDeniedException("Volunteer profile not found");
        }
        if (volunteer.getRole() != VolunteerRole.HOOFD_STEWARD) {
            throw new AccessDeniedException("Hoofd steward access required");
        }
        if (clubId != null) {
            if (volunteer.getClub() == null || !volunteer.getClub().getId().equals(clubId)) {
                throw new AccessDeniedException("Not a member of this club");
            }
            if (volunteer.getClub().getResponsible() == null ||
                    !volunteer.getClub().getResponsible().getId().equals(volunteer.getId())) {
                throw new AccessDeniedException("Not the responsible hoofd steward for this club");
            }
        }
        return volunteer;
    }

    public Volunteer checkGameHoofdSteward(Authentication authentication, UUID gameId) {
        Game game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new CustomException("Game not found");
        }
        return checkHoofdSteward(authentication, game.getHomeTeam().getId());
    }

    public Volunteer checkHoofdStewardForVolunteer(Authentication authentication, UUID targetVolunteerId) {
        Volunteer hoofdSteward = getCurrentVolunteer(authentication);
        if (hoofdSteward.getRole() != VolunteerRole.HOOFD_STEWARD) {
            throw new AccessDeniedException("Hoofd steward access required");
        }

        Volunteer targetVolunteer = volunteerRepository.findByVolunteerId(targetVolunteerId);
        if (targetVolunteer == null) {
            throw new AccessDeniedException("Target volunteer not found");
        }
        if (targetVolunteer.getClub() == null || hoofdSteward.getClub() == null
                || !targetVolunteer.getClub().getId().equals(hoofdSteward.getClub().getId())) {
            throw new AccessDeniedException("Not authorized for this volunteer's club");
        }

        return hoofdSteward;
    }
}

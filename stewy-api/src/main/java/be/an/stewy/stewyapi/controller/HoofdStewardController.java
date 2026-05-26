package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.GameParticipationService;
import be.an.stewy.stewyapi.service.VolunteerGameDto;
import be.an.stewy.stewyapi.service.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hoofdsteward")
public class HoofdStewardController {

    private final AuthorizationService authorizationService;
    private final VolunteerService volunteerService;
    private final GameParticipationService gameParticipationService;

    public HoofdStewardController(AuthorizationService authorizationService,
                                   VolunteerService volunteerService,
                                   GameParticipationService gameParticipationService) {
        this.authorizationService = authorizationService;
        this.volunteerService = volunteerService;
        this.gameParticipationService = gameParticipationService;
    }

    @GetMapping("/club/pending-profiles")
    public ResponseEntity<List<VolunteerProfileResponseDto>> getPendingProfiles(Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();
        Volunteer hoofdSteward = authorizationService.checkHoofdSteward(auth, null);
        return ResponseEntity.ok(volunteerService.getPendingProfilesByClub(hoofdSteward.getClub().getId()));
    }

    @GetMapping("/games/pending-requests")
    public ResponseEntity<List<VolunteerGameDto>> getPendingRequests(Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();
        Volunteer hoofdSteward = authorizationService.checkHoofdSteward(auth, null);
        return ResponseEntity.ok(gameParticipationService.getPendingRequestsForClubGames(hoofdSteward.getClub().getId()));
    }

    @GetMapping("/games/pending-invitations")
    public ResponseEntity<List<VolunteerGameDto>> getPendingInvitations(Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();
        Volunteer hoofdSteward = authorizationService.checkHoofdSteward(auth, null);
        return ResponseEntity.ok(gameParticipationService.getPendingInvitationsForClubGames(hoofdSteward.getClub().getId()));
    }
}

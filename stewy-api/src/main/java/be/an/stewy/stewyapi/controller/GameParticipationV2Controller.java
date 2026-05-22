package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.GameParticipationService;
import be.an.stewy.stewyapi.service.VolunteerGameDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class GameParticipationV2Controller {

    private final GameParticipationService gameParticipationService;
    private final AuthorizationService authorizationService;

    public GameParticipationV2Controller(GameParticipationService gameParticipationService,
                                          AuthorizationService authorizationService) {
        this.gameParticipationService = gameParticipationService;
        this.authorizationService = authorizationService;
    }

    // --- Issue #5: Approve/Reject requests as HoofdSteward ---

    @PostMapping("/games/{gameId}/requests/{volunteerId}/approve")
    public ResponseEntity<Map<String, String>> approveRequest(
            @PathVariable UUID gameId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        gameParticipationService.approveByHoofdSteward(gameId, volunteerId);
        return ResponseEntity.ok(Map.of("status", "APPROVED"));
    }

    @PostMapping("/games/{gameId}/requests/{volunteerId}/reject")
    public ResponseEntity<Map<String, String>> rejectRequest(
            @PathVariable UUID gameId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        gameParticipationService.rejectByHoofdSteward(gameId, volunteerId);
        return ResponseEntity.ok(Map.of("status", "REJECTED"));
    }

    @GetMapping("/games/{gameId}/requests/pending")
    public ResponseEntity<List<VolunteerGameDto>> getPendingRequests(
            @PathVariable UUID gameId,
            Authentication authentication) {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        return ResponseEntity.ok(gameParticipationService.getPendingRequestsForGame(gameId));
    }

    // --- Issue #6: Invite flow ---

    @PostMapping("/games/{gameId}/invite/{volunteerId}")
    public ResponseEntity<Map<String, String>> inviteVolunteer(
            @PathVariable UUID gameId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        gameParticipationService.inviteVolunteer(gameId, volunteerId);
        return ResponseEntity.ok(Map.of("status", "INVITED"));
    }

    @PostMapping("/volunteers/invites/{gameId}/accept")
    public ResponseEntity<Map<String, String>> acceptInvitation(
            @PathVariable UUID gameId,
            Authentication authentication) {
        UUID volunteerId = authorizationService.getCurrentVolunteer(authentication).getId();
        gameParticipationService.acceptInvitation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "APPROVED"));
    }

    @PostMapping("/volunteers/invites/{gameId}/reject")
    public ResponseEntity<Map<String, String>> declineInvitation(
            @PathVariable UUID gameId,
            Authentication authentication) {
        UUID volunteerId = authorizationService.getCurrentVolunteer(authentication).getId();
        gameParticipationService.declineInvitation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "REJECTED"));
    }

    @GetMapping("/volunteers/invitations")
    public ResponseEntity<List<VolunteerGameDto>> getMyInvitations(Authentication authentication) {
        UUID volunteerId = authorizationService.getCurrentVolunteer(authentication).getId();
        return ResponseEntity.ok(gameParticipationService.getInvitationsForVolunteer(volunteerId));
    }

    // --- Issue #7: Cancel & Withdraw ---

    @PostMapping("/games/{gameId}/participants/{volunteerId}/cancel")
    public ResponseEntity<Map<String, String>> cancelParticipation(
            @PathVariable UUID gameId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        gameParticipationService.cancelParticipation(gameId, volunteerId);
        return ResponseEntity.ok(Map.of("status", "CANCELLED"));
    }

    @PostMapping("/volunteers/games/{gameId}/withdraw")
    public ResponseEntity<Map<String, String>> withdrawParticipation(
            @PathVariable UUID gameId,
            Authentication authentication) {
        UUID volunteerId = authorizationService.getCurrentVolunteer(authentication).getId();
        gameParticipationService.withdrawParticipation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "WITHDRAWN"));
    }
}

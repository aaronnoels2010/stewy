package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.service.GameParticipationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/volunteers/{volunteerId}/games/{gameId}")
public class GameParticipationController {

    private final GameParticipationService gameParticipationService;

    public GameParticipationController(GameParticipationService gameParticipationService) {
        this.gameParticipationService = gameParticipationService;
    }

    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestParticipation(
            @PathVariable UUID volunteerId,
            @PathVariable UUID gameId) {
        gameParticipationService.requestParticipation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "REQUESTED"));
    }

    @PostMapping("/approve")
    public ResponseEntity<Map<String, String>> approveParticipation(
            @PathVariable UUID volunteerId,
            @PathVariable UUID gameId,
            Authentication authentication) {
        checkAdmin(authentication);
        gameParticipationService.approveParticipation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "APPROVED"));
    }

    @PostMapping("/reject")
    public ResponseEntity<Map<String, String>> rejectParticipation(
            @PathVariable UUID volunteerId,
            @PathVariable UUID gameId,
            Authentication authentication) {
        checkAdmin(authentication);
        gameParticipationService.rejectParticipation(volunteerId, gameId);
        return ResponseEntity.ok(Map.of("status", "REJECTED"));
    }

    private void checkAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new AccessDeniedException("Admin access required");
        }
    }
}

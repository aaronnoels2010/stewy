package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.VolunteerProfileDto;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/volunteers")
public class VolunteerProfileController {
    private final VolunteerService volunteerService;
    private final AuthorizationService authorizationService;

    public VolunteerProfileController(VolunteerService volunteerService, AuthorizationService authorizationService) {
        this.volunteerService = volunteerService;
        this.authorizationService = authorizationService;
    }

    @PostMapping("/profile")
    public ResponseEntity<VolunteerProfileResponseDto> createProfile(
            @Valid @RequestBody VolunteerProfileDto dto,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        VolunteerProfileResponseDto profile = volunteerService.createProfile(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<VolunteerProfileResponseDto> getMyProfile(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        VolunteerProfileResponseDto profile = volunteerService.getMyProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profiles")
    public ResponseEntity<Map<String, List<VolunteerProfileResponseDto>>> getProfiles(
            Authentication authentication) {
        checkAdmin(SecurityContextHolder.getContext().getAuthentication());
        List<VolunteerProfileResponseDto> pending = volunteerService.getVolunteersByProfileStatus(ProfileStatus.PENDING_APPROVAL);
        List<VolunteerProfileResponseDto> approved = volunteerService.getVolunteersByProfileStatus(ProfileStatus.APPROVED);
        return ResponseEntity.ok(Map.of("pending", pending, "approved", approved));
    }

    @PostMapping("/{volunteerId}/profile/approve")
    public ResponseEntity<VolunteerProfileResponseDto> approveProfile(
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();
        checkAdminOrHoofdStewardForVolunteer(auth, volunteerId);
        return ResponseEntity.ok(volunteerService.approveProfile(volunteerId));
    }

    @PostMapping("/{volunteerId}/profile/reject")
    public ResponseEntity<VolunteerProfileResponseDto> rejectProfile(
            @PathVariable UUID volunteerId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();
        checkAdminOrHoofdStewardForVolunteer(auth, volunteerId);
        String reason = body != null ? body.getOrDefault("reason", "") : "";
        return ResponseEntity.ok(volunteerService.rejectProfile(volunteerId, reason));
    }

    private void checkAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new AccessDeniedException("Admin access required");
        }
    }

    private void checkAdminOrHoofdStewardForVolunteer(Authentication authentication, UUID volunteerId) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        if (isAdmin) return;

        authorizationService.checkHoofdStewardForVolunteer(authentication, volunteerId);
    }
}

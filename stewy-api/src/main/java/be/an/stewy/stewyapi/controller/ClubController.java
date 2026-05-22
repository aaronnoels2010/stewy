package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.ClubDto;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.ClubMembershipService;
import be.an.stewy.stewyapi.service.ClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class ClubController {
    private final ClubService clubService;
    private final AuthorizationService authorizationService;
    private final ClubMembershipService clubMembershipService;

    public ClubController(ClubService clubService,
                          AuthorizationService authorizationService,
                          ClubMembershipService clubMembershipService) {
        this.clubService = clubService;
        this.authorizationService = authorizationService;
        this.clubMembershipService = clubMembershipService;
    }

    @PostMapping(value = "/clubs/add")
    public Map<String,Object> saveNewClub(@RequestBody ClubRegistrationDto clubRegistrationDto){
        return clubService.saveOrUpdateClub(clubRegistrationDto);
    }

    @PostMapping(value = "/clubs",consumes = "application/json",produces = "application/json")
    public Map<String,Object> findAllClubs(@RequestBody Pagination pagination,
                                           @RequestParam(defaultValue = "false") boolean onlyWithHoofdSteward){
        return clubService.clubsOverview(pagination, onlyWithHoofdSteward);
    }

    @GetMapping(value = "/clubs/{id}",produces = "application/json")
    public ClubDto findClubById(@PathVariable("id") UUID id){
        return clubService.findClubById(id);
    }

    @PostMapping(value = "/clubs/assignVolunteer",produces = "application/json")
    public ClubDto assignVolunteerToClub(@RequestParam(name = "clubId") UUID clubId,@RequestParam(name = "volunteerId") UUID volunteerId){
        return  clubService.assignVolunteerToClub(volunteerId,clubId);
    }

    // --- Issue #8: Club Membership Management ---

    @PostMapping("/clubs/{clubId}/members/{volunteerId}/approve")
    public ResponseEntity<VolunteerProfileResponseDto> approveMember(
            @PathVariable UUID clubId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkHoofdSteward(authentication, clubId);
        return ResponseEntity.ok(clubMembershipService.approveByHoofdSteward(clubId, volunteerId));
    }

    @PostMapping("/clubs/{clubId}/members/{volunteerId}/reject")
    public ResponseEntity<VolunteerProfileResponseDto> rejectMember(
            @PathVariable UUID clubId,
            @PathVariable UUID volunteerId,
            Authentication authentication) {
        authorizationService.checkHoofdSteward(authentication, clubId);
        return ResponseEntity.ok(clubMembershipService.rejectByHoofdSteward(clubId, volunteerId));
    }

    @GetMapping("/clubs/{clubId}/members/pending")
    public ResponseEntity<List<VolunteerProfileResponseDto>> getPendingMembers(
            @PathVariable UUID clubId,
            Authentication authentication) {
        authorizationService.checkHoofdSteward(authentication, clubId);
        return ResponseEntity.ok(clubMembershipService.getPendingMembers(clubId));
    }

    // --- Issue #9: Club Management Dashboard ---

    @GetMapping("/clubs/{clubId}/members")
    public ResponseEntity<List<VolunteerProfileResponseDto>> getClubMembers(
            @PathVariable UUID clubId,
            Authentication authentication) {
        authorizationService.checkHoofdSteward(authentication, clubId);
        return ResponseEntity.ok(clubMembershipService.getApprovedClubMembers(clubId));
    }

    @PutMapping("/clubs/{clubId}")
    public ResponseEntity<Map<String, Object>> updateClub(
            @PathVariable UUID clubId,
            @RequestBody ClubRegistrationDto dto,
            Authentication authentication) {
        authorizationService.checkHoofdSteward(authentication, clubId);
        return ResponseEntity.ok(clubService.saveOrUpdateClub(dto));
    }
}

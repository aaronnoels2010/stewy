package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.advice.PersonExceptionHandler;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.GameParticipationService;
import be.an.stewy.stewyapi.service.VolunteerGameDto;
import be.an.stewy.stewyapi.service.VolunteerService;
import be.an.stewy.stewyapi.ParticipationStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class HoofdStewardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthorizationService authorizationService;
    @Mock
    private VolunteerService volunteerService;
    @Mock
    private GameParticipationService gameParticipationService;

    private ObjectMapper objectMapper;
    private UUID clubId;
    private Volunteer hoofdSteward;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        clubId = UUID.randomUUID();

        Club club = new Club();
        club.setId(clubId);

        hoofdSteward = new Volunteer();
        hoofdSteward.setId(UUID.randomUUID());
        hoofdSteward.setRole(VolunteerRole.HOOFD_STEWARD);
        hoofdSteward.setClub(club);

        HoofdStewardController controller = new HoofdStewardController(
                authorizationService, volunteerService, gameParticipationService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setValidator(new LocalValidatorFactoryBean())
                .setControllerAdvice(new PersonExceptionHandler())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAs(UserRole role) {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("user", "pass",
                        List.of(new SimpleGrantedAuthority(role.name())))));
    }

    private enum UserRole { ROLE_ADMIN, ROLE_VOLUNTEER }

    @Test
    void getPendingProfiles_whenHoofdSteward_returnsProfiles() throws Exception {
        authenticateAs(UserRole.ROLE_VOLUNTEER);
        when(authorizationService.checkHoofdSteward(any(Authentication.class), eq((UUID) null)))
                .thenReturn(hoofdSteward);

        VolunteerProfileResponseDto profile = new VolunteerProfileResponseDto();
        profile.setId(UUID.randomUUID());
        when(volunteerService.getPendingProfilesByClub(clubId)).thenReturn(List.of(profile));

        mockMvc.perform(get("/hoofdsteward/club/pending-profiles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        verify(authorizationService).checkHoofdSteward(any(Authentication.class), eq((UUID) null));
    }

    @Test
    void getPendingProfiles_withoutHoofdSteard_returnsForbidden() throws Exception {
        authenticateAs(UserRole.ROLE_VOLUNTEER);
        when(authorizationService.checkHoofdSteward(any(Authentication.class), eq((UUID) null)))
                .thenThrow(new org.springframework.security.access.AccessDeniedException("Access denied"));

        mockMvc.perform(get("/hoofdsteward/club/pending-profiles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getPendingRequests_whenHoofdSteward_returnsRequests() throws Exception {
        authenticateAs(UserRole.ROLE_VOLUNTEER);
        when(authorizationService.checkHoofdSteward(any(Authentication.class), eq((UUID) null)))
                .thenReturn(hoofdSteward);

        VolunteerGameDto dto = new VolunteerGameDto(UUID.randomUUID(), "Test Volunteer", ParticipationStatus.REQUESTED);
        when(gameParticipationService.getPendingRequestsForClubGames(clubId)).thenReturn(List.of(dto));

        mockMvc.perform(get("/hoofdsteward/games/pending-requests")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getPendingInvitations_whenHoofdSteward_returnsInvitations() throws Exception {
        authenticateAs(UserRole.ROLE_VOLUNTEER);
        when(authorizationService.checkHoofdSteward(any(Authentication.class), eq((UUID) null)))
                .thenReturn(hoofdSteward);

        VolunteerGameDto dto = new VolunteerGameDto(UUID.randomUUID(), "Test Volunteer", ParticipationStatus.INVITED);
        when(gameParticipationService.getPendingInvitationsForClubGames(clubId)).thenReturn(List.of(dto));

        mockMvc.perform(get("/hoofdsteward/games/pending-invitations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getPendingRequests_withoutHoofdSteward_returnsForbidden() throws Exception {
        authenticateAs(UserRole.ROLE_VOLUNTEER);
        when(authorizationService.checkHoofdSteward(any(Authentication.class), eq((UUID) null)))
                .thenThrow(new org.springframework.security.access.AccessDeniedException("Access denied"));

        mockMvc.perform(get("/hoofdsteward/games/pending-requests")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}

package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.GameStatus;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.advice.PersonExceptionHandler;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.GameDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.GameService;
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
class UpcomingGamesControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GameService gameService;
    @Mock
    private AuthorizationService authorizationService;

    private ObjectMapper objectMapper;
    private UUID clubId;
    private Volunteer volunteer;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        clubId = UUID.randomUUID();

        Club club = new Club();
        club.setId(clubId);

        volunteer = new Volunteer();
        volunteer.setId(UUID.randomUUID());
        volunteer.setRole(VolunteerRole.STEWARD);
        volunteer.setClub(club);

        GameController controller = new GameController(gameService, authorizationService);
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

    @Test
    void getUpcomingGames_whenGamesExist_returnsGames() throws Exception {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("user", "pass",
                        List.of(new SimpleGrantedAuthority("ROLE_VOLUNTEER")))));

        when(authorizationService.getCurrentVolunteer(any(Authentication.class))).thenReturn(volunteer);

        GameDto gameDto = new GameDto();
        gameDto.setId(UUID.randomUUID());
        gameDto.setStatus(GameStatus.OPEN);
        when(gameService.getUpcomingGamesForVolunteer(volunteer.getId())).thenReturn(List.of(gameDto));

        mockMvc.perform(get("/volunteers/my-games/upcoming")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        verify(gameService).getUpcomingGamesForVolunteer(volunteer.getId());
    }

    @Test
    void getUpcomingGames_whenVolunteerHasNoClub_returnsEmptyList() throws Exception {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("user", "pass",
                        List.of(new SimpleGrantedAuthority("ROLE_VOLUNTEER")))));

        Volunteer noClubVolunteer = new Volunteer();
        noClubVolunteer.setId(UUID.randomUUID());
        noClubVolunteer.setClub(null);

        when(authorizationService.getCurrentVolunteer(any(Authentication.class))).thenReturn(noClubVolunteer);

        mockMvc.perform(get("/volunteers/my-games/upcoming")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(gameService, never()).getUpcomingGamesForVolunteer(any());
    }

    @Test
    void getUpcomingGames_whenNoGames_returnsEmptyList() throws Exception {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("user", "pass",
                        List.of(new SimpleGrantedAuthority("ROLE_VOLUNTEER")))));

        when(authorizationService.getCurrentVolunteer(any(Authentication.class))).thenReturn(volunteer);
        when(gameService.getUpcomingGamesForVolunteer(volunteer.getId())).thenReturn(List.of());

        mockMvc.perform(get("/volunteers/my-games/upcoming")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}

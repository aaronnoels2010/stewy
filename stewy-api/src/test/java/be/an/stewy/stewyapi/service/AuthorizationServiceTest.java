package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private GameRepository gameRepository;
    @Mock
    private Authentication authentication;

    private AuthorizationService authorizationService;

    private UUID userId;
    private UUID clubId;
    private UUID gameId;
    private Volunteer hoofdSteward;
    private Club club;
    private Game game;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        clubId = UUID.randomUUID();
        gameId = UUID.randomUUID();

        club = new Club();
        club.setId(clubId);
        club.setClubName("Test Club");

        hoofdSteward = new Volunteer();
        hoofdSteward.setId(UUID.randomUUID());
        hoofdSteward.setRole(VolunteerRole.HOOFD_STEWARD);
        hoofdSteward.setClub(club);

        club.setResponsible(hoofdSteward);

        game = new Game();
        game.setId(gameId);
        game.setHomeTeam(club);

        authorizationService = new AuthorizationService(volunteerRepository, gameRepository);

        lenient().when(authentication.getName()).thenReturn(userId.toString());
    }

    @Test
    void checkHoofdSteward_withValidHoofdSteward_returnsVolunteer() {
        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);

        Volunteer result = authorizationService.checkHoofdSteward(authentication, clubId);

        assertNotNull(result);
        assertEquals(hoofdSteward.getId(), result.getId());
    }

    @Test
    void checkHoofdSteward_withNoProfile_throwsAccessDenied() {
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdSteward(authentication, clubId));
    }

    @Test
    void checkHoofdSteward_withNonHoofdStewardRole_throwsAccessDenied() {
        Volunteer steward = new Volunteer();
        steward.setId(UUID.randomUUID());
        steward.setRole(VolunteerRole.STEWARD);
        steward.setClub(club);
        when(volunteerRepository.findByUserId(userId)).thenReturn(steward);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdSteward(authentication, clubId));
    }

    @Test
    void checkHoofdSteward_withWrongClub_throwsAccessDenied() {
        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        UUID wrongClubId = UUID.randomUUID();

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdSteward(authentication, wrongClubId));
    }

    @Test
    void checkHoofdSteward_whenNotResponsible_throwsAccessDenied() {
        Volunteer nonResponsible = new Volunteer();
        nonResponsible.setId(UUID.randomUUID());
        nonResponsible.setRole(VolunteerRole.HOOFD_STEWARD);
        nonResponsible.setClub(club);
        when(volunteerRepository.findByUserId(userId)).thenReturn(nonResponsible);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdSteward(authentication, clubId));
    }

    @Test
    void checkGameHoofdSteward_withValidGame_delegatesToCheckHoofdSteward() {
        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(gameRepository.getGameById(gameId)).thenReturn(game);

        Volunteer result = authorizationService.checkGameHoofdSteward(authentication, gameId);

        assertNotNull(result);
        assertEquals(hoofdSteward.getId(), result.getId());
        verify(gameRepository).getGameById(gameId);
    }

    @Test
    void checkGameHoofdSteward_withNonExistentGame_throwsCustomException() {
        when(gameRepository.getGameById(gameId)).thenReturn(null);

        assertThrows(CustomException.class,
                () -> authorizationService.checkGameHoofdSteward(authentication, gameId));
    }

    @Test
    void checkGameHoofdSteward_withWrongClub_throwsAccessDenied() {
        Club otherClub = new Club();
        otherClub.setId(UUID.randomUUID());
        otherClub.setClubName("Other Club");
        Game otherGame = new Game();
        otherGame.setId(gameId);
        otherGame.setHomeTeam(otherClub);

        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(gameRepository.getGameById(gameId)).thenReturn(otherGame);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkGameHoofdSteward(authentication, gameId));
    }

    @Test
    void checkHoofdStewardForVolunteer_withMatchingClub_returnsHoofdSteward() {
        UUID targetVolunteerId = UUID.randomUUID();
        Volunteer targetVolunteer = new Volunteer();
        targetVolunteer.setId(targetVolunteerId);
        targetVolunteer.setClub(club);

        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(volunteerRepository.findByVolunteerId(targetVolunteerId)).thenReturn(targetVolunteer);

        Volunteer result = authorizationService.checkHoofdStewardForVolunteer(authentication, targetVolunteerId);

        assertNotNull(result);
        assertEquals(hoofdSteward.getId(), result.getId());
    }

    @Test
    void checkHoofdStewardForVolunteer_withWrongClub_throwsAccessDenied() {
        UUID targetVolunteerId = UUID.randomUUID();
        Club otherClub = new Club();
        otherClub.setId(UUID.randomUUID());
        Volunteer targetVolunteer = new Volunteer();
        targetVolunteer.setId(targetVolunteerId);
        targetVolunteer.setClub(otherClub);

        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(volunteerRepository.findByVolunteerId(targetVolunteerId)).thenReturn(targetVolunteer);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdStewardForVolunteer(authentication, targetVolunteerId));
    }

    @Test
    void checkHoofdStewardForVolunteer_withNoClubOnTarget_throwsAccessDenied() {
        UUID targetVolunteerId = UUID.randomUUID();
        Volunteer targetVolunteer = new Volunteer();
        targetVolunteer.setId(targetVolunteerId);
        targetVolunteer.setClub(null);

        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(volunteerRepository.findByVolunteerId(targetVolunteerId)).thenReturn(targetVolunteer);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdStewardForVolunteer(authentication, targetVolunteerId));
    }

    @Test
    void checkHoofdStewardForVolunteer_withNonExistentTarget_throwsAccessDenied() {
        UUID targetVolunteerId = UUID.randomUUID();

        when(volunteerRepository.findByUserId(userId)).thenReturn(hoofdSteward);
        when(volunteerRepository.findByVolunteerId(targetVolunteerId)).thenReturn(null);

        assertThrows(AccessDeniedException.class,
                () -> authorizationService.checkHoofdStewardForVolunteer(authentication, targetVolunteerId));
    }
}

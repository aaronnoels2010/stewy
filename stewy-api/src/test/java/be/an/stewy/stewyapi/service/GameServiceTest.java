package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.GameStatus;
import be.an.stewy.stewyapi.controller.GameRegistrationDto;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.GameDto;
import be.an.stewy.stewyapi.mapper.GameMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.service.Impl.GameServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;
    @Mock
    private GameMapper gameMapper;
    @Mock
    private ClubRepository clubRepository;

    private GameServiceImpl gameService;

    private UUID gameId;
    private Club homeClub;
    private Club awayClub;
    private Volunteer responsible;

    @BeforeEach
    void setUp() {
        gameId = UUID.randomUUID();
        homeClub = new Club();
        homeClub.setId(UUID.randomUUID());
        homeClub.setClubName("Home Club");
        awayClub = new Club();
        awayClub.setId(UUID.randomUUID());
        awayClub.setClubName("Away Club");
        responsible = new Volunteer();
        responsible.setId(UUID.randomUUID());
        homeClub.setResponsible(responsible);

        gameService = new GameServiceImpl(gameRepository, gameMapper, clubRepository);
    }

    @Test
    void updateGame_withCreateStatus_allowsAllEdits() {
        Game existing = createGame(GameStatus.CREATE);
        GameRegistrationDto dto = createDto(existing.getId(), awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", "CREATE", "New Loc", "New Acc");

        when(gameRepository.getGameById(gameId)).thenReturn(existing);
        when(clubRepository.findByClubId(homeClub.getId())).thenReturn(homeClub);
        when(clubRepository.findByClubId(awayClub.getId())).thenReturn(awayClub);
        Game saved = createGame(GameStatus.CREATE);
        when(gameMapper.mapGameRegistrationDtoToGame(any(), any(), any())).thenReturn(saved);
        GameDto dtoOut = new GameDto();
        when(gameMapper.mapGameToGameDto(saved)).thenReturn(dtoOut);

        assertDoesNotThrow(() -> gameService.updateGame(dto));
    }

    @Test
    void updateGame_withOpenStatus_rejectsRestrictedFields() {
        Game existing = createGame(GameStatus.OPEN);
        GameRegistrationDto dto = createDto(existing.getId(), awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", "OPEN", "New Location", "New Accessibility");

        dto.setHomeTeam(UUID.randomUUID());

        when(gameRepository.getGameById(gameId)).thenReturn(existing);

        CustomException ex = assertThrows(CustomException.class, () -> gameService.updateGame(dto));
        assertTrue(ex.getMessage().contains("homeTeam"));
    }

    @Test
    void updateGame_withOpenStatus_allowsLocationAndAccessibilityChanges() {
        Game existing = createGame(GameStatus.OPEN);
        GameRegistrationDto dto = createDto(existing.getId(), awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", "OPEN", "New Location", "New Accessibility");

        when(gameRepository.getGameById(gameId)).thenReturn(existing);
        when(clubRepository.findByClubId(homeClub.getId())).thenReturn(homeClub);
        when(clubRepository.findByClubId(awayClub.getId())).thenReturn(awayClub);
        Game saved = createGame(GameStatus.OPEN);
        when(gameMapper.mapGameRegistrationDtoToGame(any(), any(), any())).thenReturn(saved);
        GameDto dtoOut = new GameDto();
        when(gameMapper.mapGameToGameDto(saved)).thenReturn(dtoOut);

        assertDoesNotThrow(() -> gameService.updateGame(dto));
    }

    @Test
    void updateGame_withClosedStatus_throwsException() {
        Game existing = createGame(GameStatus.CLOSED);
        GameRegistrationDto dto = createDto(existing.getId(), awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", "CLOSED", "New Location", "New Accessibility");

        when(gameRepository.getGameById(gameId)).thenReturn(existing);

        CustomException ex = assertThrows(CustomException.class, () -> gameService.updateGame(dto));
        assertTrue(ex.getMessage().contains("CLOSED"));
    }

    @Test
    void save_withClosedStatus_throwsException() {
        Game existing = createGame(GameStatus.CLOSED);
        GameRegistrationDto dto = createDto(existing.getId(), awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", "CLOSED", "New Location", "New Accessibility");

        when(gameRepository.getGameById(gameId)).thenReturn(existing);

        assertThrows(CustomException.class, () -> gameService.save(dto));
    }

    @Test
    void save_newGame_createsWithoutRestriction() {
        GameRegistrationDto dto = createDto(null, awayClub.getId(), "2025-01-01 10:00", "2025-01-01 09:00", null, "Location", "Accessibility");

        when(clubRepository.findByClubId(homeClub.getId())).thenReturn(homeClub);
        when(clubRepository.findByClubId(awayClub.getId())).thenReturn(awayClub);
        when(gameMapper.mapGameRegistrationDtoToGame(any(), any(), any())).thenReturn(new Game());

        assertDoesNotThrow(() -> gameService.save(dto));
    }

    private Game createGame(GameStatus status) {
        Game game = new Game();
        game.setId(gameId);
        game.setHomeTeam(homeClub);
        game.setAwayTeam(awayClub);
        game.setStatus(status);
        game.setAppointment(ZonedDateTime.now().plusDays(10));
        game.setDeadline(ZonedDateTime.now().plusDays(5));
        game.setLocation("Stadium");
        game.setAccessibility("Wheelchair accessible");
        return game;
    }

    private GameRegistrationDto createDto(UUID id, UUID awayTeam, String appointment, String deadline, String status, String location, String accessibility) {
        GameRegistrationDto dto = new GameRegistrationDto();
        dto.setId(id);
        dto.setHomeTeam(homeClub.getId());
        dto.setAwayTeam(awayTeam);
        dto.setAppointment(appointment);
        dto.setDeadline(deadline);
        dto.setStatus(status);
        dto.setLocation(location);
        dto.setAccessibility(accessibility);
        return dto;
    }
}

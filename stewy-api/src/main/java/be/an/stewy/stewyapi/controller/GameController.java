package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.GameDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.GameService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class GameController {
    private final GameService gameService;
    private final AuthorizationService authorizationService;

    public GameController(GameService gameService, AuthorizationService authorizationService) {
        this.gameService = gameService;
        this.authorizationService = authorizationService;
    }

    @PostMapping(value = "/games/add")
    public Map<String, Object> saveOrUpdateClub(@RequestBody GameRegistrationDto gameRegistrationDto, Authentication authentication) throws Exception {
        Volunteer hoofdSteward = authorizationService.getCurrentVolunteer(authentication);
        if (hoofdSteward.getClub() == null) {
            throw new org.springframework.security.access.AccessDeniedException("Volunteer has no club assigned");
        }
        gameRegistrationDto.setHomeTeam(hoofdSteward.getClub().getId());
        return gameService.save(gameRegistrationDto);
    }

    @PostMapping(value = "/games", consumes = "application/json", produces = "application/json")
    public Map<String, Object> findAllGames(@RequestBody Pagination pagination) {
        return gameService.gamesOverview(pagination);
    }

    @PostMapping(value = "/games/open/{gameId}", consumes = "application/json", produces = "application/json")
    public List<GameDto> updateGameStatusReturnOpenGames(@PathVariable UUID gameId, @RequestBody StatusRequest status, Authentication authentication) throws Exception {
        authorizationService.checkGameHoofdSteward(authentication, gameId);
        return gameService.updateGameStatus(gameId,status.getStatus(),true);
    }

    @PostMapping(value = "/games/{gameId}", consumes = "application/json", produces = "application/json")
    public List<GameDto> updateGameStatus(@PathVariable UUID gameId, @RequestBody StatusRequest status) throws Exception {
        return gameService.updateGameStatus(gameId,status.getStatus(),false);
    }

    @PostMapping(value = "/games/saveOrUpdate", consumes = "application/json", produces = "application/json")
    public GameDto updateGame(@RequestBody GameRegistrationDto gameRegistrationDto) throws Exception {
        return gameService.updateGame(gameRegistrationDto);
    }

    @PostMapping(value = "/games/open", consumes = "application/json", produces = "application/json")
    public List<GameDto> findAllOpenGames(@RequestBody Pagination pagination) {
        return gameService.findAllOpenGames(pagination);
    }

    @GetMapping(value = "/games", produces = "application/json")
    public Map<String, Object> findAllGamesGet() {
        return gameService.gamesOverview(null);
    }

    @GetMapping(value = "/games/{gameId}", produces = "application/json")
    public GameDto findGameById(@PathVariable UUID gameId) {
        return  gameService.findById(gameId);
    }

    @GetMapping(value = "/games/my-club-games", produces = "application/json")
    public Map<String, Object> findMyClubGames(Authentication authentication) {
        Volunteer volunteer = authorizationService.getCurrentVolunteer(authentication);
        return gameService.findMyClubGames(volunteer.getClub().getId());
    }

    @PostMapping(value = "/games/create", produces = "application/json")
    public GameDto createGame(Authentication authentication, @RequestBody GameRegistrationDto dto) {
        Volunteer volunteer = authorizationService.checkHoofdSteward(authentication, dto.getHomeTeam());
        return gameService.createGameAsHoofdSteward(dto, volunteer.getClub().getId());
    }

}

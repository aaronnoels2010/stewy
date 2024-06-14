package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.mapper.GameDto;
import be.an.stewy.stewyapi.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping(value = "/games/add")
    public Map<String, Object> saveOrUpdateClub(@RequestBody GameRegistrationDto gameRegistrationDto) throws Exception {
        return gameService.save(gameRegistrationDto);
    }

    @PostMapping(value = "/games", consumes = "application/json", produces = "application/json")
    public Map<String, Object> findAllGames(@RequestBody Pagination pagination) {
        return gameService.gamesOverview(pagination);
    }

    @PostMapping(value = "/games/open/{gameId}", consumes = "application/json", produces = "application/json")
    public List<GameDto> updateGameStatusReturnOpenGames(@PathVariable UUID gameId, @RequestBody StatusRequest status) throws Exception {
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

    @GetMapping(value = "/games/{gameId}", produces = "application/json")
    public GameDto findGameById(@PathVariable UUID gameId) {
        return  gameService.findById(gameId);
    }

}

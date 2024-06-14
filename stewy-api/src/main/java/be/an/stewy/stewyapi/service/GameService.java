package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.controller.GameRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.mapper.GameDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface GameService {
    Map<String,Object> save(GameRegistrationDto gameRegistrationDto) throws Exception;
    Map<String, Object> gamesOverview(Pagination pagination);
    GameDto findById(UUID id);

    List<GameDto> updateGameStatus(UUID gameId,String status,boolean openGames);
    List<GameDto> findAllOpenGames(Pagination pagination);
    List<GameDto> findGamesByClub(UUID gameId);

    GameDto updateGame(GameRegistrationDto gameRegistrationDto);
}

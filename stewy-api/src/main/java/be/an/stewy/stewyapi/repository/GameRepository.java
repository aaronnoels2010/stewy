package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.mapper.GameDto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public interface GameRepository {
    void saveGame(Game game);
    Game getGameById(UUID id);
    List<Game> getAllGames(Pagination pagination);
    List<Game> getAllGames(boolean allGames);
    long totalCountGames();
    List<Game> getGamesByClub(Club club);
    List<Game> findAllGamesByStatus(List<String> statussen);
}

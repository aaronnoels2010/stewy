package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.GameStatus;
import be.an.stewy.stewyapi.controller.GameRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.GameDto;
import be.an.stewy.stewyapi.mapper.GameMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.service.GameService;
import be.an.stewy.stewyapi.utils.ZoneDateTime;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final GameMapper gameMapper;
    private final ClubRepository clubRepository;

    public GameServiceImpl(GameRepository gameRepository, GameMapper gameMapper, ClubRepository clubRepository) {
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
        this.clubRepository = clubRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> save(GameRegistrationDto gameRegistrationDto) throws Exception {
        var homeTeam = clubRepository.findByClubId(gameRegistrationDto.getHomeTeam());
        var awayTeam = clubRepository.findByClubId(gameRegistrationDto.getAwayTeam());
        var game = gameMapper.mapGameRegistrationDtoToGame(gameRegistrationDto,homeTeam,awayTeam);
        var responsible = Optional.ofNullable(clubRepository.findByClubId(homeTeam.getId()).getResponsible()).orElseThrow(() -> new CustomException("There need to be a responsible before creating a game"));
        game.setDeadline(ZoneDateTime.mapStringToZoneDateTime(gameRegistrationDto.getDeadline()));
        game.setAppointment(ZoneDateTime.mapStringToZoneDateTime(gameRegistrationDto.getAppointment()));
        game.setResponsible(responsible);
        if (game.getId() == null) {
            game.setStatus(GameStatus.CREATE);
        } else {
            game.setStatus(GameStatus.valueOf(gameRegistrationDto.getStatus()));
        }
        gameRepository.saveGame(game);
        return gamesOverview(null);
    }

    @Override
    public Map<String, Object> gamesOverview(Pagination pagination) {
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());
        Map<String,Object> volunteersOverview = new HashMap<>();
        volunteersOverview.put("items", gameMapper.mapGameListToGameDtoList(gameRepository.getAllGames(false)));
        volunteersOverview.put("total", gameRepository.totalCountGames());
        return volunteersOverview;
    }

    @Override
    public GameDto findById(UUID id) {
        return gameMapper.mapGameToGameDto(gameRepository.getGameById(id));
    }

    @Scheduled(cron = "0/10 * * ? * *")
    @Transactional// Controleer elk uur
    public void updateGameStatus(){
        var games = gameRepository.findAllGamesByStatus(List.of("OPEN"));
        games.forEach(game -> {
            ZoneId now = ZoneId.systemDefault();
            var deadline = game.getDeadline().withZoneSameInstant(now);
            var currentDate = ZonedDateTime.now();
            if (deadline.isBefore(currentDate)) {
                game.setStatus(GameStatus.CLOSED);
                gameRepository.saveGame(game);
                System.out.println("deze deadline is al gepaseerd");
            }
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<GameDto> updateGameStatus(UUID gameId,String status, boolean openGames) {
        var updatedStatus = GameStatus.valueOf(status);
        var game = gameRepository.getGameById(gameId);
        game.setStatus(updatedStatus);
        gameRepository.saveGame(game);
        return openGames ? gameMapper.mapGameListToGameDtoList(gameRepository.findAllGamesByStatus(List.of("OPEN")))
                : gameMapper.mapGameListToGameDtoList(gameRepository.getAllGames(false));
    }

    @Override
    public List<GameDto> findAllOpenGames(Pagination pagination) {
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());


        return gameMapper.mapGameListToGameDtoList(gameRepository.findAllGamesByStatus(List.of("OPEN")));
    }

    @Override
    public List<GameDto> findGamesByClub(UUID gameId) {
        var club = clubRepository.findByClubId(gameId);
        return gameMapper.mapGameListToGameDtoList(gameRepository.getGamesByClub(club));
    }

    @Override
    @Transactional
    public GameDto updateGame(GameRegistrationDto gameRegistrationDto) {
        var homeTeam = clubRepository.findByClubId(gameRegistrationDto.getHomeTeam());
        var awayTeam = clubRepository.findByClubId(gameRegistrationDto.getAwayTeam());
        var game = gameMapper.mapGameRegistrationDtoToGame(gameRegistrationDto,homeTeam,awayTeam);
        var responsible = Optional.ofNullable(clubRepository.findByClubId(homeTeam.getId()).getResponsible()).orElseThrow(() -> new CustomException("There need to be a responsible before creating a game"));
        game.setDeadline(ZoneDateTime.mapStringToZoneDateTime(gameRegistrationDto.getDeadline()));
        game.setAppointment(ZoneDateTime.mapStringToZoneDateTime(gameRegistrationDto.getAppointment()));
        game.setResponsible(responsible);
        game.setStatus(GameStatus.valueOf(gameRegistrationDto.getStatus()));
        gameRepository.saveGame(game);
        return gameMapper.mapGameToGameDto(game);
    }

    /*@Override
    @Transactional(rollbackFor = Exception.class)
    public void save(Game game) {
        saveGame(game);
    }

    @Override
    public Map<String, Object> clubsOverview(Pagination pagination) {
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());
        Map<String,Object> volunteersOverview = new HashMap<>();
        volunteersOverview.put("items", gameMapper.mapGameListToGameDtoList(gameRepository.getAllGames(pageRequest.getSort(),pageRequest)));
        volunteersOverview.put("total", gameRepository.totalCountGames());
        return volunteersOverview;
    }

    @Override
    public Game findById(UUID id) {
        return null;
    }


    private void saveGame(Game game) {
        gameRepository.saveGame(game);
    }*/
}

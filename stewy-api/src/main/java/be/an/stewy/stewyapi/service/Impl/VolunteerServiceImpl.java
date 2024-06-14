package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.domain.VolunteerGame;
import be.an.stewy.stewyapi.mapper.GameParticipationStatusDTO;
import be.an.stewy.stewyapi.mapper.VolunteerDto;
import be.an.stewy.stewyapi.mapper.VolunteerMapper;
import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.VolunteerGameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.VolunteerService;
import be.an.stewy.stewyapi.validator.VolunteerValidator;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.server.UID;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class VolunteerServiceImpl implements VolunteerService {
    private final VolunteerRepository volunteerRepository;
    private final VolunteerMapper volunteerMapper;
    private final ClubRepository clubRepository;
    private final VolunteerGameRepository volunteerGameRepository;
    private final VolunteerValidator volunteerValidator;
    private final GameRepository gameRepository;

    public VolunteerServiceImpl(VolunteerRepository volunteerRepository, VolunteerMapper volunteerMapper, ClubRepository clubRepository, GameRepository gameRepository, VolunteerGameRepository volunteerGameRepository, VolunteerValidator volunteerValidator, GameRepository gameRepository1) {
        this.volunteerRepository = volunteerRepository;
        this.volunteerMapper = volunteerMapper;
        this.clubRepository = clubRepository;
        this.volunteerGameRepository = volunteerGameRepository;
        this.volunteerValidator = volunteerValidator;
        this.gameRepository = gameRepository1;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> createNewPerson(VolunteerRegistrationDto volunteerRegistrationDto) {
        var club = clubRepository.findByClubId(volunteerRegistrationDto.getClubId());
        var newVolunteer = volunteerMapper.mapVolunteerRegistrationDtoToVolunteer(volunteerRegistrationDto,club);
        volunteerRepository.saveVolunteer(newVolunteer);
        return volunteersOverview(null);
    }

    @Override
    public Map<String, Object> volunteersOverview(Pagination pagination) {
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());
        Map<String,Object> volunteersOverview = new HashMap<>();
        volunteersOverview.put("items", volunteerMapper.mapVolunteerListToVolunteerDto(volunteerRepository.findAllVolunteers(pageRequest.getSort(),pageRequest)));
        volunteersOverview.put("total", volunteerRepository.totalCountVolunteers());
        return volunteersOverview;
    }

    @Override
    public VolunteerDto findVolunteerById(UUID volunteerId) {
        return volunteerMapper.mapVolunteerToVolunteerDto(volunteerRepository.findByVolunteerId(volunteerId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignVolunteerToGame(UUID volunteerId, UUID gameId) {
        var volunteerGame = new VolunteerGame();
        volunteerGame.setVolunteerId(volunteerId);
        volunteerGame.setGameId(gameId);

        volunteerGameRepository.assignVolunteerToGame(volunteerGame);
    }



    @Override
    public List<GameParticipationStatusDTO> findGamesWithParticipationStatus(UUID volunteerId) {
        Pagination pagination = null;
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());
       var participatedGameIds = volunteerGameRepository.findGamesWithParticipationStatus(volunteerId).stream().map(VolunteerGame::getGameId).toList();
       var games = gameRepository.getAllGames(true);

       return games.stream().map(g -> {
           var game =  String.format("%s - %s",g.getHomeTeam().getClubName(),g.getAwayTeam().getClubName());

           return new GameParticipationStatusDTO(g.getId(),game,participatedGameIds.contains(g.getId()));
       }).toList();

    }
}

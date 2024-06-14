package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.controller.ClubController;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.mapper.ClubDto;
import be.an.stewy.stewyapi.mapper.ClubMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.ClubService;
import be.an.stewy.stewyapi.service.GameService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final VolunteerRepository volunteerRepository;
    private final GameService gameService;
    private final ClubMapper clubMapper;

    public ClubServiceImpl(ClubRepository clubRepository, VolunteerRepository volunteerRepository, GameService gameService, ClubMapper clubMapper) {
        this.clubRepository = clubRepository;
        this.volunteerRepository = volunteerRepository;
        this.gameService = gameService;
        this.clubMapper = clubMapper;
    }


    @Override
    @Transactional
    public Map<String, Object> saveOrUpdateClub(ClubRegistrationDto clubRegistrationDto) {
        var responsible = volunteerRepository.findByVolunteerId(clubRegistrationDto.getResponsible());
        var club = clubMapper.mapClubRegistrationDtoToClub(clubRegistrationDto, responsible);
        clubRepository.saveClub(club);
        return clubsOverview(null);
    }

    @Override
    public Map<String, Object> clubsOverview(Pagination pagination) {
        if (pagination == null) pagination = new Pagination();
        PageRequest pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());
        Map<String,Object> volunteersOverview = new HashMap<>();
        volunteersOverview.put("items", clubMapper.mapClubListToClubDtoList(clubRepository.findAllClubs(pageRequest.getSort(),pageRequest)));
        volunteersOverview.put("total", clubRepository.totalCountVolunteers());
        return volunteersOverview;
    }

    @Override
    public ClubDto findClubById(UUID id) {
        var games = gameService.findGamesByClub(id);
        return clubMapper.mapClubToClubDto(clubRepository.findByClubId(id),games);
    }

    @Override
    @Transactional
    public ClubDto assignVolunteerToClub(UUID volunteerId, UUID clubId) {
        var volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        var club = clubRepository.findByClubId(clubId);

        club.setResponsible(volunteer);
        volunteer.setClub(club);

        volunteerRepository.saveVolunteer(volunteer);

        return clubMapper.mapClubToClubDto(club,null);
    }

}

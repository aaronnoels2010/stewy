package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.ClubStatus;
import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.VolunteerProfileDto;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.VolunteerGame;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.GameParticipationStatusDTO;
import be.an.stewy.stewyapi.mapper.VolunteerDto;
import be.an.stewy.stewyapi.mapper.VolunteerMapper;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.User;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.UserRepository;
import be.an.stewy.stewyapi.repository.VolunteerGameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.VolunteerService;
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
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public VolunteerServiceImpl(VolunteerRepository volunteerRepository, VolunteerMapper volunteerMapper, ClubRepository clubRepository, GameRepository gameRepository, VolunteerGameRepository volunteerGameRepository, UserRepository userRepository) {
        this.volunteerRepository = volunteerRepository;
        this.volunteerMapper = volunteerMapper;
        this.clubRepository = clubRepository;
        this.volunteerGameRepository = volunteerGameRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
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

    @Override
    @Transactional
    public VolunteerProfileResponseDto createProfile(UUID userId, VolunteerProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new CustomException("User must be active to create a profile");
        }

        Volunteer existing = volunteerRepository.findByUserId(userId);
        if (existing != null) {
            throw new CustomException("Profile already exists");
        }

        Club club = null;
        if (dto.getClubId() != null) {
            club = clubRepository.findByClubId(dto.getClubId());
        } else if (dto.getClubName() != null && !dto.getClubName().isBlank()) {
            VolunteerRole role = VolunteerRole.mapStringToVolunteerRole(dto.getRole());
            if (role != VolunteerRole.HOOFD_STEWARD) {
                throw new CustomException("Only HoofdSteward can create a new club");
            }
            String trimmedName = dto.getClubName().trim();
            Club clubByName = clubRepository.findByClubName(trimmedName);
            if (clubByName != null) {
                throw new CustomException("A club with this name already exists");
            }
            club = Club.builder()
                    .clubName(trimmedName)
                    .build();
            clubRepository.saveClub(club);
        }

        Volunteer volunteer = new Volunteer();
        volunteer.setFirstName(user.getFirstName());
        volunteer.setLastName(user.getLastName());
        volunteer.setRole(VolunteerRole.mapStringToVolunteerRole(dto.getRole()));
        volunteer.setKbvbId(dto.getKbvbId());
        volunteer.setClub(club);
        volunteer.setUser(user);
        volunteer.setProfileStatus(ProfileStatus.PENDING_APPROVAL);
        volunteer.setClubStatus(ClubStatus.PENDING);

        volunteerRepository.saveVolunteer(volunteer);
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }

    @Override
    @Transactional
    public VolunteerProfileResponseDto approveProfile(UUID volunteerId) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null) {
            throw new CustomException("Volunteer not found");
        }
        if (volunteer.getProfileStatus() == ProfileStatus.APPROVED) {
            throw new CustomException("Profile is already approved");
        }
        volunteer.setProfileStatus(ProfileStatus.APPROVED);

        if (volunteer.getRole() == VolunteerRole.HOOFD_STEWARD) {
            volunteer.setClubStatus(ClubStatus.APPROVED);
            Club club = volunteer.getClub();
            if (club != null) {
                club.setResponsible(volunteer);
                clubRepository.saveClub(club);
            }
        }

        volunteerRepository.update(volunteer);
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }

    @Override
    @Transactional
    public VolunteerProfileResponseDto rejectProfile(UUID volunteerId, String reason) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null) {
            throw new CustomException("Volunteer not found");
        }
        volunteer.setProfileStatus(ProfileStatus.REJECTED);
        volunteerRepository.update(volunteer);
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }

    @Override
    public List<VolunteerProfileResponseDto> getVolunteersByProfileStatus(be.an.stewy.stewyapi.ProfileStatus status) {
        return volunteerRepository.findByProfileStatus(status.name())
                .stream()
                .map(volunteerMapper::mapVolunteerToProfileResponse)
                .toList();
    }

    @Override
    public VolunteerProfileResponseDto getMyProfile(UUID userId) {
        Volunteer volunteer = volunteerRepository.findByUserId(userId);
        if (volunteer == null) {
            throw new CustomException("Profile not found");
        }
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }
}

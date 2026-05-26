package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.GameStatus;
import be.an.stewy.stewyapi.ParticipationStatus;
import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.domain.VolunteerGame;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.VolunteerGameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.GameParticipationService;
import be.an.stewy.stewyapi.service.ParticipationStateMachine;
import be.an.stewy.stewyapi.service.VolunteerGameDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class GameParticipationServiceImpl implements GameParticipationService {

    private final VolunteerGameRepository volunteerGameRepository;
    private final GameRepository gameRepository;
    private final VolunteerRepository volunteerRepository;

    public GameParticipationServiceImpl(VolunteerGameRepository volunteerGameRepository,
                                         GameRepository gameRepository,
                                         VolunteerRepository volunteerRepository) {
        this.volunteerGameRepository = volunteerGameRepository;
        this.gameRepository = gameRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @Override
    @Transactional
    public void requestParticipation(UUID volunteerId, UUID gameId) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null || volunteer.getProfileStatus() != ProfileStatus.APPROVED) {
            throw new CustomException("Volunteer must have an approved profile");
        }

        Game game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new CustomException("Game not found");
        }
        if (game.getStatus() != GameStatus.OPEN) {
            throw new CustomException("Cannot request participation in a game that is not OPEN");
        }

        VolunteerGame existing = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (existing != null) {
            throw new CustomException("Already requested participation for this game");
        }

        VolunteerGame vg = new VolunteerGame();
        vg.setVolunteerId(volunteerId);
        vg.setGameId(gameId);
        vg.setParticipationStatus(ParticipationStatus.REQUESTED);
        volunteerGameRepository.assignVolunteerToGame(vg);
    }

    @Override
    @Transactional
    public void approveParticipation(UUID volunteerId, UUID gameId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation request not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.APPROVE,
                ParticipationStateMachine.Actor.HOOFD_STEWARD,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.APPROVED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void rejectParticipation(UUID volunteerId, UUID gameId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation request not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.REJECT,
                ParticipationStateMachine.Actor.HOOFD_STEWARD,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.REJECTED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void approveByHoofdSteward(UUID gameId, UUID volunteerId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation request not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.APPROVE,
                ParticipationStateMachine.Actor.HOOFD_STEWARD,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.APPROVED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void rejectByHoofdSteward(UUID gameId, UUID volunteerId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation request not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.REJECT,
                ParticipationStateMachine.Actor.HOOFD_STEWARD,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.REJECTED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void inviteVolunteer(UUID gameId, UUID volunteerId) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null) {
            throw new CustomException("Volunteer not found");
        }

        Game game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new CustomException("Game not found");
        }

        VolunteerGame existing = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (existing != null) {
            throw new CustomException("Volunteer already has a participation for this game");
        }

        VolunteerGame vg = new VolunteerGame();
        vg.setVolunteerId(volunteerId);
        vg.setGameId(gameId);
        vg.setParticipationStatus(ParticipationStatus.INVITED);
        volunteerGameRepository.assignVolunteerToGame(vg);
    }

    @Override
    @Transactional
    public void acceptInvitation(UUID volunteerId, UUID gameId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Invitation not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.ACCEPT,
                ParticipationStateMachine.Actor.VOLUNTEER,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.APPROVED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void declineInvitation(UUID volunteerId, UUID gameId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Invitation not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.DECLINE,
                ParticipationStateMachine.Actor.VOLUNTEER,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.REJECTED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void cancelParticipation(UUID gameId, UUID volunteerId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation not found");
        }
        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.CANCEL,
                ParticipationStateMachine.Actor.HOOFD_STEWARD,
                true
        );
        vg.setParticipationStatus(ParticipationStatus.CANCELLED);
        volunteerGameRepository.update(vg);
    }

    @Override
    @Transactional
    public void withdrawParticipation(UUID volunteerId, UUID gameId) {
        VolunteerGame vg = volunteerGameRepository.findByVolunteerIdAndGameId(volunteerId, gameId);
        if (vg == null) {
            throw new CustomException("Participation not found");
        }

        Game game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new CustomException("Game not found");
        }

        ZoneId now = ZoneId.systemDefault();
        var deadline = game.getDeadline().withZoneSameInstant(now);
        boolean isBeforeDeadline = ZonedDateTime.now().isBefore(deadline);

        ParticipationStateMachine.transition(
                vg.getParticipationStatus(),
                ParticipationStateMachine.Action.WITHDRAW,
                ParticipationStateMachine.Actor.VOLUNTEER,
                isBeforeDeadline
        );
        vg.setParticipationStatus(ParticipationStatus.WITHDRAWN);
        volunteerGameRepository.update(vg);
    }

    @Override
    public List<VolunteerGameDto> getPendingRequestsForGame(UUID gameId) {
        return volunteerGameRepository.findByGameId(gameId).stream()
                .filter(vg -> vg.getParticipationStatus() == ParticipationStatus.REQUESTED)
                .map(this::toVolunteerGameDto)
                .toList();
    }

    @Override
    public List<VolunteerGameDto> getInvitationsForVolunteer(UUID volunteerId) {
        return volunteerGameRepository.findGamesWithParticipationStatus(volunteerId).stream()
                .filter(vg -> vg.getParticipationStatus() == ParticipationStatus.INVITED)
                .map(this::toVolunteerGameDto)
                .toList();
    }

    @Override
    public List<VolunteerGameDto> getPendingRequestsForClubGames(UUID clubId) {
        List<Game> homeGames = gameRepository.findByHomeTeamId(clubId);
        List<UUID> gameIds = homeGames.stream().map(Game::getId).toList();
        if (gameIds.isEmpty()) return List.of();
        return volunteerGameRepository.findByGameIds(gameIds).stream()
                .filter(vg -> vg.getParticipationStatus() == ParticipationStatus.REQUESTED)
                .map(this::toVolunteerGameDto)
                .toList();
    }

    @Override
    public List<VolunteerGameDto> getPendingInvitationsForClubGames(UUID clubId) {
        List<Game> homeGames = gameRepository.findByHomeTeamId(clubId);
        List<UUID> gameIds = homeGames.stream().map(Game::getId).toList();
        if (gameIds.isEmpty()) return List.of();
        return volunteerGameRepository.findByGameIds(gameIds).stream()
                .filter(vg -> vg.getParticipationStatus() == ParticipationStatus.INVITED)
                .map(this::toVolunteerGameDto)
                .toList();
    }

    private VolunteerGameDto toVolunteerGameDto(VolunteerGame vg) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(vg.getVolunteerId());
        String name = volunteer != null ? volunteer.getFirstName() + " " + volunteer.getLastName() : "Unknown";
        return new VolunteerGameDto(vg.getVolunteerId(), name, vg.getParticipationStatus());
    }
}

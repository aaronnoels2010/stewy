package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.mapper.GameParticipationStatusDTO;
import be.an.stewy.stewyapi.mapper.VolunteerDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface VolunteerService {
    Map<String,Object> createNewPerson(VolunteerRegistrationDto volunteerRegistrationDto);

    Map<String, Object> volunteersOverview(Pagination pagination);

    VolunteerDto findVolunteerById(UUID volunteerId);

    void assignVolunteerToGame(UUID volunteerId, UUID gameId);
    List<GameParticipationStatusDTO> findGamesWithParticipationStatus(UUID volunteerId);
}

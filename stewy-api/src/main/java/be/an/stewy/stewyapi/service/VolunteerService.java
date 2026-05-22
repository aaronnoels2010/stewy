package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.VolunteerProfileDto;
import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.mapper.GameParticipationStatusDTO;
import be.an.stewy.stewyapi.mapper.VolunteerDto;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface VolunteerService {
    Map<String,Object> createNewPerson(VolunteerRegistrationDto volunteerRegistrationDto);

    Map<String, Object> volunteersOverview(Pagination pagination);

    VolunteerDto findVolunteerById(UUID volunteerId);

    void assignVolunteerToGame(UUID volunteerId, UUID gameId);
    List<GameParticipationStatusDTO> findGamesWithParticipationStatus(UUID volunteerId);

    VolunteerProfileResponseDto createProfile(UUID userId, VolunteerProfileDto dto);
    VolunteerProfileResponseDto getMyProfile(UUID userId);
    VolunteerProfileResponseDto approveProfile(UUID volunteerId);
    VolunteerProfileResponseDto rejectProfile(UUID volunteerId, String reason);
    List<VolunteerProfileResponseDto> getVolunteersByProfileStatus(be.an.stewy.stewyapi.ProfileStatus status);
}

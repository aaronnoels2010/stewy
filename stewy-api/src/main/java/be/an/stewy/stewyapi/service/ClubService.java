package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.mapper.ClubDto;

import java.util.Map;
import java.util.UUID;

public interface ClubService {

    Map<String,Object> saveOrUpdateClub(ClubRegistrationDto clubRegistrationDto);

    Map<String, Object> clubsOverview(Pagination pagination);

    ClubDto findClubById(UUID id);

    ClubDto assignVolunteerToClub(UUID volunteerId, UUID clubId);
}

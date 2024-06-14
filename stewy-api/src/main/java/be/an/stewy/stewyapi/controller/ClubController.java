package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.mapper.ClubDto;
import be.an.stewy.stewyapi.service.ClubService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
public class ClubController {
    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @PostMapping(value = "/clubs/add")
    public Map<String,Object> saveNewClub(@RequestBody ClubRegistrationDto clubRegistrationDto){
        return clubService.saveOrUpdateClub(clubRegistrationDto);
    }

    @PostMapping(value = "/clubs",consumes = "application/json",produces = "application/json")
    public Map<String,Object> findAllClubs(@RequestBody Pagination  pagination){
        return clubService.clubsOverview(pagination);
    }

    @GetMapping(value = "/clubs/{id}",produces = "application/json")
    public ClubDto findClubById(@PathVariable("id") UUID id){
        return clubService.findClubById(id);
    }

    @PostMapping(value = "/clubs/assignVolunteer",produces = "application/json")
    public ClubDto assignVolunteerToClub(@RequestParam(name = "clubId") UUID clubId,@RequestParam(name = "volunteerId") UUID volunteerId){
        return  clubService.assignVolunteerToClub(volunteerId,clubId);
    }

}

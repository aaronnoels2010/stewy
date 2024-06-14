package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.mapper.GameParticipationStatusDTO;
import be.an.stewy.stewyapi.mapper.VolunteerDto;
import be.an.stewy.stewyapi.service.VolunteerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class VolunteerController {
    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @PostMapping(value = "/volunteers/add")
    public Map<String,Object> saveNewVolunteer(@RequestBody VolunteerRegistrationDto volunteerRegistrationDto){
        return volunteerService.createNewPerson(volunteerRegistrationDto);
    }

    @PostMapping(value = "/volunteers",consumes = "application/json",produces = "application/json")
    public Map<String,Object> findAllVolunteers(@RequestBody Pagination  pagination){
        return volunteerService.volunteersOverview(pagination);
    }

    @GetMapping(value = "/volunteers/{volunteerId}", produces = "application/json")
    public VolunteerDto findVolunteerById(@PathVariable(name = "volunteerId") UUID volunteerId){
        return volunteerService.findVolunteerById(volunteerId);
    }

    @PostMapping(value = "/volunteers/{volunteerId}/{gameId}", produces = "application/json",consumes = "application/json")
    public void assignVolunteerToGame(@PathVariable(name = "volunteerId") UUID volunteerId,@PathVariable(name = "gameId") UUID gameId){
        volunteerService.assignVolunteerToGame(volunteerId,gameId);
    }

    @GetMapping(value = "/volunteers/{volunteerId}/games/participation", produces = "application/json")
    public List<GameParticipationStatusDTO> findGamesWithParticipationStatus(@PathVariable(name = "volunteerId") UUID volunteerId){
        return volunteerService.findGamesWithParticipationStatus(volunteerId);
    }
}

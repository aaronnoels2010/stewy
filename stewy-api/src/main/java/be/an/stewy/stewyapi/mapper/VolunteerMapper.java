package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VolunteerMapper {
    @Mapping(source = "club", target = "club")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", qualifiedByName = "mapToVolunteerRole", source = "registrationDto.volunteerRole")
    @Mapping(target = "games", ignore = true)
    Volunteer mapVolunteerRegistrationDtoToVolunteer(VolunteerRegistrationDto registrationDto, Club club);

    @Named(value = "mapToVolunteerRole")
    default VolunteerRole mapStringToVolunteerRole(String role){
        return VolunteerRole.mapStringToVolunteerRole(role);
    }

    VolunteerDto mapVolunteerToVolunteerDto(Volunteer volunteer);

    List<VolunteerDto> mapVolunteerListToVolunteerDto(List<Volunteer> volunteerList);

    @Mapping(target = "game",source = "game", qualifiedByName = "generateGame")
    GameOverViewDto mapGameToGameOverviewDto(Game game);

    @Named(value = "generateGame")
    default String mapToGame(Game game){
        return String.format("%s - %s",game.getHomeTeam().getClubName(),game.getAwayTeam().getClubName());

    }


}

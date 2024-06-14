package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.yaml.snakeyaml.util.EnumUtils;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClubMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "responsible",source = "volunteer")
    @Mapping(target = "volunteerList", ignore = true)
    @Mapping(target = "homeGames", ignore = true)
    @Mapping(target = "awayGames", ignore = true)
    Club mapClubRegistrationDtoToClub(ClubRegistrationDto clubRegistrationDto, Volunteer volunteer);


    @Mapping(target = "responsible.club", ignore = true)
    @Mapping(target = "gameList",source = "games")
    ClubDto mapClubToClubDto(Club club, List<GameDto> games);


    @Mapping(target = "role", qualifiedByName = "volunteerRole", source = "role")
    VolunteerDto mapVolunteerToVolunteerDto(Volunteer volunteer);

    List<ClubDto> mapClubListToClubDtoList(List<Club> clubs);

    @Named(value = "volunteerRole")
    default String mapVolunteerEnumToString(VolunteerRole volunteerRole){
        return volunteerRole == null ? null : volunteerRole.name();
    }






}

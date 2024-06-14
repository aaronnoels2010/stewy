package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.controller.GameRegistrationDto;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.repository.GameRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface GameMapper {
    @Mapping(target = "game",source = "game", qualifiedByName = "mapGame")
    @Mapping(target = "deadline", source = "deadline", qualifiedByName = "mapZonedDateTime")
    @Mapping(target = "appointment", source = "appointment", qualifiedByName = "mapZonedDateTime")
    GameDto mapGameToGameDto(Game game);

    List<GameDto> mapGameListToGameDtoList(List<Game> games);
    @Mapping(target = "id", source = "gameRegistrationDto.id")
    @Mapping(target = "homeTeam",source = "homeTeam")
    @Mapping(target = "awayTeam",source = "awayTeam")
    @Mapping(target = "appointment",ignore = true)
    @Mapping(target = "deadline",ignore = true)
    @Mapping(target = "status",ignore = true)
    @Mapping(target = "responsible",ignore = true)
    @Mapping(target = "participants",ignore = true)
    Game mapGameRegistrationDtoToGame(GameRegistrationDto gameRegistrationDto,Club homeTeam,Club awayTeam);


    VolunteerDto mapVolunteerToVolunteerDto(Volunteer volunteer);

    @Named(value = "mapGame")
    default String mapGameToClubDto(Game game){
        return String.format("%s - %s",game.getHomeTeam().getClubName(),game.getAwayTeam().getClubName());
    }

    @Named(value = "mapZonedDateTime")
    default LocalDateTime mapGameToClubDto(ZonedDateTime zonedDateTime){
        ZoneId now = ZoneId.systemDefault();
        var appointment = zonedDateTime.withZoneSameInstant(now);

        return appointment.toLocalDateTime();
    }

}

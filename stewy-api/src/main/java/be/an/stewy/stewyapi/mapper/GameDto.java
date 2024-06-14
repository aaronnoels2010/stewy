package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.GameStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class GameDto {
    private UUID id;
    private String game;
    private LocalDateTime appointment;
    private LocalDateTime deadline;
    private List<VolunteerDto> participants;
    private ClubDto homeTeam;
    private ClubDto awayTeam;
    private GameStatus status;
    private VolunteerDto responsible;

}

package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.GameStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Setter
@Getter
public class GameOverViewDto {
    private UUID id;
    private String game;
    private GameStatus status;
    private LocalDateTime appointment;
    private LocalDateTime deadline;
}

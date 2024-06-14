package be.an.stewy.stewyapi.mapper;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;
@AllArgsConstructor
@Getter
public class GameParticipationStatusDTO {
    private UUID id;
    private String game;
    private boolean isSubscribed;
}

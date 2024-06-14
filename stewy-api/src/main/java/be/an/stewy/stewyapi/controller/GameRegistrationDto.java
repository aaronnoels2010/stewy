package be.an.stewy.stewyapi.controller;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class GameRegistrationDto {
    private UUID id;
    private UUID homeTeam;
    private UUID awayTeam;
    private String appointment;
    private String deadline;
    private String status;
}

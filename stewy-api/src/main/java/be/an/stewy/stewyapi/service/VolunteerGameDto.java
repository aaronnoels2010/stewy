package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ParticipationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class VolunteerGameDto {
    private UUID volunteerId;
    private String volunteerName;
    private ParticipationStatus status;
}

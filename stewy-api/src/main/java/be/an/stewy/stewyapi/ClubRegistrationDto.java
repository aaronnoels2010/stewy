package be.an.stewy.stewyapi;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ClubRegistrationDto {
    private UUID id;
    private String clubName;
    private UUID responsible;
    private String parkingInstructions;
    private String volunteerRole;
}

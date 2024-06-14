package be.an.stewy.stewyapi;

import be.an.stewy.stewyapi.domain.Club;
import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class VolunteerRegistrationDto {
    private String volunteerRole;
    private String firstName;
    private String lastName;
    private UUID clubId;
    private String kbvbId;
    public VolunteerRegistrationDto(){}


}

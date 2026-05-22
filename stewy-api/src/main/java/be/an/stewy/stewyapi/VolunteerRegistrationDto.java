package be.an.stewy.stewyapi;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class VolunteerRegistrationDto {
    @NotBlank(message = "Volunteer role is required")
    private String volunteerRole;

    private String firstName;
    private String lastName;

    @NotNull(message = "Club is required")
    private UUID clubId;

    @NotBlank(message = "KBVB ID is required")
    private String kbvbId;

    public VolunteerRegistrationDto(){}
}

package be.an.stewy.stewyapi;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VolunteerProfileDto {
    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "KBVB ID is required")
    private String kbvbId;

    private UUID clubId;

    private String clubName;
}

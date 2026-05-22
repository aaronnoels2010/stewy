package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.ClubStatus;
import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.VolunteerRole;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VolunteerProfileResponseDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private VolunteerRole role;
    private ClubOverViewDto club;
    private String kbvbId;
    private ProfileStatus profileStatus;
    private ClubStatus clubStatus;
}

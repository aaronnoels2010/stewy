package be.an.stewy.stewyapi.mapper;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class VolunteerDto {
    private String lastName;
    private String firstName;
    private UUID id;
    private ClubOverViewDto club;
    private String role;
    private String kbvbId;
    private List<GameOverViewDto> games;

}

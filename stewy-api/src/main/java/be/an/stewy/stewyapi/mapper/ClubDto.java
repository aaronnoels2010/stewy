package be.an.stewy.stewyapi.mapper;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ClubDto {
    private UUID id;
    private List<VolunteerDto> volunteerList;
    private VolunteerDto responsible;
    private String parkingInstructions;
    private String clubName;
    private List<GameDto> gameList;


}

package be.an.stewy.stewyapi.mapper;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ClubOverViewDto {
    private UUID id;
    private String clubName;
}

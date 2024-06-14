package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.domain.Club;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public interface ClubRepository {
    void saveClub(Club club);

    Club findByClubId(UUID id);

    List<Club> findAllClubs(Sort sort, PageRequest pageRequest);

    Object totalCountVolunteers();
}

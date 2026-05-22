package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.mapper.ClubMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.Impl.ClubServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;
    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private GameService gameService;
    @Mock
    private ClubMapper clubMapper;

    private ClubServiceImpl clubService;

    @BeforeEach
    void setUp() {
        clubService = new ClubServiceImpl(clubRepository, volunteerRepository, gameService, clubMapper);
    }

    @Test
    void clubsOverview_withoutFilter_returnsAllClubs() {
        Pagination pagination = new Pagination();
        List<Club> clubs = List.of(new Club());
        when(clubRepository.findAllClubs(any(Sort.class), any(PageRequest.class))).thenReturn(clubs);

        Map<String, Object> result = clubService.clubsOverview(pagination, false);

        verify(clubRepository).findAllClubs(any(Sort.class), any(PageRequest.class));
        verify(clubRepository, never()).findAllClubsWithHoofdSteward(any(Sort.class), any(PageRequest.class));
        assertNotNull(result);
    }

    @Test
    void clubsOverview_withFilter_returnsFilteredClubs() {
        Pagination pagination = new Pagination();
        List<Club> clubs = List.of(new Club());
        when(clubRepository.findAllClubsWithHoofdSteward(any(Sort.class), any(PageRequest.class))).thenReturn(clubs);

        Map<String, Object> result = clubService.clubsOverview(pagination, true);

        verify(clubRepository, never()).findAllClubs(any(Sort.class), any(PageRequest.class));
        verify(clubRepository).findAllClubsWithHoofdSteward(any(Sort.class), any(PageRequest.class));
        assertNotNull(result);
    }
}

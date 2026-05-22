package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.VolunteerProfileDto;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.User;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.VolunteerMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.GameRepository;
import be.an.stewy.stewyapi.repository.UserRepository;
import be.an.stewy.stewyapi.repository.VolunteerGameRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import be.an.stewy.stewyapi.service.Impl.VolunteerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolunteerServiceTest {

    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private VolunteerMapper volunteerMapper;
    @Mock
    private ClubRepository clubRepository;
    @Mock
    private VolunteerGameRepository volunteerGameRepository;
    @Mock
    private GameRepository gameRepository;
    @Mock
    private UserRepository userRepository;

    private VolunteerServiceImpl volunteerService;
    private UUID userId;
    private User activeUser;

    @BeforeEach
    void setUp() {
        volunteerService = new VolunteerServiceImpl(volunteerRepository, volunteerMapper, clubRepository,
                gameRepository, volunteerGameRepository, userRepository);
        userId = UUID.randomUUID();
        activeUser = new User();
        activeUser.setId(userId);
        activeUser.setStatus(UserStatus.ACTIVE);
        activeUser.setFirstName("John");
        activeUser.setLastName("Doe");
    }

    @Test
    void createProfile_withClubNameAndNonHoofdSteward_rejects() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser));
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);

        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("STEWARD");
        dto.setKbvbId("KBVB-123");
        dto.setClubName("New Club");

        CustomException ex = assertThrows(CustomException.class,
                () -> volunteerService.createProfile(userId, dto));
        assertTrue(ex.getMessage().contains("Only HoofdSteward can create a new club"));
    }

    @Test
    void createProfile_withDuplicateClubName_rejects() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser));
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);

        Club existingClub = new Club();
        existingClub.setClubName("Existing Club");
        when(clubRepository.findByClubName("Existing Club")).thenReturn(existingClub);

        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("HOOFD_STEWARD");
        dto.setKbvbId("KBVB-123");
        dto.setClubName("Existing Club");

        CustomException ex = assertThrows(CustomException.class,
                () -> volunteerService.createProfile(userId, dto));
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    void createProfile_withClubId_succeeds() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser));
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);

        UUID clubId = UUID.randomUUID();
        Club club = new Club();
        club.setId(clubId);
        club.setClubName("Test Club");
        when(clubRepository.findByClubId(clubId)).thenReturn(club);

        Volunteer savedVolunteer = new Volunteer();
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);
        doNothing().when(volunteerRepository).saveVolunteer(any(Volunteer.class));

        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("STEWARD");
        dto.setKbvbId("KBVB-123");
        dto.setClubId(clubId);

        assertDoesNotThrow(() -> volunteerService.createProfile(userId, dto));
        verify(volunteerRepository).saveVolunteer(any(Volunteer.class));
    }

    @Test
    void createProfile_withClubNameAndHoofdSteward_createsClub() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser));
        when(volunteerRepository.findByUserId(userId)).thenReturn(null);
        when(clubRepository.findByClubName("New Club")).thenReturn(null);
        doNothing().when(clubRepository).saveClub(any(Club.class));

        Volunteer savedVolunteer = new Volunteer();
        doNothing().when(volunteerRepository).saveVolunteer(any(Volunteer.class));

        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("HOOFD_STEWARD");
        dto.setKbvbId("KBVB-123");
        dto.setClubName("New Club");

        assertDoesNotThrow(() -> volunteerService.createProfile(userId, dto));
        verify(clubRepository).saveClub(any(Club.class));
        verify(volunteerRepository).saveVolunteer(any(Volunteer.class));
    }
}

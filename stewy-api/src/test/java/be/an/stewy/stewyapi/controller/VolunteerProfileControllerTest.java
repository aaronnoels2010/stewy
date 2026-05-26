package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.ProfileStatus;
import be.an.stewy.stewyapi.VolunteerProfileDto;
import be.an.stewy.stewyapi.VolunteerRole;
import be.an.stewy.stewyapi.advice.PersonExceptionHandler;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.service.AuthorizationService;
import be.an.stewy.stewyapi.service.VolunteerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VolunteerProfileControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VolunteerService volunteerService;

    @Mock
    private AuthorizationService authorizationService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        VolunteerProfileController controller = new VolunteerProfileController(volunteerService, authorizationService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setValidator(new LocalValidatorFactoryBean())
                .setControllerAdvice(new PersonExceptionHandler())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAsAdmin() {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("admin", "pass",
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))));
    }

    private void authenticateAsUser() {
        SecurityContextHolder.setContext(new org.springframework.security.core.context.SecurityContextImpl(
                new UsernamePasswordAuthenticationToken("user", "pass",
                        List.of())));
    }

    @Test
    void createProfile_withBlankRole_returnsFieldError() throws Exception {
        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("");
        dto.setKbvbId("KBVB-123");

        mockMvc.perform(post("/volunteers/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.role").exists());
    }

    @Test
    void createProfile_withBlankKbvbId_returnsFieldError() throws Exception {
        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("STEWARD");
        dto.setKbvbId("");

        mockMvc.perform(post("/volunteers/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.kbvbId").exists());
    }

    @Test
    void approveProfile_withAdmin_returnsOk() throws Exception {
        authenticateAsAdmin();
        UUID volunteerId = UUID.randomUUID();
        VolunteerProfileResponseDto responseDto = new VolunteerProfileResponseDto();
        responseDto.setId(volunteerId);

        when(volunteerService.approveProfile(volunteerId)).thenReturn(responseDto);

        mockMvc.perform(post("/volunteers/{volunteerId}/profile/approve", volunteerId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(volunteerService).approveProfile(volunteerId);
    }

    @Test
    void approveProfile_withHoofdSteward_returnsOk() throws Exception {
        authenticateAsUser();
        UUID volunteerId = UUID.randomUUID();
        VolunteerProfileResponseDto responseDto = new VolunteerProfileResponseDto();
        responseDto.setId(volunteerId);

        Club club = new Club();
        club.setId(UUID.randomUUID());
        Volunteer hoofdSteward = new Volunteer();
        hoofdSteward.setId(UUID.randomUUID());
        hoofdSteward.setRole(VolunteerRole.HOOFD_STEWARD);
        hoofdSteward.setClub(club);

        when(authorizationService.checkHoofdStewardForVolunteer(any(Authentication.class), eq(volunteerId)))
                .thenReturn(hoofdSteward);
        when(volunteerService.approveProfile(volunteerId)).thenReturn(responseDto);

        mockMvc.perform(post("/volunteers/{volunteerId}/profile/approve", volunteerId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(volunteerService).approveProfile(volunteerId);
    }

    @Test
    void approveProfile_withUnauthorizedUser_returnsForbidden() throws Exception {
        authenticateAsUser();
        UUID volunteerId = UUID.randomUUID();

        when(authorizationService.checkHoofdStewardForVolunteer(any(Authentication.class), eq(volunteerId)))
                .thenThrow(new org.springframework.security.access.AccessDeniedException("Access denied"));

        mockMvc.perform(post("/volunteers/{volunteerId}/profile/approve", volunteerId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void rejectProfile_withAdmin_returnsOk() throws Exception {
        authenticateAsAdmin();
        UUID volunteerId = UUID.randomUUID();
        VolunteerProfileResponseDto responseDto = new VolunteerProfileResponseDto();
        responseDto.setId(volunteerId);

        when(volunteerService.rejectProfile(eq(volunteerId), anyString())).thenReturn(responseDto);

        mockMvc.perform(post("/volunteers/{volunteerId}/profile/reject", volunteerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("reason", "test"))))
                .andExpect(status().isOk());

        verify(volunteerService).rejectProfile(volunteerId, "test");
    }

    @Test
    void rejectProfile_withHoofdSteward_returnsOk() throws Exception {
        authenticateAsUser();
        UUID volunteerId = UUID.randomUUID();
        VolunteerProfileResponseDto responseDto = new VolunteerProfileResponseDto();
        responseDto.setId(volunteerId);

        Club club = new Club();
        club.setId(UUID.randomUUID());
        Volunteer hoofdSteward = new Volunteer();
        hoofdSteward.setId(UUID.randomUUID());
        hoofdSteward.setRole(VolunteerRole.HOOFD_STEWARD);
        hoofdSteward.setClub(club);

        when(authorizationService.checkHoofdStewardForVolunteer(any(Authentication.class), eq(volunteerId)))
                .thenReturn(hoofdSteward);
        when(volunteerService.rejectProfile(eq(volunteerId), anyString())).thenReturn(responseDto);

        mockMvc.perform(post("/volunteers/{volunteerId}/profile/reject", volunteerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("reason", "test"))))
                .andExpect(status().isOk());

        verify(volunteerService).rejectProfile(volunteerId, "test");
    }

    @Test
    void getProfiles_withNonAdmin_returnsForbidden() throws Exception {
        authenticateAsUser();

        mockMvc.perform(get("/volunteers/profiles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getProfiles_withAdmin_returnsOk() throws Exception {
        authenticateAsAdmin();

        when(volunteerService.getVolunteersByProfileStatus(ProfileStatus.PENDING_APPROVAL))
                .thenReturn(List.of());
        when(volunteerService.getVolunteersByProfileStatus(ProfileStatus.APPROVED))
                .thenReturn(List.of());

        mockMvc.perform(get("/volunteers/profiles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}

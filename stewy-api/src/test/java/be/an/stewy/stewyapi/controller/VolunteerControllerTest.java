package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.advice.PersonExceptionHandler;
import be.an.stewy.stewyapi.service.VolunteerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VolunteerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VolunteerService volunteerService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        VolunteerController controller = new VolunteerController(volunteerService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setValidator(new LocalValidatorFactoryBean())
                .setControllerAdvice(new PersonExceptionHandler())
                .build();
    }

    @Test
    void saveNewVolunteer_withBlankVolunteerRole_returnsFieldError() throws Exception {
        VolunteerRegistrationDto dto = VolunteerRegistrationDto.builder()
                .volunteerRole("")
                .clubId(UUID.randomUUID())
                .kbvbId("KBVB-123")
                .build();

        mockMvc.perform(post("/volunteers/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.volunteerRole").exists());
    }

    @Test
    void saveNewVolunteer_withBlankKbvbId_returnsFieldError() throws Exception {
        VolunteerRegistrationDto dto = VolunteerRegistrationDto.builder()
                .volunteerRole("STEWARD")
                .clubId(UUID.randomUUID())
                .kbvbId("")
                .build();

        mockMvc.perform(post("/volunteers/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.kbvbId").exists());
    }

    @Test
    void saveNewVolunteer_withNullClubId_returnsFieldError() throws Exception {
        VolunteerRegistrationDto dto = VolunteerRegistrationDto.builder()
                .volunteerRole("STEWARD")
                .clubId(null)
                .kbvbId("KBVB-123")
                .build();

        mockMvc.perform(post("/volunteers/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.clubId").exists());
    }
}

package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.VolunteerProfileDto;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VolunteerProfileControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VolunteerService volunteerService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        VolunteerProfileController controller = new VolunteerProfileController(volunteerService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setValidator(new LocalValidatorFactoryBean())
                .setControllerAdvice(new PersonExceptionHandler())
                .build();
    }

    @Test
    void createProfile_withBlankRole_returnsFieldError() throws Exception {
        VolunteerProfileDto dto = new VolunteerProfileDto();
        dto.setRole("");
        dto.setKbvbId("KBVB-123");

        mockMvc.perform(post("/volunteers/profile")
                        .with(user("test-user"))
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

}

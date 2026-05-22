package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.LoginRequestDto;
import be.an.stewy.stewyapi.UserRegistrationDto;
import be.an.stewy.stewyapi.advice.PersonExceptionHandler;
import be.an.stewy.stewyapi.service.UserService;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        AuthController controller = new AuthController(userService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setValidator(new LocalValidatorFactoryBean())
                .setControllerAdvice(new PersonExceptionHandler())
                .build();
    }

    @Test
    void login_withInvalidEmail_returnsFieldError() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("not-an-email");
        dto.setPassword("password");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void login_withEmptyPassword_returnsFieldError() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@test.com");
        dto.setPassword("");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void login_withMultipleErrors_returnsAllFieldErrors() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("");
        dto.setPassword("");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void login_withValidPayload_succeeds() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("admin@stewy.com");
        dto.setPassword("password");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void register_withBlankFirstName_returnsFieldError() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("")
                .lastName("Doe")
                .email("test@test.com")
                .password("Password1")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists());
    }

    @Test
    void register_withBlankLastName_returnsFieldError() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("")
                .email("test@test.com")
                .password("Password1")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.lastName").exists());
    }

    @Test
    void register_withInvalidEmail_returnsFieldError() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("not-an-email")
                .password("Password1")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void register_withInvalidPhone_returnsFieldError() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("test@test.com")
                .password("Password1")
                .phone("not-a-phone")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").exists());
    }

    @Test
    void register_withValidE164Phone_succeeds() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("test@test.com")
                .password("Password1")
                .phone("+32495123456")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    void register_withShortPassword_returnsFieldError() throws Exception {
        UserRegistrationDto dto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("test@test.com")
                .password("Ab1")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").exists());
    }
}

package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.AuthResponseDto;
import be.an.stewy.stewyapi.LoginRequestDto;
import be.an.stewy.stewyapi.UserRegistrationDto;
import be.an.stewy.stewyapi.UserRole;
import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.domain.User;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.UserMapper;
import be.an.stewy.stewyapi.repository.UserRepository;
import be.an.stewy.stewyapi.security.CustomUserDetailsService;
import be.an.stewy.stewyapi.security.JwtTokenProvider;
import be.an.stewy.stewyapi.service.Impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private CustomUserDetailsService userDetailsService;

    private PasswordEncoder passwordEncoder;
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserServiceImpl(
                userRepository, userMapper, passwordEncoder,
                jwtTokenProvider, userDetailsService
        );
    }

    @Test
    void login_withCorrectCredentials_returnsToken() {
        UUID userId = UUID.randomUUID();
        String email = "test@test.com";
        String password = "password";
        String encodedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .id(userId)
                .email(email)
                .password(encodedPassword)
                .role(UserRole.VOLUNTEER)
                .status(UserStatus.ACTIVE)
                .build();

        be.an.stewy.stewyapi.mapper.UserDto userDto = new be.an.stewy.stewyapi.mapper.UserDto();
        userDto.setId(userId);
        userDto.setEmail(email);
        userDto.setRole(UserRole.VOLUNTEER);
        userDto.setStatus(UserStatus.ACTIVE);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userMapper.mapUserToUserDto(user)).thenReturn(userDto);
        when(jwtTokenProvider.generateToken(userId, email)).thenReturn("test-token");

        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        AuthResponseDto response = userService.login(loginRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        assertEquals(userId, response.getUser().getId());
    }

    @Test
    void login_withWrongPassword_fails() {
        String email = "test@test.com";
        String password = "password";
        String encodedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .id(UUID.randomUUID())
                .email(email)
                .password(encodedPassword)
                .role(UserRole.VOLUNTEER)
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail(email);
        loginRequest.setPassword("wrong-password");

        assertThrows(CustomException.class, () -> userService.login(loginRequest));
    }

    @Test
    void register_createsPendingUser() {
        String email = "new@test.com";

        UserRegistrationDto registrationDto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email(email)
                .password("password")
                .phone("123456789")
                .address("Test Address")
                .build();

        User user = User.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email(email)
                .password(passwordEncoder.encode("password"))
                .role(UserRole.VOLUNTEER)
                .status(UserStatus.PENDING)
                .build();

        be.an.stewy.stewyapi.mapper.UserDto userDto = new be.an.stewy.stewyapi.mapper.UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(email);
        userDto.setRole(UserRole.VOLUNTEER);
        userDto.setStatus(UserStatus.PENDING);

        when(userRepository.countByEmail(email)).thenReturn(0L);
        when(userMapper.mapRegistrationDtoToUser(any())).thenReturn(user);
        when(userMapper.mapUserToUserDto(user)).thenReturn(userDto);
        when(jwtTokenProvider.generateToken(user.getId(), email)).thenReturn("test-token");

        AuthResponseDto response = userService.register(registrationDto);

        assertNotNull(response);
        assertEquals(UserStatus.PENDING, response.getUser().getStatus());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_withDuplicateEmail_fails() {
        String email = "existing@test.com";

        UserRegistrationDto registrationDto = UserRegistrationDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email(email)
                .password("password")
                .build();

        when(userRepository.countByEmail(email)).thenReturn(1L);

        assertThrows(CustomException.class, () -> userService.register(registrationDto));
        verify(userRepository, never()).save(any());
    }

    @Test
    void getPendingUsers_returnsListOfPendingUsers() {
        User user1 = User.builder()
                .id(UUID.randomUUID())
                .email("user1@test.com")
                .status(UserStatus.PENDING)
                .build();
        User user2 = User.builder()
                .id(UUID.randomUUID())
                .email("user2@test.com")
                .status(UserStatus.PENDING)
                .build();

        be.an.stewy.stewyapi.mapper.UserDto dto1 = new be.an.stewy.stewyapi.mapper.UserDto();
        dto1.setId(user1.getId());
        dto1.setEmail(user1.getEmail());
        dto1.setStatus(UserStatus.PENDING);

        be.an.stewy.stewyapi.mapper.UserDto dto2 = new be.an.stewy.stewyapi.mapper.UserDto();
        dto2.setId(user2.getId());
        dto2.setEmail(user2.getEmail());
        dto2.setStatus(UserStatus.PENDING);

        when(userRepository.findByStatus(UserStatus.PENDING)).thenReturn(List.of(user1, user2));
        when(userMapper.mapUserToUserDto(user1)).thenReturn(dto1);
        when(userMapper.mapUserToUserDto(user2)).thenReturn(dto2);

        List<be.an.stewy.stewyapi.mapper.UserDto> result = userService.getPendingUsers();

        assertEquals(2, result.size());
        assertEquals(user1.getId(), result.get(0).getId());
        assertEquals(user2.getId(), result.get(1).getId());
        verify(userRepository).findByStatus(UserStatus.PENDING);
    }

    @Test
    void getPendingUsers_whenNone_returnsEmptyList() {
        when(userRepository.findByStatus(UserStatus.PENDING)).thenReturn(Collections.emptyList());

        List<be.an.stewy.stewyapi.mapper.UserDto> result = userService.getPendingUsers();

        assertTrue(result.isEmpty());
        verify(userRepository).findByStatus(UserStatus.PENDING);
        verifyNoInteractions(userMapper);
    }
}

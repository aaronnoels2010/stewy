package be.an.stewy.stewyapi.service.Impl;

import be.an.stewy.stewyapi.AuthResponseDto;
import be.an.stewy.stewyapi.LoginRequestDto;
import be.an.stewy.stewyapi.UserRegistrationDto;
import be.an.stewy.stewyapi.UserRole;
import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.domain.User;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.UserDto;
import be.an.stewy.stewyapi.mapper.UserMapper;
import be.an.stewy.stewyapi.repository.UserRepository;
import be.an.stewy.stewyapi.security.CustomUserDetailsService;
import be.an.stewy.stewyapi.security.JwtTokenProvider;
import be.an.stewy.stewyapi.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper,
                           PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider,
                           CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    @Transactional
    public AuthResponseDto register(UserRegistrationDto dto) {
        if (userRepository.countByEmail(dto.getEmail()) > 0) {
            throw new CustomException("Email already exists");
        }

        User user = userMapper.mapRegistrationDtoToUser(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.VOLUNTEER);
        user.setStatus(UserStatus.PENDING);
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponseDto(token, userMapper.mapUserToUserDto(user));
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new CustomException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponseDto(token, userMapper.mapUserToUserDto(user));
    }

    @Override
    public UserDto getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        return userMapper.mapUserToUserDto(user);
    }

    @Override
    public List<UserDto> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING)
                .stream()
                .map(userMapper::mapUserToUserDto)
                .toList();
    }

    @Override
    @Transactional
    public UserDto activateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new CustomException("User is already active");
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return userMapper.mapUserToUserDto(user);
    }

    @Override
    @Transactional
    public void updatePushToken(UUID userId, String pushToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        user.setPushToken(pushToken);
        userRepository.update(user);
    }
}

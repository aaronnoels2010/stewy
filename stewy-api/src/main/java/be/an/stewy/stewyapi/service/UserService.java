package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.AuthResponseDto;
import be.an.stewy.stewyapi.LoginRequestDto;
import be.an.stewy.stewyapi.UserRegistrationDto;
import be.an.stewy.stewyapi.mapper.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
    AuthResponseDto register(UserRegistrationDto dto);
    AuthResponseDto login(LoginRequestDto dto);
    UserDto getMe(UUID userId);
    List<UserDto> getPendingUsers();
    UserDto activateUser(UUID userId);
    void updatePushToken(UUID userId, String pushToken);
}

package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.AuthResponseDto;
import be.an.stewy.stewyapi.LoginRequestDto;
import be.an.stewy.stewyapi.mapper.UserDto;
import be.an.stewy.stewyapi.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        AuthResponseDto response = userService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody be.an.stewy.stewyapi.UserRegistrationDto registrationDto) {
        AuthResponseDto response = userService.register(registrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        UserDto user = userService.getMe(userId);
        return ResponseEntity.ok(user);
    }
}

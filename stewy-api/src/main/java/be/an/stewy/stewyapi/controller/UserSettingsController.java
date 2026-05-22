package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
public class UserSettingsController {

    private final UserService userService;

    public UserSettingsController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users/push-token")
    public ResponseEntity<Void> updatePushToken(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        userService.updatePushToken(userId, body.get("pushToken"));
        return ResponseEntity.ok().build();
    }
}

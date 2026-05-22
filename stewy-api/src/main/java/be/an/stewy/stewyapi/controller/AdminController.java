package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.mapper.UserDto;
import be.an.stewy.stewyapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/pending")
    public ResponseEntity<List<UserDto>> getPendingUsers(Authentication authentication) {
        checkAdmin(authentication);
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<UserDto> activateUser(
            @PathVariable UUID userId,
            Authentication authentication) {
        checkAdmin(authentication);
        return ResponseEntity.ok(userService.activateUser(userId));
    }

    private void checkAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new AccessDeniedException("Admin access required");
        }
    }
}

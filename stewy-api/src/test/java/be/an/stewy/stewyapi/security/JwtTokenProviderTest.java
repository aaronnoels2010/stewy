package be.an.stewy.stewyapi.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(
                "test-secret-key-that-is-at-least-256-bits-long-for-testing-hs256",
                3600000
        );
    }

    @Test
    void generateToken_returnsValidToken() {
        UUID userId = UUID.randomUUID();
        String token = jwtTokenProvider.generateToken(userId, "test@test.com");

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateToken_rejectsTamperedToken() {
        UUID userId = UUID.randomUUID();
        String token = jwtTokenProvider.generateToken(userId, "test@test.com");
        String tamperedToken = token.substring(0, token.length() - 5) + "XXXXX";

        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
    }

    @Test
    void getUserIdFromToken_returnsCorrectUserId() {
        UUID userId = UUID.randomUUID();
        String token = jwtTokenProvider.generateToken(userId, "test@test.com");

        UUID extractedUserId = jwtTokenProvider.getUserIdFromToken(token);
        assertEquals(userId, extractedUserId);
    }

    @Test
    void validateToken_rejectsExpiredToken() {
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(
                "test-secret-key-that-is-at-least-256-bits-long-for-testing-hs256",
                -1000
        );

        UUID userId = UUID.randomUUID();
        String token = shortLivedProvider.generateToken(userId, "test@test.com");

        assertFalse(shortLivedProvider.validateToken(token));
    }
}

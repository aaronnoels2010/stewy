# Testing Patterns

This document defines standard practices for unit and integration testing in the Stewy API.

## Test Environment Setup
- Tests utilize **JUnit 5 (Jupiter)** and **Mockito**.
- Run tests via Gradle:
  ```bash
  ./gradlew test
  ```

## Service Layer Testing
When testing service logic, mock repository dependencies to isolate the class under test.

Example structure (`UserServiceTest`):
```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testRegisterUser_Success() {
        // Arrange
        UserRegistrationDto dto = new UserRegistrationDto("John", "Doe", "john@example.com", "password");
        when(userRepository.countByEmail(anyString())).thenReturn(0L);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");

        // Act
        userService.registerUser(dto);

        // Assert
        verify(userRepository, times(1)).save(any(User.class));
    }
}
```

## Security Layer Testing
When testing token generation and claims parsing:
- Target: `JwtTokenProvider`
- Assert that invalid tokens throw appropriate exception and expired tokens fail validation.

Example `JwtTokenProviderTest`:
```java
public class JwtTokenProviderTest {
    private JwtTokenProvider tokenProvider;
    private final String secret = "test-secret-key-that-is-at-least-256-bits-long-for-hs256";
    private final long expiration = 3600000;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, expiration);
    }

    @Test
    void testGenerateAndValidateToken() {
        String email = "user@example.com";
        String token = tokenProvider.generateToken(email);
        
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(email, tokenProvider.getEmailFromToken(token));
    }
}
```

## Mocking Best Practices
1. **Never mock entities**: Construct real instances of `User`, `Volunteer`, `Game`, etc. using their builders.
2. **Mock Custom Repositories**: Stub methods like `save()`, `findById()`, or `findByEmail()` explicitly.
3. **Verify Side Effects**: Use Mockito's `verify` to confirm updates are saved to the database.

# Quick Reference

## Session Start Checklist
1. Read the root [AGENTS.md](file:///Users/aaron.noels/DEV/stewy/stewy-api/AGENTS.md) to understand overall protocol.
2. Load [.agents/COMMON_MISTAKES.md](file:///Users/aaron.noels/DEV/stewy/stewy-api/.agents/COMMON_MISTAKES.md) to review typical traps.
3. Validate gradle compilation: `./gradlew compileJava` to fetch dependencies.
4. Execute tests: `./gradlew test` to verify current codebase state.

## Core Code Patterns

### 1. Declaring a Custom Repository
Always define the repository interface under `repository/`:
```java
public interface UserRepository {
    void save(User user);
    Optional<User> findById(UUID id);
}
```
Implement it under `repository/Impl/` using `EntityManager`:
```java
@Repository
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class UserRepositoryImpl implements UserRepository {
    private final EntityManager entityManager;

    public UserRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void save(User user) {
        entityManager.persist(user);
    }
}
```

### 2. DTO and MapStruct Mapping
Define the mapping converter interface in `mapper/`:
```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(UserRegistrationDto dto);
}
```

### 3. WebSocket Configuration
Messages map through prefix `/chat` to topic `/topic/messages` using messaging handlers in controllers.

## Debugging Tips
- Check `application.properties` for the JDBC connection url if databases fail to connect.
- Check generated classes in `build/generated/sources/annotationProcessor/` if MapStruct or Lombok getters/setters cannot be resolved.

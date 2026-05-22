# API Design and Data Flow

This document details request/response patterns, REST conventions, WebSocket architecture, and mapper patterns.

## REST Controllers
- All REST endpoints are created in `controller/` annotated with `@RestController` or standard Spring `@Controller`.
- Endpoint naming follows lowercase paths: `/auth`, `/volunteer`, `/game`, `/club`, `/admin`.
- HTTP mappings:
  - `GET` to retrieve details.
  - `POST` to create resources.
  - `PUT` to update resource attributes.
  - `DELETE` to remove resources.

## DTO and Mapping Flow
Entities are isolated from endpoints:
1. Controller endpoints accept a DTO request body (e.g. `UserRegistrationDto`, `LoginRequestDto`).
2. Mappers (MapStruct) translate DTOs to JPA domain models.
3. Services process the models and repositories persist them.
4. Services return DTOs back to controllers for client output.

MapStruct mapping declaration example:
```java
@Mapper(componentModel = "spring")
public interface VolunteerRoleMapper {
    VolunteerRoleDto toDto(VolunteerRole volunteerRole);
    VolunteerRole toEntity(VolunteerRoleDto volunteerRoleDto);
}
```

## Exception and Error Handling
- Intercepted globally by `GlobalExceptionHandler` in `controller/` or `advice/` package.
- Formats exceptions into custom error details DTOs for the client.

## WebSockets
- Managed by `WebSocketConfig.java` mapped to `/ws/**`.
- Messages pass through `@MessageMapping("/chat")` in `ChatController` and broadcast messages to client subscription topics (`@SendTo("/topic/messages")`).
- Messaging handlers receive `Message` payloads and return escaped `OutputMessage` entities.

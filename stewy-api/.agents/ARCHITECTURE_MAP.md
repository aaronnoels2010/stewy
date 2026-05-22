# Architecture Map

## Directory Layout
```
stewy-api/
├── build.gradle          # Dependency management & build tasks
├── settings.gradle       # Gradle project settings
└── src/
    ├── main/
    │   ├── java/be/an/stewy/stewyapi/
    │   │   ├── advice/          # Error responses & exception handling interceptors
    │   │   ├── controller/      # REST API endpoints (Admin, Auth, Game, Volunteer, etc.)
    │   │   ├── domain/          # JPA entities (Club, Game, User, Volunteer, VolunteerGame)
    │   │   ├── exception/       # Custom Exception types
    │   │   ├── mapper/          # MapStruct Mapper interfaces (DTO <-> Domain conversions)
    │   │   ├── repository/      # Repository interfaces (DAOs)
    │   │   │   └── Impl/        # Custom JPA implementations using EntityManager
    │   │   ├── security/        # Spring Security core configs, filter chains, & JWT parsing
    │   │   ├── service/         # Business logic layer interfaces
    │   │   │   └── Impl/        # Concrete service implementations containing validation & rules
    │   │   ├── utils/           # Utility classes (Date conversions, cryptographic algorithms)
    │   │   ├── validator/       # Data validation services
    │   │   ├── WebSecurityConfig.java  # Main spring security config (endpoints, CORS, filter order)
    │   │   └── WebSocketConfig.java    # WebSocket message broker and endpoints mapping
    │   └── resources/
    │       └── application.properties  # Database credentials, JPA settings, JWT secrets
    └── test/
        └── java/be/an/stewy/stewyapi/
            ├── security/        # Security-related tests (JwtTokenProviderTest)
            └── service/         # Service layer business logic tests (UserServiceTest)
```

## Where to Add New Features
1. **Database Schema & Domain Entity**: Add standard JPA mapping class to `domain/`.
2. **Repository**: Declare generic operations or query signatures in an interface inside `repository/`, then write the implementation class under `repository/Impl/` utilizing the `EntityManager`.
3. **Data Mapping (DTOs)**: Define a request/response DTO class and update/add mappers inside `mapper/`.
4. **Business Logic**: Declare interfaces inside `service/`, implement business logic & validations inside `service/Impl/`.
5. **API Endpoints**: Register controller methods in `controller/` annotated with `@RestController` or standard Spring controllers.
6. **Security & Routes**: Adjust permissions in `WebSecurityConfig.java` if the endpoint is public or restricted to specific roles.

# Common Mistakes and Gotchas

## 1. Using Spring Data JPA Repository Interfaces
- **Mistake**: Creating repository interfaces that extend `JpaRepository` or `CrudRepository`.
- **Correct Path**: Write a standard Java interface under `repository/`, then write a concrete implementation class in `repository/Impl/` that injects `EntityManager` and uses standard JPA JPQL/Criteria queries (or the inherited `GenericRepositoryImpl` base class for generic entities).

## 2. Missing `@Transactional` on Repository Write/Update Actions
- **Mistake**: Forgetting to add `@Transactional` to custom repository implementation methods that execute updates or inserts, or using default class-level read-only transactions for write operations.
- **Correct Path**: Custom Repository implementations should be annotated with `@Transactional(readOnly = true, rollbackFor = Exception.class)` at the class level, but any save/update/delete methods must override this with a `@Transactional` annotation (or write-enabled settings) to enable transactions.

## 3. MapStruct Mapper Compile Errors
- **Mistake**: Adding a new mapper or DTO without rebuilding, causing Lombok or MapStruct generated code to not be found.
- **Correct Path**: Ensure you run `./gradlew compileJava` after adding/editing DTO classes or mapper interfaces. Make sure `@Mapper(componentModel = "spring")` is annotated on the mapper interface, and verify dependencies in `build.gradle` for MapStruct processor.

## 4. WebSocket Path Mapping and CORS
- **Mistake**: Incorrectly specifying WebSocket endpoints or trying to secure them without checking CORS origins allowed in `WebSecurityConfig`.
- **Correct Path**: WebSocket endpoints are mapped to `/ws/**` in `WebSocketConfig`. In `WebSecurityConfig`, CORS configuration must explicitly allow Metro/React Native origins (`http://localhost:8081`, `http://localhost:19006`) and WebSocket requests must bypass JWT authentication in the filter chain configuration.

## 5. Lombok `@Builder` Traps on JPA Entities
- **Mistake**: Annotating an Entity class with `@Builder` without providing a manual no-args constructor or `@NoArgsConstructor` along with `@AllArgsConstructor`. This causes Hibernate compilation or runtime instantiation issues.
- **Correct Path**: Ensure that entity classes have `@NoArgsConstructor`, `@AllArgsConstructor`, and `@Builder`. Since Hibernate requires a no-args constructor, keep `public User() {}` or `@NoArgsConstructor` explicit.

## 6. Timestamp Fields Not Updating
- **Mistake**: Forgetting to set or update `createdAt` / `updatedAt` fields when saving/updating.
- **Correct Path**: Entities should have `@PrePersist` and `@PreUpdate` lifecycle hook methods to automatically keep these fields updated.

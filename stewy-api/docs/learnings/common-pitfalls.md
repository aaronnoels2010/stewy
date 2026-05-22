# Common Pitfalls

## 1. Lombok `@Builder` Annotation Issues
- **Issue**: Utilizing `@Builder` on a class overrides the default no-args constructor, causing issues with JPA Entity initialization.
- **Solution**: Explicitly add `@NoArgsConstructor` and `@AllArgsConstructor` alongside `@Builder` on JPA entities.

## 2. JPA LazyInitializationException
- **Issue**: Attempting to access lazy-loaded relationships (e.g. `User.getVolunteer()`) outside a `@Transactional` context or after the `EntityManager` session has closed.
- **Solution**: Either access the relationship inside a transaction boundary (such as the Service layer) or initialize it explicitly using JPQL fetch joins in the repository queries (e.g. `select v from Volunteer v left join fetch v.user`).

## 3. Spring Security Filter Chain Ordering
- **Issue**: Bypassing JWT checks on authenticated endpoints or failing to permit public routes like `/auth/**` or WebSocket endpoints `/ws/**`.
- **Solution**: Verify the configuration in `WebSecurityConfig.java`. Public endpoints must be explicitly matched in `.authorizeHttpRequests()` with `.permitAll()`, and `JwtAuthenticationFilter` must be added before `UsernamePasswordAuthenticationFilter`.

## 4. MapStruct Implementation Generation
- **Issue**: Changing fields in DTOs or domain classes without running clean build, leading to class structure mismatches in generated mappers.
- **Solution**: Run `./gradlew clean compileJava` to regenerate classes under `build/generated/`.

## 5. Transaction Rollback Exceptions
- **Issue**: Checked exceptions thrown within a `@Transactional` boundary do not trigger rollback by default.
- **Solution**: Explicitly specify the rollback settings on repository implementations or services: `@Transactional(rollbackFor = Exception.class)`.

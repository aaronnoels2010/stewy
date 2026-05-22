# Database Patterns

This document details database setup, custom JPA repository patterns, and transaction structures in Stewy API.

## Database Technology Stack
- **Database**: PostgreSQL (port 5432, database name `stewy`).
- **JPA Provider**: Hibernate (configured through `spring-boot-starter-data-jpa`).
- **Schema Management**: DDL auto is set to `update` for local development.

## Repository Pattern: Custom DAOs
Rather than using Spring Data JPA interfaces (e.g. `JpaRepository`), this codebase implements a custom DAO pattern:
1. **Interface definition** under `repository/` (e.g. `UserRepository`).
2. **Generic Base Class** `GenericRepositoryImpl<T>` providing common CRUD operations (`saveOrUpdate`, `totalCount`, `findById`, `findAll` with pagination, etc.).
3. **Concrete Implementation** under `repository/Impl/` extending `GenericRepositoryImpl<T>` or implementing the Repository interface directly.

Example concrete repository class:
```java
@Repository
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class ClubRepositoryImpl extends GenericRepositoryImpl<Club> implements ClubRepository {
    
    public ClubRepositoryImpl(EntityManager entityManager) {
        super(entityManager);
    }

    @Override
    @Transactional
    public void saveClub(Club club) {
        saveOrUpdate(club);
    }
    
    // ... custom JPQL queries
}
```

## Transaction Isolation & Strategy
- Class-level annotations: `@Transactional(readOnly = true, rollbackFor = Exception.class)` protects all read operations and ensures they run inside a transaction.
- Method-level override: `@Transactional` triggers a write transaction for write/insert/update operations.

## Pagination Pattern
Queries use custom JPQL offset-based pagination:
```java
@Override
public List<T> findAll(Pagination pagination, Class<T> clazz) {
    var pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(), pagination.paginationToSort());

    return getEntityManager().createQuery("SELECT e FROM " + clazz.getSimpleName() + " e", clazz)
            .setFirstResult((int) pageRequest.getOffset())
            .setMaxResults(pageRequest.getPageSize())
            .getResultList();
}
```
Ensure all custom lists fetch entities matching the pagination query size.

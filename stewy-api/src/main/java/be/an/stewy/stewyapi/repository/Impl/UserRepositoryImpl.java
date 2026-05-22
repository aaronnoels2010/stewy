package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.domain.User;
import be.an.stewy.stewyapi.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Override
    @Transactional
    public void update(User user) {
        entityManager.merge(user);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return entityManager.createQuery("select u from User u where u.email = :email", User.class)
                .setParameter("email", email)
                .getResultStream()
                .findFirst();
    }

    @Override
    public List<User> findByStatus(UserStatus status) {
        return entityManager.createQuery("select u from User u where u.status = :status", User.class)
                .setParameter("status", status)
                .getResultList();
    }

    @Override
    public long countByEmail(String email) {
        return entityManager.createQuery("select count(u) from User u where u.email = :email", Long.class)
                .setParameter("email", email)
                .getSingleResult();
    }
}

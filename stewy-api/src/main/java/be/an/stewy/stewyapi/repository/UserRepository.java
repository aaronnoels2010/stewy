package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.UserStatus;
import be.an.stewy.stewyapi.domain.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    void save(User user);
    void update(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    List<User> findByStatus(UserStatus status);
    long countByEmail(String email);
}

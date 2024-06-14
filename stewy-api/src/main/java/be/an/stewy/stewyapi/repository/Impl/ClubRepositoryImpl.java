package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.repository.ClubRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Transactional(readOnly = true)
public class ClubRepositoryImpl implements ClubRepository {
    private final EntityManager entityManager;

    public ClubRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void saveClub(Club club) {
        entityManager.persist(club);
    }

    @Override
    public Club findByClubId(UUID id) {
        return entityManager.createQuery("select c from Club c where c.id = :clubId", Club.class)
                .setParameter("clubId",id)
                .getResultStream()
                .findFirst().orElse(null);

    }

    @Override
    public List<Club> findAllClubs(Sort sort, PageRequest pageable) {
        if (pageable.getSort().stream().anyMatch(s -> s.getProperty().equalsIgnoreCase("name"))){
            sort = Sort.by(Sort.Direction.ASC,"lastName").and(Sort.by(Sort.Direction.ASC, "firstName"));
            pageable = PageRequest.of(0,20);
        }
        String baseQuery = "select c from Club c order by ";
        String orderQuery =  sort.get().map(s -> s.getProperty() + " " +  s.getDirection()).collect(Collectors.joining(","));

        String query = baseQuery + orderQuery + " ";

        return entityManager.createQuery(query, Club.class)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
    }

    @Override
    public Object totalCountVolunteers() {
        return null;
    }
}

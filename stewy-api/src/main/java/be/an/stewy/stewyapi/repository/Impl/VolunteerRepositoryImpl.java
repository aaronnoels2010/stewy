package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class VolunteerRepositoryImpl implements VolunteerRepository {
    private final EntityManager entityManager;

    public VolunteerRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void saveVolunteer(Volunteer volunteer) {
        entityManager.persist(volunteer);

    }

    @Override
    public Volunteer findByVolunteerId(UUID id) {
        if (id == null) return null;
        return entityManager.find(Volunteer.class, id);
    }

    @Override
    public Volunteer findByUserId(UUID userId) {
        return entityManager.createQuery("select v from Volunteer v where v.user.id = :userId", Volunteer.class)
                .setParameter("userId", userId)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Override
    @Transactional
    public void deleteVolunteer(Volunteer newVolunteer) {
        entityManager.remove(entityManager.merge(newVolunteer));
    }



    @Override
    public List<Volunteer> findAllVolunteers(Sort sort, Pageable pageable) {
        if (pageable.getSort().stream().anyMatch(s -> s.getProperty().equalsIgnoreCase("name"))){
            sort = Sort.by(Sort.Direction.ASC,"lastName").and(Sort.by(Sort.Direction.ASC, "firstName"));
            pageable = PageRequest.of(0,20);
        }
        String baseQuery = "select v from Volunteer v order by ";
        String orderQuery =  sort.get().map(s -> s.getProperty() + " " +  s.getDirection()).collect(Collectors.joining(","));

        String query = baseQuery + orderQuery + " ";

        return entityManager.createQuery(query, Volunteer.class)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
    }

    @Override
    @Transactional
    public void deleteAllVolunteers(List<Volunteer> volunteers) {
        volunteers.forEach(this::deleteVolunteer);
    }

    @Override
    public long totalCountVolunteers() {
        return (long) entityManager.createQuery("select count(*) from Volunteer v").getSingleResult();
    }

    @Override
    @Transactional
    public void update(Volunteer volunteer1) {
        entityManager.merge(volunteer1);
    }

    @Override
    public void assignVolunteerToGame(UUID volunteerId, UUID gameId) {

    }

    @Override
    public List<Volunteer> findByClubIdAndClubStatus(UUID clubId, String clubStatus) {
        return entityManager.createQuery(
                "select v from Volunteer v where v.club.id = :clubId and v.clubStatus = :status", Volunteer.class)
                .setParameter("clubId", clubId)
                .setParameter("status", Enum.valueOf(be.an.stewy.stewyapi.ClubStatus.class, clubStatus))
                .getResultList();
    }

    @Override
    public List<Volunteer> findByClubId(UUID clubId) {
        return entityManager.createQuery(
                "select v from Volunteer v where v.club.id = :clubId", Volunteer.class)
                .setParameter("clubId", clubId)
                .getResultList();
    }

    @Override
    public List<Volunteer> findByProfileStatus(String profileStatus) {
        return entityManager.createQuery("select v from Volunteer v where v.profileStatus = :status", Volunteer.class)
                .setParameter("status", Enum.valueOf(be.an.stewy.stewyapi.ProfileStatus.class, profileStatus))
                .getResultList();
    }
}

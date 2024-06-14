package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.domain.VolunteerGame;
import be.an.stewy.stewyapi.repository.VolunteerGameRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class VolunteerGameRepositoryImpl extends GenericRepositoryImpl<VolunteerGame> implements VolunteerGameRepository {


    protected VolunteerGameRepositoryImpl(EntityManager entityManager) {
        super(entityManager);
    }

    @Override
    public List<VolunteerGame> findGamesWithParticipationStatus(UUID volunteerId) {
        return getEntityManager().createQuery("select vg from VolunteerGame vg where vg.volunteerId = :volunteerId ",VolunteerGame.class)
                .setParameter("volunteerId", volunteerId)
                .getResultList();
    }

    @Override
    public void assignVolunteerToGame(VolunteerGame volunteerGame) {
        super.saveOrUpdate(volunteerGame);
    }
}

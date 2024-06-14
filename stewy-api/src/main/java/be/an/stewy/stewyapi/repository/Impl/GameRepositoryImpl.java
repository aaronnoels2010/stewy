package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.GameStatus;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Game;
import be.an.stewy.stewyapi.repository.GameRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
@Repository
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class GameRepositoryImpl extends GenericRepositoryImpl<Game> implements GameRepository {
    protected GameRepositoryImpl(EntityManager entityManager) {
        super(entityManager);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveGame(Game game) {
        super.saveOrUpdate(game);
    }

    @Override
    public Game getGameById(UUID id) {
        return super.findById(id, Game.class);
    }

    @Override
    public List<Game> getAllGames(Pagination pagination) {
        return super.findAll(pagination, Game.class);
    }

    @Override
    public List<Game> getAllGames(boolean allValues) {
        return super.findAll(allValues, Game.class);
    }

    @Override
    public long totalCountGames() {
        return super.totalCount(Game.class);
    }

    @Override
    public List<Game> getGamesByClub(Club club) {
        return super.getEntityManager().createQuery("select g from Game g where g.homeTeam = :club or g.awayTeam = :club ", Game.class)
                .setParameter("club", club).getResultList();
    }

    @Override
    public List<Game> findAllGamesByStatus(List<String> statussen) {
        return super.findByWhereClause(Game.class, "status", statussen);

    }


    @Override
    public List<Game> findByWhereClause(Class<Game> clazz, String parm, List<String> args) {
        return List.of();
    }
}

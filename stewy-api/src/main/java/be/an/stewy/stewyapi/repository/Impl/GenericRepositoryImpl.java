package be.an.stewy.stewyapi.repository.Impl;

import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.repository.GenericRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public abstract class GenericRepositoryImpl<T> implements GenericRepository<T> {
    private final EntityManager entityManager;
    private final static String BASEQUERY = "SELECT e FROM %s e";

    protected GenericRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public EntityManager getEntityManager() {
        return entityManager;
    }

    @Override
    public void saveOrUpdate(T entity) {
        entityManager.merge(entity);
    }

    @Override
    public long totalCount(Class<T> clazz) {
        return (long) entityManager.createQuery(String.format("select count(*) from %s e",clazz.getSimpleName())).getFirstResult();

    }

    @Override
    public T findById(UUID id,Class<T> clazz) {
        String query = BASEQUERY + " where e.id = :id";

        return entityManager.createQuery(String.format(query,clazz.getSimpleName()), clazz)
                .setParameter("id",id)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<T> findAll(Pagination pagination, Class<T> clazz) {
        var pageRequest = PageRequest.of(pagination.getPageNo(), pagination.getPageSize(),pagination.paginationToSort());

        return entityManager.createQuery(String.format(BASEQUERY,clazz.getSimpleName()),clazz)
                .setFirstResult((int) pageRequest.getOffset())
                .setMaxResults(pageRequest.getPageSize())
                .getResultList();
    }

    @Override
    public List<T> findAll(boolean allValues, Class<T> clazz) {
        Pagination pagination = new Pagination();
        if (allValues) {
            pagination.setPageNo(0);
            pagination.setPageSize(Integer.MAX_VALUE);
            pagination.setSortBy("id");
        } else {
            pagination.setPageNo(0);
            pagination.setPageSize(10);
            pagination.setSortBy("id");
        }

        return findAll(pagination, clazz);
    }

    @Override
    public List<T> findByWhereClause(Class<T> clazz, String parm, List<String> args) {
        String whereClause = " WHERE %s IN :args";
        String query = String.format(BASEQUERY + whereClause, clazz.getSimpleName(), parm);

        return entityManager.createQuery(query, clazz)
                .setParameter("args", args)
                .getResultList();
    }
}

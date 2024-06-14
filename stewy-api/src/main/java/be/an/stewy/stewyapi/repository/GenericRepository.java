package be.an.stewy.stewyapi.repository;

import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public interface GenericRepository<T> {
    void saveOrUpdate(T entity);
    long totalCount(Class<T> clazz);
    T findById(UUID id,Class<T> clazz);
    List<T> findAll(Pagination pagination, Class<T> clazz);
    List<T> findAll(boolean allValues, Class<T> clazz);
    List<T> findByWhereClause(Class<T> clazz,String parm,List<String> args);


}

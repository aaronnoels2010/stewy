package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ClubRegistrationDto;
import be.an.stewy.stewyapi.controller.Pagination;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.mapper.ClubDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface GenericService<T> {
    void save(T entity);
    Map<String, Object> clubsOverview(Pagination pagination);
    T findById(UUID id);
}

package be.an.stewy.stewyapi.controller;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

@Getter
@Setter
public class Pagination {
    private int pageNo = 0;
    private int pageSize = 10;
    private String direction = "ASC";
    private String sortBy = "id";

    public Sort paginationToSort(){
        return Sort.by(Sort.Direction.valueOf(direction.toUpperCase()),sortBy);
    }
}

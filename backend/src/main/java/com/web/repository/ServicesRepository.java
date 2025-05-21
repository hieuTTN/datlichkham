package com.web.repository;

import com.web.entity.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServicesRepository extends JpaRepository<Services, Long> {

    @Query("select s from Services s where s.name like ?1")
    Page<Services> findByParam(String search, Pageable page);
}

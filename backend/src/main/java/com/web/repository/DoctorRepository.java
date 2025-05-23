package com.web.repository;

import com.web.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT d FROM Doctor d WHERE " +
            "(?1 IS NULL OR d.specialty.id = ?1) AND " +
            "(?2 IS NULL OR d.center.id = ?2)")
    Page<Doctor> findByFilter(Long specialtyId, Long centerId, Pageable pageable);

    @Query("select d from Doctor d where d.position is not null and d.position <> ''")
    List<Doctor> haveCD();

    @Query("select d from Doctor d where d.center.id = ?1 and d.specialty.id = ?2")
    List<Doctor> findByTTAndCK(Long centerId, Long specialtyId);
}

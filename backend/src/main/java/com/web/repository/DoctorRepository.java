package com.web.repository;

import com.web.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT d FROM Doctor d WHERE " +
            "(?1 IS NULL OR d.specialty.id = ?1) AND " +
            "(?2 IS NULL OR d.center.id = ?2)")
    Page<Doctor> findByFilter(Long specialtyId, Long centerId, Pageable pageable);
}

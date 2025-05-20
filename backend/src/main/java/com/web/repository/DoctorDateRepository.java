package com.web.repository;

import com.web.entity.DoctorDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorDateRepository extends JpaRepository<DoctorDate, Long> {

    @Query("select d from DoctorDate d where d.doctor.id = ?1")
    List<DoctorDate> findByDoctorId(Long doctorId);
}

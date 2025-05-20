package com.web.repository;

import com.web.entity.DoctorTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface DoctorTimeRepository extends JpaRepository<DoctorTime, Long> {

    @Query("select d from DoctorTime d where d.doctorDate.id = ?1")
    List<DoctorTime> findByDoctorDateId(Long doctorDateId);

    @Modifying
    @Transactional
    @Query("delete from DoctorTime p where p.doctorDate.id = ?1")
    void deleteByDoctorDateId(Long doctorDateId);
}

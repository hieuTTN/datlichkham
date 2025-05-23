package com.web.repository;

import com.web.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where b.doctor.id = ?1")
    Page<Booking> findByDoctor(Long id, Pageable pageable);

    @Query(value = "select b.* from booking b where Date(b.created_date) between ?1 and ?2",nativeQuery = true)
    Page<Booking> findByDate(Date start, Date end, Pageable pageable);
}

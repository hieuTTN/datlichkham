package com.web.repository;

import com.web.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where b.doctor.id = ?1")
    Page<Booking> findByDoctor(Long id, Pageable pageable);

    @Query(value = "select b.* from booking b where Date(b.created_date) between ?1 and ?2",nativeQuery = true)
    Page<Booking> findByDate(Date start, Date end, Pageable pageable);

    @Query("select b from Booking b where b.user.id = ?1 ")
    Page<Booking> findByUser(Long id, Pageable pageable);

    @Query(value = "select b.* from booking b where b.user_id = ?1 and Date(b.appointment_date) between ?2 and ?3", nativeQuery = true)
    Page<Booking> findByUserAndDate(Long id, Date from, Date to, Pageable pageable);

    @Query(value = "select b.* from booking b where b.doctor_id = ?1 and Date(b.appointment_date) between ?2 and ?3", nativeQuery = true)
    Page<Booking> findByDoctor(Long id, Date start, Date end, Pageable pageable);

    @Query("select b from Booking b where b.appointmentDate > current_date ")
    List<Booking> findByAppointmentDate(Date valueOf);

    @Query(value = "select sum(b.consultation_fee + b.service_fee) from booking b where " +
            "month(b.created_date) = month(CURRENT_DATE) and year(b.created_date) = year(CURRENT_DATE)", nativeQuery = true)
    Long doanhThuThangNay();

    @Query(value = "select sum(b.consultation_fee + b.service_fee) from booking b where " +
            "date(b.created_date) = CURRENT_DATE ", nativeQuery = true)
    Long doanhThuHomNay();

    @Query(value = "select sum(b.consultation_fee + b.service_fee) from booking b where " +
            "month(b.created_date) = ?1 and year(b.created_date) = ?2", nativeQuery = true)
    Long doanhThuByMonth(int month, int year);
}

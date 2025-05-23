package com.web.repository;

import com.web.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Long> {

    @Query("select b from BookingDetail b where b.booking.id = ?1")
    List<BookingDetail> findByBooking(Long bookingId);

    @Query("select b from BookingDetail b where b.booking.id = ?1 and b.services.id = ?2")
    Optional<BookingDetail> findByBookingAndService(Long bookbingId, Long serviceId);
}

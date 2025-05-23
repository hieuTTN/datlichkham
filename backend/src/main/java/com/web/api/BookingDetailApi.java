package com.web.api;

import com.web.dto.request.BookingDto;
import com.web.dto.request.BookingServiceDto;
import com.web.entity.Booking;
import com.web.entity.BookingDetail;
import com.web.entity.Center;
import com.web.entity.Services;
import com.web.repository.BookingDetailRepository;
import com.web.service.BookingDetailService;
import com.web.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-detail")
@CrossOrigin
public class BookingDetailApi {

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @PostMapping("/doctor/create")
    public ResponseEntity<?> save(@RequestBody BookingServiceDto dto){
        Booking result = bookingDetailService.save(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/doctor/update")
    public ResponseEntity<?> update(@RequestBody BookingDetail bookingDetail){
        BookingDetail result = bookingDetailService.update(bookingDetail);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/doctor/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        bookingDetailService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/all/find-by-booking")
    public ResponseEntity<?> getAll(@RequestParam Long bookingId){
        List<BookingDetail> result = bookingDetailService.findByBooking(bookingId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/find-by-id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        BookingDetail result = bookingDetailRepository.findById(id).get();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

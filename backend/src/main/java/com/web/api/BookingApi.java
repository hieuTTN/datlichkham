package com.web.api;

import com.web.dto.request.BlogRequest;
import com.web.dto.request.BookingDto;
import com.web.dto.response.BlogResponse;
import com.web.entity.Blog;
import com.web.entity.Booking;
import com.web.entity.Doctor;
import com.web.enums.PayStatus;
import com.web.service.BlogService;
import com.web.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin
public class BookingApi {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/user/create")
    public ResponseEntity<?> save(@RequestBody BookingDto bookingDto){
        Booking result = bookingService.create(bookingDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/my-booking")
    public ResponseEntity<?> myBookingDoctor(Pageable pageable,@RequestParam(required = false) Date start,
                                             @RequestParam(required = false) Date end){
        Page<Booking> result = bookingService.myBookingDoctor(start, end, pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> myBookingAdmin(Pageable pageable, @RequestParam(required = false) Date start,
                                             @RequestParam(required = false) Date end){
        Page<Booking> result = bookingService.allBooking(start, end, pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/user/my-booking")
    public ResponseEntity<?> myBookingUser(Pageable pageable, @RequestParam(required = false) Date start,
                                             @RequestParam(required = false) Date end){
        Page<Booking> result = bookingService.allBookingUser(start, end, pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @PostMapping("/admin/update-status")
    public ResponseEntity<?> updateStatuc(@RequestParam Long id,
                                             @RequestParam PayStatus payStatus){
        Booking result = bookingService.updateStatus(id, payStatus);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @PostMapping("/doctor/update-result")
    public ResponseEntity<?> updateResult(@RequestParam Long id,
                                             @RequestBody String conclude){
        Booking result = bookingService.updateResult(id, conclude);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}

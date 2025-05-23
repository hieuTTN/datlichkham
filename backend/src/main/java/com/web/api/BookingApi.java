package com.web.api;

import com.web.dto.request.BlogRequest;
import com.web.dto.request.BookingDto;
import com.web.dto.response.BlogResponse;
import com.web.entity.Booking;
import com.web.service.BlogService;
import com.web.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

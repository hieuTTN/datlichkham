package com.web.api;

import com.web.entity.DoctorDate;
import com.web.entity.DoctorTime;
import com.web.service.DoctorTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/doctor-time")
@CrossOrigin
public class DoctorTimeApi {

    @Autowired
    private DoctorTimeService doctorTimeService;

    @GetMapping("/public/find-by-doctor")
    public ResponseEntity<?> findByDoctor(@RequestParam Long doctorId,@RequestParam Date bookDate){
        List<DoctorTime> result = doctorTimeService.getAvailableDoctorTimes(doctorId, bookDate);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}

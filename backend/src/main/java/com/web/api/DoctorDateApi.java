package com.web.api;

import com.web.dto.response.CategoryDto;
import com.web.dto.response.DoctorScheduleDTO;
import com.web.entity.DoctorDate;
import com.web.entity.DoctorTime;
import com.web.service.DoctorDateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-date")
@CrossOrigin
public class DoctorDateApi {

    @Autowired
    private DoctorDateService doctorDateService;

    @PostMapping("/admin/save")
    public ResponseEntity<String> saveOrUpdateSchedule(@RequestBody DoctorScheduleDTO dto) {
        doctorDateService.saveOrUpdateSchedule(dto);
        return ResponseEntity.ok("Schedule saved or updated successfully");
    }

    @GetMapping("/admin/doctor-schedule")
    public ResponseEntity<DoctorScheduleDTO> getSchedule(@RequestParam Long doctorId) {
        return ResponseEntity.ok(doctorDateService.getScheduleByDoctorId(doctorId));
    }

    @GetMapping("/public/find-by-doctor")
    public ResponseEntity<?> findByDoctor(@RequestParam Long doctorId){
        List<DoctorDate> result = doctorDateService.findByDoctor(doctorId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/doctor/my-doctorDate")
    public ResponseEntity<?> myDoctorDate(){
        List<DoctorDate> result = doctorDateService.findByDoctor();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/admin/date/{id}")
    public ResponseEntity<?> deleteDoctorDate(@PathVariable Long id) {
        doctorDateService.deleteDoctorDate(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/time/{id}")
    public ResponseEntity<?> deleteDoctorTime(@PathVariable Long id) {
        doctorDateService.deleteDoctorTime(id);
        return ResponseEntity.ok().build();
    }
}

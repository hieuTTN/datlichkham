package com.web.api;

import com.web.dto.response.DoctorScheduleDTO;
import com.web.service.DoctorDateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/admin/{doctorId}")
    public ResponseEntity<DoctorScheduleDTO> getSchedule(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorDateService.getScheduleByDoctorId(doctorId));
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

package com.web.api;

import com.web.dto.request.DoctorDTO;
import com.web.dto.response.SpecialtyDto;
import com.web.entity.Doctor;
import com.web.entity.Specialty;
import com.web.service.DoctorService;
import com.web.service.SpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/specialty")
@CrossOrigin
public class SpecialtyApi {

    @Autowired
    private SpecialtyService specialtyService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Specialty specialty){
        Specialty result = specialtyService.save(specialty);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        specialtyService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAllList(Pageable pageable){
        Page<SpecialtyDto> result = specialtyService.findAll(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> getAll(@RequestParam("id") Long id){
        Specialty result = specialtyService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

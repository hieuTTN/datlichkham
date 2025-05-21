package com.web.api;

import com.web.dto.request.DoctorDTO;
import com.web.dto.response.CategoryDto;
import com.web.entity.Category;
import com.web.entity.Center;
import com.web.entity.Doctor;
import com.web.service.CategoryService;
import com.web.service.DoctorService;
import com.web.validate.CategoryValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin
public class DoctorApi {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody DoctorDTO doctorDTO){
        DoctorDTO result = doctorService.saveOrUpdateDoctor(doctorDTO);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        doctorService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAllList(@RequestParam(required = false) Long specialtyId,
                                         @RequestParam(required = false) Long centerId, Pageable pageable){
        Page<Doctor> result = doctorService.doctors(specialtyId, centerId, pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/get-cd")
    public ResponseEntity<?> findAllList(){
        List<Doctor> result = doctorService.doctors();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> getAll(@RequestParam("id") Long id){
        Doctor result = doctorService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

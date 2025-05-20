package com.web.api;

import com.web.dto.response.SpecialtyDto;
import com.web.entity.Services;
import com.web.entity.Specialty;
import com.web.service.ServicesService;
import com.web.service.SpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service")
@CrossOrigin
public class ServicesApi {

    @Autowired
    private ServicesService servicesService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Services services){
        Services result = servicesService.save(services);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        servicesService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAllList(Pageable pageable){
        Page<Services> result = servicesService.findAll(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> getAll(@RequestParam("id") Long id){
        Services result = servicesService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

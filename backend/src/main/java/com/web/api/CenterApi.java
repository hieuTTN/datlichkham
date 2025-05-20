package com.web.api;
import com.web.entity.Category;
import com.web.entity.Center;
import com.web.service.CenterService;
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
@RequestMapping("/api/center")
@CrossOrigin
public class CenterApi {

    @Autowired
    private CenterService centerService;

    @GetMapping("/public/find-all-page")
    public ResponseEntity<?> getAll(Pageable page){
        Page<Center> result = centerService.findAll(page);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-all-list")
    public ResponseEntity<?> getAll(){
        List<Center> result = centerService.findAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Center center){
        Center result = centerService.save(center);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        centerService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> getAll(@RequestParam("id") Long id){
        Center result = centerService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

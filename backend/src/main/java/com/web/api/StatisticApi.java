package com.web.api;

import com.web.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/statistic")
@CrossOrigin("*")
public class StatisticApi {

    @Autowired
    private StatisticService statisticService;

    @GetMapping("/admin/doanh-thu-thang-nay")
    public ResponseEntity<?> doanhThuThangNay(){
        Long result = statisticService.doanhThuThangNay();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/doanh-thu-hom-nay")
    public ResponseEntity<?> doanhThuHomNay(){
        Long result = statisticService.doanhThuHomNay();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/so-luong-user")
    public ResponseEntity<?> soLuongUser(){
        Long result = statisticService.soLuongUser();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/so-luong-bs")
    public ResponseEntity<?> soLuongBds(){
        Long result = statisticService.soLuongBs();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/doanh-thu-nam")
    public ResponseEntity<?> doanhThuNam(@RequestParam("nam") Integer nam){
        List<Long> result = statisticService.doanhThuNam(nam);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}

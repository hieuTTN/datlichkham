package com.web.service;

import com.web.repository.BookingRepository;
import com.web.repository.DoctorRepository;
import com.web.repository.HistoryPayRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Component
public class StatisticService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Long doanhThuThangNay(){
        Long result = bookingRepository.doanhThuThangNay();
        return result;
    }

    public Long doanhThuHomNay(){
        Long result = bookingRepository.doanhThuHomNay();
        return result;
    }

    public Long soLuongUser(){
        Long result = userRepository.countUserByRole(Contains.ROLE_USER);
        return result;
    }

    public Long soLuongBs(){
        Long result = doctorRepository.count();
        return result;
    }

    public List<Long> doanhThuNam(@RequestParam("nam") Integer nam){
        List<Long> list = new ArrayList<>();
        for(int i=1; i< 13; i++){
            Long tong = bookingRepository.doanhThuByMonth(i, nam);
            list.add(tong);
        }
        return list;
    }
}

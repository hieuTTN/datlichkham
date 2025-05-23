package com.web.service;

import com.web.entity.DoctorTime;
import com.web.repository.DoctorDateRepository;
import com.web.repository.DoctorRepository;
import com.web.repository.DoctorTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorTimeService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorDateRepository doctorDateRepository;

    @Autowired
    private DoctorTimeRepository doctorTimeRepository;

    public List<DoctorTime> getAvailableDoctorTimes(Long doctorId, Date bookDate) {
        LocalDate localDate = bookDate.toLocalDate();
        DayOfWeek dayOfWeekEnum = localDate.getDayOfWeek();
        int dayOfWeek = dayOfWeekEnum.getValue(); // Monday = 1, Sunday = 7

        return doctorTimeRepository.findAvailableDoctorTimes(doctorId, dayOfWeek, bookDate);
    }
}

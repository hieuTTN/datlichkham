package com.web.service;

import com.web.dto.request.DoctorDateDTO;
import com.web.dto.request.DoctorTimeDTO;
import com.web.dto.response.DoctorScheduleDTO;
import com.web.entity.Doctor;
import com.web.entity.DoctorDate;
import com.web.entity.DoctorTime;
import com.web.repository.DoctorDateRepository;
import com.web.repository.DoctorRepository;
import com.web.repository.DoctorTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DoctorDateService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorDateRepository doctorDateRepository;

    @Autowired
    private DoctorTimeRepository doctorTimeRepository;

    @Transactional
    public void saveOrUpdateSchedule(DoctorScheduleDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<DoctorDate> existingDates = doctorDateRepository.findByDoctorId(doctor.getId());

        Map<Long, DoctorDate> dateMap = existingDates.stream()
                .collect(Collectors.toMap(DoctorDate::getId, d -> d));

        Set<Long> incomingDateIds = dto.getDates().stream()
                .filter(d -> d.getId() != null)
                .map(DoctorDateDTO::getId)
                .collect(Collectors.toSet());

        // Xóa những ngày bị xóa khỏi lịch
        for (DoctorDate date : existingDates) {
            if (!incomingDateIds.contains(date.getId())) {
                doctorTimeRepository.deleteByDoctorDateId(date.getId());
                doctorDateRepository.deleteById(date.getId());
            }
        }

        for (DoctorDateDTO dateDTO : dto.getDates()) {
            DoctorDate doctorDate;

            if (dateDTO.getId() != null && dateMap.containsKey(dateDTO.getId())) {
                doctorDate = dateMap.get(dateDTO.getId());
                doctorDate.setDayOfWeek(dateDTO.getDayOfWeek());
                doctorDateRepository.save(doctorDate);
            } else {
                doctorDate = new DoctorDate();
                doctorDate.setDayOfWeek(dateDTO.getDayOfWeek());
                doctorDate.setDoctor(doctor);
                doctorDateRepository.save(doctorDate);
            }

            Map<Long, DoctorTime> existingTimeMap = doctorTimeRepository.findByDoctorDateId(doctorDate.getId())
                    .stream().collect(Collectors.toMap(DoctorTime::getId, t -> t));

            Set<Long> incomingTimeIds = dateDTO.getTimes().stream()
                    .filter(t -> t.getId() != null)
                    .map(DoctorTimeDTO::getId)
                    .collect(Collectors.toSet());

            // Xóa các khung giờ không còn nữa
            for (DoctorTime existingTime : existingTimeMap.values()) {
                if (!incomingTimeIds.contains(existingTime.getId())) {
                    doctorTimeRepository.deleteById(existingTime.getId());
                }
            }

            for (DoctorTimeDTO timeDTO : dateDTO.getTimes()) {
                DoctorTime time;

                if (timeDTO.getId() != null && existingTimeMap.containsKey(timeDTO.getId())) {
                    time = existingTimeMap.get(timeDTO.getId());
                    time.setStartTime(Time.valueOf(timeDTO.getStartTime() + ":00"));
                    time.setToTime(Time.valueOf(timeDTO.getToTime() + ":00"));
                } else {
                    time = new DoctorTime();
                    time.setStartTime(Time.valueOf(timeDTO.getStartTime() + ":00"));
                    time.setToTime(Time.valueOf(timeDTO.getToTime() + ":00"));
                    time.setDoctorDate(doctorDate);
                }
                doctorTimeRepository.save(time);
            }
        }
    }

    public DoctorScheduleDTO getScheduleByDoctorId(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<DoctorDate> dates = doctorDateRepository.findByDoctorId(doctorId);
        List<DoctorDateDTO> dateDTOs = new ArrayList<>();

        for (DoctorDate date : dates) {
            List<DoctorTime> times = doctorTimeRepository.findByDoctorDateId(date.getId());

            List<DoctorTimeDTO> timeDTOs = times.stream().map(time -> {
                DoctorTimeDTO dto = new DoctorTimeDTO();
                dto.setId(time.getId());
                dto.setStartTime(time.getStartTime().toString().substring(0,5));
                dto.setToTime(time.getToTime().toString().substring(0,5));
                return dto;
            }).toList();

            DoctorDateDTO dateDTO = new DoctorDateDTO();
            dateDTO.setId(date.getId());
            dateDTO.setDayOfWeek(date.getDayOfWeek());
            dateDTO.setTimes(timeDTOs);

            dateDTOs.add(dateDTO);
        }

        DoctorScheduleDTO scheduleDTO = new DoctorScheduleDTO();
        scheduleDTO.setDoctorId(doctorId);
        scheduleDTO.setDates(dateDTOs);
        scheduleDTO.setDoctor(doctor);

        return scheduleDTO;
    }

    public void deleteDoctorTime(Long id) {
        doctorTimeRepository.deleteById(id);
    }

    public void deleteDoctorDate(Long id) {
        List<DoctorTime> times = doctorTimeRepository.findByDoctorDateId(id);
        doctorTimeRepository.deleteAll(times);
        doctorDateRepository.deleteById(id);
    }

    public List<DoctorDate> findByDoctor(Long doctorId) {
        return doctorDateRepository.findByDoctorId(doctorId);
    }
}

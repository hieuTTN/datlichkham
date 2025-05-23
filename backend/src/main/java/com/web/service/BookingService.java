package com.web.service;

import com.web.dto.request.BookingDto;
import com.web.entity.Booking;
import com.web.entity.Doctor;
import com.web.entity.DoctorTime;
import com.web.enums.PayStatus;
import com.web.exception.MessageException;
import com.web.repository.BookingRepository;
import com.web.repository.DoctorRepository;
import com.web.repository.DoctorTimeRepository;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorTimeRepository doctorTimeRepository;

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private UserUtils userUtils;

    public Booking create(BookingDto dto){
        int paymentStatus = vnPayService.orderReturnByUrl(dto.getUrlVnpay());
        if(paymentStatus != 1){
            throw new MessageException("Thanh toán thất bại");
        }
        Doctor doctor = doctorRepository.findById(dto.getDoctorId()).get();
        DoctorTime doctorTime = doctorTimeRepository.findById(dto.getTimeId()).get();
        Booking booking = new Booking();
        booking.setPhone(dto.getPhone());
        booking.setUser(userUtils.getUserWithAuthority());
        booking.setCreatedDate(LocalDateTime.now());
        booking.setPayStatus(PayStatus.DA_THANH_TOAN_KHAM);
        booking.setAddress(dto.getAddress());
        booking.setAppointmentDate(dto.getAppointmentDate());
        booking.setConsultationFee(doctor.getConsultationFee());
        booking.setDob(dto.getDob());
        booking.setDiseaseDescription(dto.getDiseaseDescription());
        booking.setStartTime(doctorTime.getStartTime());
        booking.setEndTime(doctorTime.getToTime());
        booking.setDoctor(doctor);
        booking.setServiceFee(0D);
        bookingRepository.save(booking);

        return booking;
    }

}

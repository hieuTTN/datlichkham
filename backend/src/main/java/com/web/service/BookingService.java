package com.web.service;

import com.web.dto.request.BookingDto;
import com.web.entity.Booking;
import com.web.entity.Doctor;
import com.web.entity.DoctorTime;
import com.web.entity.User;
import com.web.enums.PayStatus;
import com.web.exception.MessageException;
import com.web.repository.BookingRepository;
import com.web.repository.DoctorRepository;
import com.web.repository.DoctorTimeRepository;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
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

    @Autowired
    private MailService mailService;

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
        booking.setFullName(dto.getFullName());
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
        User user = userUtils.getUserWithAuthority();
        mailService.sendEmail(user.getEmail(), "Đặt lịch khám thành công","Cảm ơn bạn đã đặt lịch khám tại bệnh viện<br>" +
                "Lịch khám của bạn vào ngày "+booking.getAppointmentDate().toString()+", lúc: "+booking.getStartTime().toString()+" đển "+booking.getEndTime().toString(), false, true);
        return booking;
    }

    public Page<Booking> myBookingDoctor(Date start, Date end, Pageable pageable) {
        User user = userUtils.getUserWithAuthority();
        Doctor doctor = doctorRepository.findByUserId(user.getId());

        Page<Booking> page = null;
        if(start == null || end == null){
            page = bookingRepository.findByDoctor(doctor.getId(), pageable);
        }
        else{
            page = bookingRepository.findByDoctor(doctor.getId(), start, end, pageable);
        }
        return page;

    }

    public Page<Booking> allBooking(Date start, Date end, Pageable pageable) {
        Page<Booking> page = null;
        if(start == null || end == null){
            page = bookingRepository.findAll(pageable);
        }
        else{
            page = bookingRepository.findByDate(start, end, pageable);
        }
        return page;
    }

    public Booking updateStatus(Long id, PayStatus payStatus) {
        Booking booking = bookingRepository.findById(id).get();
        booking.setPayStatus(payStatus);
        bookingRepository.save(booking);
        return booking;
    }

    public Page<Booking> allBookingUser(Date start, Date end, Pageable pageable) {
        Page<Booking> page = null;
        User user = userUtils.getUserWithAuthority();
        if(start == null || end == null){
            page = bookingRepository.findByUser(user.getId(),pageable);
        }
        else{
            page = bookingRepository.findByUserAndDate(user.getId(), start, end, pageable);
        }
        return page;
    }

    public Booking updateResult(Long id, String conclude) {
        Booking booking = bookingRepository.findById(id).get();
        booking.setConclude(conclude);
        bookingRepository.save(booking);
        return booking;
    }
}

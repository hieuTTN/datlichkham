package com.web.service;

import com.web.dto.request.BookingServiceDto;
import com.web.entity.Booking;
import com.web.entity.BookingDetail;
import com.web.entity.Services;
import com.web.enums.PayStatus;
import com.web.exception.MessageException;
import com.web.repository.BookingDetailRepository;
import com.web.repository.BookingRepository;
import com.web.repository.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingDetailService {

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    public Booking save(BookingServiceDto dto){
        for(Long id : dto.getServiceId()){
            if (bookingDetailRepository.findByBookingAndService(dto.getBookingId(),id).isPresent()){
                throw new MessageException("Lịch đặt đã thêm dịch vụ khám "+id);
            }
        }
        Booking booking = bookingRepository.findById(dto.getBookingId()).get();
        if(booking.getPayStatus().equals(PayStatus.DA_THANH_TOAN_DU)){
            throw new MessageException("Đã thanh toán đủ, không thể thêm");
        }
        Double total = 0D;
        for(Long id : dto.getServiceId()){
            Services service= servicesRepository.findById(id).get();
            total += service.getPrice();
            BookingDetail bookingDetail = new BookingDetail();
            bookingDetail.setBooking(booking);
            bookingDetail.setServices(service);
            bookingDetail.setPrice(service.getPrice());
            bookingDetailRepository.save(bookingDetail);
        }
        booking.setServiceFee(booking.getServiceFee() + total);
        bookingRepository.save(booking);
        return booking;
    }

    public BookingDetail update(BookingDetail bookingDetail){
        BookingDetail ex = bookingDetailRepository.findById(bookingDetail.getId()).get();
        ex.setResult(bookingDetail.getResult());
        bookingDetailRepository.save(ex);
        return ex;
    }

    public void delete(Long id){
        BookingDetail bookingDetail = bookingDetailRepository.findById(id).get();
        if(bookingDetail.getBooking().getPayStatus().equals(PayStatus.DA_THANH_TOAN_DU)){
            throw new MessageException("Đã thanh toán đủ dịch vụ, không thể xóa");
        }
        bookingDetailRepository.deleteById(id);
        bookingDetail.getBooking().setServiceFee(bookingDetail.getBooking().getServiceFee() - bookingDetail.getPrice());
        bookingRepository.save(bookingDetail.getBooking());
    }

    public List<BookingDetail> findByBooking(Long id){
        return bookingDetailRepository.findByBooking(id);
    }
}

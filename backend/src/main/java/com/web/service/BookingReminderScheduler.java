package com.web.service;

import com.web.entity.Booking;
import com.web.repository.BookingRepository;
import com.web.utils.MailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Component
public class BookingReminderScheduler {

    private final BookingRepository bookingRepository;
    private final MailService mailService;

    public BookingReminderScheduler(BookingRepository bookingRepository, MailService mailService) {
        this.bookingRepository = bookingRepository;
        this.mailService = mailService;
    }

    // Chạy mỗi ngày lúc 8:16 sáng
    // thứ tự: giây - phút - giờ - ngày - tháng - thứ
    @Scheduled(cron = "0 16 8 * * *")
    public void sendAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Booking> bookings = bookingRepository.findByAppointmentDate(Date.valueOf(tomorrow));

        for (Booking booking : bookings) {
            if (booking.getUser() != null && booking.getUser().getEmail() != null) {
                String to = booking.getUser().getEmail();
                String subject = "Nhắc nhở lịch hẹn khám bệnh";
                String content = String.format(
                        "Xin chào bạn,\n\nBạn có lịch hẹn khám bệnh vào ngày %s lúc %s.\nVui lòng đến đúng giờ tại phòng khám.\n\nTrân trọng!",
                        booking.getAppointmentDate().toString(),
                        booking.getStartTime().toString()+" đến "+booking.getEndTime().toString()
                );
                mailService.sendEmail(to, subject, content, false, false);
            }
        }
    }
}
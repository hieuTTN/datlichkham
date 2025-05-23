package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.web.enums.PayStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "booking")
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdDate;

    private Date appointmentDate;

    private Time appointmentTime;

    private Time startTime;

    private Time endTime;

    private String fullName;

    private Date dob;

    private String phone;

    private String address;

    private String diseaseDescription;

    private Double consultationFee;

    private Double serviceFee;

    private String conclude;

    @Enumerated(EnumType.STRING)
    private PayStatus payStatus;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"booking"})
    private List<BookingDetail> bookingDetails;

    @Transient
    private Double tongTien = 0D;

    public Double getTongTien() {
        Double total = 0D;
        for(BookingDetail b : bookingDetails){
            total += b.getPrice();
        }
        return total;
    }
}

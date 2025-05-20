package com.web.entity;

import com.web.enums.PayStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

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
}

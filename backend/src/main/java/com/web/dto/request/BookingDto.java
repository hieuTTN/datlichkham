package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class BookingDto {

    private String fullName;

    private Date appointmentDate;

    private String email;

    private String phone;

    private String gender;

    private Date dob;

    private String address;

    private String diseaseDescription;

    private Long timeId;

    private Long doctorId;

    private String vnpOrderInfo;

    private String urlVnpay;

}

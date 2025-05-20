package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "booking_detail")
@Getter
@Setter
public class BookingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double price;

    private String result;

    @ManyToOne
    private Services services;

    @ManyToOne
    private Booking booking;
}

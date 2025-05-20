package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "doctor_date")
@Getter
@Setter
public class DoctorDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer dayOfWeek;

    @ManyToOne
    private Doctor doctor;
}

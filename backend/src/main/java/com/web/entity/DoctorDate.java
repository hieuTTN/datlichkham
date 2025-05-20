package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

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

    @OneToMany(mappedBy = "doctorDate", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"doctorDate"})
    private List<DoctorTime> doctorTimes;
}

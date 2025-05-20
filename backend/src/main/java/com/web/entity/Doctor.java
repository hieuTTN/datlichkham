package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "doctors")
@Getter
@Setter
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer experienceYears;

    private String fullName;

    private String degree;

    private String gender;

    private String description;

    private Double consultationFee;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToOne
    private Specialty specialty;

    @ManyToOne
    private Center center;
}

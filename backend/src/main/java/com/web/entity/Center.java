package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "centers")
@Getter
@Setter
public class Center {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String centerName;

    private String image;

    private String description;

    private String city;

    private String district;

    private String ward;

    private String street;

    private Timestamp createdDate;
}

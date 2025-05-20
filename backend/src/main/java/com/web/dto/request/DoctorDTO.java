package com.web.dto.request;
import com.web.entity.Doctor;
import com.web.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorDTO {

    private Long id;
    private Integer experienceYears;
    private String fullName;
    private String degree;
    private String gender;
    private String description;
    private Double consultationFee;

    private Long userId;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String avatar;

    private Long specialtyId;
    private Long centerId;
}

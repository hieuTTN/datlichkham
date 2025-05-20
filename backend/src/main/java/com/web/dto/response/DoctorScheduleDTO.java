package com.web.dto.response;

import com.web.dto.request.DoctorDateDTO;
import com.web.entity.Doctor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DoctorScheduleDTO {

    private Long doctorId;

    private Doctor doctor;

    private List<DoctorDateDTO> dates;
}

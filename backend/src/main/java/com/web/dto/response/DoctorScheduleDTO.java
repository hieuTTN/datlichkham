package com.web.dto.response;

import com.web.dto.request.DoctorDateDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DoctorScheduleDTO {

    private Long doctorId;

    private List<DoctorDateDTO> dates;
}

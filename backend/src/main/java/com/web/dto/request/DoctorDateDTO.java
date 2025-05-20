package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DoctorDateDTO {
    private Long id;

    private Integer dayOfWeek;

    private List<DoctorTimeDTO> times;
}

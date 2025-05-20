package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorTimeDTO {

    private Long id;

    private String startTime;

    private String toTime;
}

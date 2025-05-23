package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class BookingServiceDto {

    private List<Long> serviceId = new ArrayList<>();

    private Long bookingId;
}

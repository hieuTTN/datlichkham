package com.web.api;
import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.request.PaymentDto;
import com.web.dto.response.ResponsePayment;
import com.web.exception.MessageException;
import com.web.repository.DoctorRepository;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin
public class VnpayApi {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private DoctorRepository doctorRepository;


    @PostMapping("/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto){
        Double totalAmount = doctorRepository.findById(paymentDto.getDoctorId()).get().getConsultationFee();
        String orderId = String.valueOf(System.currentTimeMillis());
        String vnpayUrl = vnPayService.createOrder(totalAmount.intValue(), orderId, paymentDto.getReturnUrl());
        ResponsePayment responsePayment = new ResponsePayment(vnpayUrl,orderId,null);
        return responsePayment;
    }
}

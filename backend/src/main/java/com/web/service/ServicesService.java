package com.web.service;

import com.web.dto.response.SpecialtyDto;
import com.web.entity.Services;
import com.web.entity.Specialty;
import com.web.exception.MessageException;
import com.web.repository.ServicesRepository;
import com.web.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class ServicesService {

    @Autowired
    private ServicesRepository servicesRepository;

    public Services save(Services services) {
        servicesRepository.save(services);
        return services;
    }

    public Page<Services> findAll(Pageable page){
        return servicesRepository.findAll(page);
    }

    public void delete(Long id) {
        try {
            servicesRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Dịch vụ đã có liên kết, không thể xóa");
        }
    }

    public Services findById(Long id){
        return servicesRepository.findById(id).get();
    }
}

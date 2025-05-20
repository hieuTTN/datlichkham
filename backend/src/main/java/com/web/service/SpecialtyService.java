package com.web.service;

import com.web.dto.response.SpecialtyDto;
import com.web.entity.Center;
import com.web.entity.Specialty;
import com.web.exception.MessageException;
import com.web.repository.CenterRepository;
import com.web.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;

@Component
public class SpecialtyService {

    @Autowired
    private SpecialtyRepository specialtyRepository;

    public Specialty save(Specialty specialty) {
        specialtyRepository.save(specialty);
        return specialty;
    }

    public Page<SpecialtyDto> findAll(Pageable page){
        return specialtyRepository.getAll(page);
    }

    public void delete(Long id) {
        try {
            specialtyRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Chuyên khoa đã có liên kết, không thể xóa");
        }
    }

    public Specialty findById(Long id){
        return specialtyRepository.findById(id).get();
    }

    public List<Specialty> findAll() {
        return specialtyRepository.findAll();
    }
}

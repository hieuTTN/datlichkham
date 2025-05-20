package com.web.service;

import com.web.entity.Category;
import com.web.entity.Center;
import com.web.exception.MessageException;
import com.web.repository.CenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;

@Component
public class CenterService {

    @Autowired
    private CenterRepository centerRepository;

    public Center save(Center center) {
        if(center.getId() == null){
            center.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        }
        else{
            Center ex = centerRepository.findById(center.getId()).get();
            center.setCreatedDate(ex.getCreatedDate());
        }

        centerRepository.save(center);
        return center;
    }

    public Page<Center> findAll(Pageable page){
        return centerRepository.findAll(page);
    }

    public void delete(Long id) {
        try {
            centerRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Center đã có liên kết, không thể xóa");
        }
    }

    public Center findById(Long id){
        return centerRepository.findById(id).get();
    }
}


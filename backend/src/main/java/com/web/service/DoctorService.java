package com.web.service;

import com.web.dto.request.DoctorDTO;
import com.web.entity.*;
import com.web.enums.UserType;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SpecialtyRepository specialtyRepository;

    @Autowired
    private CenterRepository centerRepository;

    @Transactional
    public DoctorDTO saveOrUpdateDoctor(DoctorDTO dto) {
        Doctor doctor = (dto.getId() != null)
                ? doctorRepository.findById(dto.getId()).orElse(new Doctor())
                : new Doctor();

        User user;

        if (dto.getUserId() != null) {
            if(userRepository.findByEmail(dto.getEmail(), dto.getUserId()).isPresent()){
                throw new MessageException("Email đã được sử dụng");
            }
            user = userRepository.findById(dto.getUserId()).orElse(new User());
        }
        else {
            if(userRepository.findByEmail(dto.getEmail()).isPresent()){
                throw new MessageException("Email đã được sử dụng");
            }
            user = new User();
            user.setActived(true);
            user.setCreatedDate(new Date(System.currentTimeMillis()));
            user.setUserType(UserType.EMAIL);
            user.setAuthorities(authorityRepository.findById(Contains.ROLE_DOCTOR).orElse(null));
        }

        // Cập nhật thông tin user
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setFullname(dto.getFullName());
        user.setAvatar(dto.getAvatar());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);

        // Cập nhật thông tin doctor
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setFullName(dto.getFullName());
        doctor.setDegree(dto.getDegree());
        doctor.setGender(dto.getGender());
        doctor.setPosition(dto.getPosition());
        doctor.setDescription(dto.getDescription());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setUser(user);

        if (dto.getSpecialtyId() != null) {
            Optional<Specialty> specialtyOpt = specialtyRepository.findById(dto.getSpecialtyId());
            specialtyOpt.ifPresent(doctor::setSpecialty);
        }

        if (dto.getCenterId() != null) {
            Optional<Center> centerOpt = centerRepository.findById(dto.getCenterId());
            centerOpt.ifPresent(doctor::setCenter);
        }

        doctorRepository.save(doctor);

        // Cập nhật lại DTO để trả về nếu cần
        dto.setId(doctor.getId());
        dto.setUserId(user.getId());

        return dto;
    }

    public void delete(Long categoryId) {
        try {
            doctorRepository.deleteById(categoryId);
        }
        catch (Exception e){
            throw new MessageException("Bác sĩ đã có liên kết, không thể xóa");
        }
    }

    public Page<Doctor> doctors(Long specialtyId, Long centerId, Pageable pageable){
       Page<Doctor> page = doctorRepository.findByFilter(specialtyId, centerId, pageable);
        return page;
    }

    public Doctor findById(Long id) {
        return doctorRepository.findById(id).get();
    }

    public List<Doctor> doctors() {
        return doctorRepository.haveCD();
    }

    public List<Doctor> searchDoctor(Long specialtyId, Long centerId) {
        return doctorRepository.findByTTAndCK(centerId, specialtyId);
    }

    public List<Doctor> searchAllDoctor() {
        return doctorRepository.findAll();
    }
}

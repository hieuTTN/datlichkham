package com.web.repository;

import com.web.dto.response.SpecialtyDto;
import com.web.entity.Specialty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {

    @Query(value = "select  s.id, s.name, s.description, s.image,\n" +
            "(SELECT count(d.id) from doctors d WHERE d.specialty_id = s.id) as numdoctor\n" +
            "from specialty s",nativeQuery = true)
    Page<SpecialtyDto> getAll(Pageable pageable);
}

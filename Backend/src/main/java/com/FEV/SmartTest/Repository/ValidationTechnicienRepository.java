package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.ValidationTechnicien;
import com.FEV.SmartTest.Enum.DecisionValidation;
import com.FEV.SmartTest.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ValidationTechnicienRepository extends JpaRepository<ValidationTechnicien, Long> {

    List<ValidationTechnicien> findByTechnicien_Id(Long id);

    boolean existsByDemandeEssaiId(Long demandeId);

    Optional<ValidationTechnicien> findByDemandeEssaiId(Long demandeId);
    void deleteByDemandeEssaiId(Long demandeEssaiId);
}
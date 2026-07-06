package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.ValidationCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ValidationChargeRepository  extends JpaRepository<ValidationCharge, Long> {
    List<ValidationCharge> findByDemandeEssaiId(Long demandeEssaiId);

    List<ValidationCharge> findByChargeId(Long chargeId);

    boolean existsByDemandeEssaiId(Long demandeId);
    void deleteByDemandeEssaiId(Long demandeEssaiId);
}

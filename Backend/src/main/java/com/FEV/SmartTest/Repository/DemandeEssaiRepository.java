package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Enum.StatutGlobal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface DemandeEssaiRepository extends JpaRepository<DemandeEssai, Long> {
    List<DemandeEssai> findByClient(Client client);
    long countByClient(Client client);
    long countByStatutGlobal(StatutGlobal statutGlobal);
    long countByStatutGlobalAndClient(StatutGlobal statutGlobal ,Client client) ;


    @Query("""
    SELECT MONTH(d.datePlanification), d.statutGlobal, COUNT(d)
    FROM DemandeEssai d
    WHERE YEAR(d.datePlanification) = :year
    AND (:client IS NULL OR d.client = :client)
    GROUP BY MONTH(d.datePlanification), d.statutGlobal
    ORDER BY MONTH(d.datePlanification)
""")
    List<Object[]> countByMonthAndStatutAndClient(
            @Param("year") int year,
            @Param("client") Client client
    );


    @Query("""
        SELECT MONTH(d.datePlanification), d.statutGlobal, COUNT(d)
        FROM DemandeEssai d
        WHERE YEAR(d.datePlanification) = :year
        GROUP BY MONTH(d.datePlanification), d.statutGlobal
        ORDER BY MONTH(d.datePlanification)
    """)
    List<Object[]> countByMonthAndStatut(@Param("year") int year);
    @Query("""
SELECT 
(EXTRACT(WEEK FROM d.datePlanification) - 
 EXTRACT(WEEK FROM DATE_TRUNC('month', d.datePlanification)) + 1),
d.statutGlobal,
COUNT(d)
FROM DemandeEssai d
WHERE EXTRACT(YEAR FROM d.datePlanification) = :year
AND EXTRACT(MONTH FROM d.datePlanification) = :month
AND (:client IS NULL OR d.client = :client)
GROUP BY 1, d.statutGlobal
ORDER BY 1
""")
    List<Object[]> countByWeekAndStatut(
            @Param("year") int year,
            @Param("month") int month,
            @Param("client") Client client
    );

    @Query("""
SELECT 
    u.id,
    u.nom,
    u.prenom,
    v.decision,
    COUNT(v.id)
FROM User u
LEFT JOIN ValidationTechnicien v ON v.technicien.id = u.id
LEFT JOIN DemandeEssai d ON v.demandeEssai.id = d.id
    AND (:client IS NULL OR d.client = :client)
WHERE u.role = com.FEV.SmartTest.Enum.Role.TECHNICIEN_ESSAI
AND (:technicienId IS NULL OR u.id = :technicienId)
AND (v.id IS NULL OR d.id IS NOT NULL)
GROUP BY 
    u.id,
    u.nom,
    u.prenom,
    v.decision
""")
    List<Object[]> countStatutByTechnicienAndClient(
            @Param("client") Client client,
            @Param("technicienId") Long technicienId
    );

    @Query("""
SELECT 
    u.id,
    u.nom,
    u.prenom,
    v.validation,
    COUNT(v.id)
FROM User u
LEFT JOIN ValidationCharge v ON v.charge.id = u.id
LEFT JOIN DemandeEssai d ON v.demandeEssai.id = d.id
    AND (:client IS NULL OR d.client = :client)
WHERE u.role = com.FEV.SmartTest.Enum.Role.CHARGE_ESSAI
AND (v.id IS NULL OR d.id IS NOT NULL)
GROUP BY 
    u.id,
    u.nom,
    u.prenom,
    v.validation
""")
    List<Object[]> countValidationByCharge(@Param("client") Client client);

    @Query("""
SELECT 
    u.id,
    u.nom,
    u.prenom,
    v.validation,
    COUNT(v.id)
FROM User u
LEFT JOIN ValidationCharge v ON v.charge.id = u.id
LEFT JOIN DemandeEssai d ON v.demandeEssai.id = d.id
    AND (:client IS NULL OR d.client = :client)
WHERE u.role = com.FEV.SmartTest.Enum.Role.CHARGE_ESSAI
AND u.id = :chargeId
AND (v.id IS NULL OR d.id IS NOT NULL)
GROUP BY 
    u.id,
    u.nom,
    u.prenom,
    v.validation
""")
    List<Object[]> countValidationByChargeAndUserId(
            @Param("client") Client client,
            @Param("chargeId") Long chargeId
    );

    @Query("""
    SELECT DISTINCT d
    FROM DemandeEssai d
    LEFT JOIN FETCH d.mesures
    WHERE d.id = :id
""")
    Optional<DemandeEssai> findByIdWithMesures(@Param("id") Long id);

    @Query("""
    SELECT DISTINCT d
    FROM DemandeEssai d
    LEFT JOIN FETCH d.mesures
""")
    List<DemandeEssai> findAllWithMesures();

    @Query("""
    SELECT DISTINCT d
    FROM DemandeEssai d
    LEFT JOIN FETCH d.mesures
    WHERE d.client = :client
""")
    List<DemandeEssai> findByClientWithMesures(@Param("client") Client client);
}
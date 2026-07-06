package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.DTO.RapportDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.Rapport;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportRepository extends JpaRepository<Rapport, Long> {
    List<Rapport> findByTitleContainingIgnoreCase(String title);
    List<Rapport> findByClient(Client client);


}

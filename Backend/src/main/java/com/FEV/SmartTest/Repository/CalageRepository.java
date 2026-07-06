package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Calage;
import com.FEV.SmartTest.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalageRepository extends JpaRepository<Calage, Long> {
    List<Calage> findByClient(Client client);
    long countByClient(Client client);

}

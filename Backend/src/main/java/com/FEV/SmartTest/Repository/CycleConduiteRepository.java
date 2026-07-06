package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.CycleConduite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CycleConduiteRepository extends JpaRepository<CycleConduite, Long> {
    List<CycleConduite> findByClient(Client client);
    long countByClient(Client client);
}

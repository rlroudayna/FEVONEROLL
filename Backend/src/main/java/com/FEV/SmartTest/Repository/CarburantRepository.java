package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Carburant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarburantRepository extends JpaRepository<Carburant, Long> {
}

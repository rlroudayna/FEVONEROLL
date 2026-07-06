package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehiculeRepository  extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByClient(Client client);
    long countByClient(Client client);
    Optional<Vehicule> findTopByOrderByIdDesc();
}

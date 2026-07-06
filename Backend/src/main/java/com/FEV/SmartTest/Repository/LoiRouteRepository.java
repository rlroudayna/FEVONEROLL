package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.LoiRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoiRouteRepository extends JpaRepository<LoiRoute, Long> {
    List<LoiRoute> findByClient(Client client);
    long countByClient(Client client);

}

package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.CalageDTO;
import com.FEV.SmartTest.Entity.*;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.CalageRepository;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.LoiRouteRepository;
import com.FEV.SmartTest.Repository.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CalageService {
    private final CalageRepository calageRepository;
    private final CustomUserDetailsService userDetailsService;

    private final VehiculeRepository vehiculeRepository;
    private final LoiRouteRepository loiRouteRepository;
    private final ClientRepository clientRepository;

    public CalageService(
            CalageRepository calageRepository,
            CustomUserDetailsService userDetailsService,
            VehiculeRepository vehiculeRepository,
            LoiRouteRepository loiRouteRepository,
            ClientRepository clientRepository
    ) {
        this.calageRepository = calageRepository;
        this.userDetailsService = userDetailsService;
        this.vehiculeRepository = vehiculeRepository;
        this.loiRouteRepository = loiRouteRepository;
        this.clientRepository = clientRepository;
    }



    // CREATE
    public Calage createCalage(CalageDTO dto) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Calage c = new Calage();

        c.setNom(dto.getNom());
        c.setTemperature(dto.getTemperature());
        c.setModeConduite(dto.getModeConduite());
        c.setA(dto.getA());
        c.setB(dto.getB());
        c.setC(dto.getC());
        c.setDescription(dto.getDescription());

        // CLIENT
        if (currentUser.getRole() == Role.EXTERNE) {

            c.setClient(currentUser.getClient());

        } else if (dto.getClientId() != null) {

            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() ->
                            new RuntimeException("Client introuvable"));

            c.setClient(client);
        }

        // VEHICULE
        if (dto.getVehiculeId() != null) {

            Vehicule vehicule = vehiculeRepository
                    .findById(dto.getVehiculeId())
                    .orElseThrow(() ->
                            new RuntimeException("Vehicule introuvable"));

            c.setVehiculeAssocie(vehicule);
        }

        // LOI ROUTE
        if (dto.getLoiRouteId() != null) {

            LoiRoute loi = loiRouteRepository
                    .findById(dto.getLoiRouteId())
                    .orElseThrow(() ->
                            new RuntimeException("Loi route introuvable"));

            c.setLoiRouteAssocie(loi);
        }

        return calageRepository.save(c);
    }
    // READ ALL
    public List<Calage> getAllCalages() {
        return calageRepository.findAll();
    }

    // UPDATE
    public Calage updateCalage(Long id, CalageDTO dto) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return calageRepository.findById(id).map(c -> {

            c.setNom(dto.getNom());
            c.setTemperature(dto.getTemperature());
            c.setModeConduite(dto.getModeConduite());
            c.setA(dto.getA());
            c.setB(dto.getB());
            c.setC(dto.getC());
            c.setDescription(dto.getDescription());

            // CLIENT
            if (currentUser.getRole() == Role.EXTERNE) {

                c.setClient(currentUser.getClient());

            } else if (dto.getClientId() != null) {

                Client client = clientRepository.findById(dto.getClientId())
                        .orElseThrow(() ->
                                new RuntimeException("Client introuvable"));

                c.setClient(client);
            }

            // VEHICULE
            if (dto.getVehiculeId() != null) {

                Vehicule vehicule = vehiculeRepository
                        .findById(dto.getVehiculeId())
                        .orElseThrow(() ->
                                new RuntimeException("Vehicule introuvable"));

                c.setVehiculeAssocie(vehicule);
            }

            // LOI ROUTE
            if (dto.getLoiRouteId() != null) {

                LoiRoute loi = loiRouteRepository
                        .findById(dto.getLoiRouteId())
                        .orElseThrow(() ->
                                new RuntimeException("Loi route introuvable"));

                c.setLoiRouteAssocie(loi);
            }

            return calageRepository.save(c);

        }).orElseThrow(() ->
                new RuntimeException("Calage non trouvé avec id : " + id));
    }
    // DELETE
    public void deleteCalage(Long id) {

        calageRepository.deleteById(id);
    }
    public long getCalageCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = currentUser.getRole();

        // 👤 EXTERNE → uniquement son client
        if (role == Role.EXTERNE) {
            return calageRepository.countByClient(currentUser.getClient());
        }

        // 👑 ADMIN / CHARGE / TECHNICIEN
        boolean isGlobal =
                role == Role.ADMIN
                        || role == Role.CHARGE_ESSAI
                        || role == Role.TECHNICIEN_ESSAI;

        if (isGlobal) {

            // 🔥 filtre client
            if (clientOpt.isPresent()) {
                return calageRepository.countByClient(clientOpt.get());
            }

            // 🔥 total global
            return calageRepository.count();
        }

        return 0;
    }
    public List<Calage> getAllCalagesClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        // ADMIN + internes FEV → accès global
        if (currentUser.getRole() == Role.ADMIN
                || currentUser.getRole() == Role.CHARGE_ESSAI
                || currentUser.getRole() == Role.TECHNICIEN_ESSAI) {
            return calageRepository.findAll();
        }

        // EXTERNE → filtré par client
        return calageRepository.findByClient(currentUser.getClient());
    }


}

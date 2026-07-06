package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.LoiRouteDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.LoiRoute;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.LoiRouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoiRouteService {
    private final LoiRouteRepository loiRouteRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ClientRepository clientRepository;

    public LoiRouteService(LoiRouteRepository loiRouteRepository, CustomUserDetailsService userDetailsService, ClientRepository clientRepository) {
        this.loiRouteRepository = loiRouteRepository;
        this.userDetailsService = userDetailsService;
        this.clientRepository = clientRepository;
    }

    // Créer une loi de route
    public LoiRoute createLoiRoute(LoiRouteDTO dto) {

        LoiRoute lr = new LoiRoute();

        lr.setNom(dto.getNom());
        lr.setTemperature(dto.getTemperature());
        lr.setNorme(dto.getNorme());
        lr.setInertieKg(dto.getInertieKg());
        lr.setMasseEssaiKg(dto.getMasseEssaiKg());
        lr.setInertieRotativeTNRKg(dto.getInertieRotativeTNRKg());
        lr.setInertieRotativeDeuxTrainsKg(dto.getInertieRotativeDeuxTrainsKg());
        lr.setF0(dto.getF0());
        lr.setF1(dto.getF1());
        lr.setF2(dto.getF2());
        lr.setDescription(dto.getDescription());

        // 🔥 CLIENT FIX
        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            lr.setClient(client);
        }

        return loiRouteRepository.save(lr);
    }

    // Récupérer toutes les lois de route
    public List<LoiRoute> getAllLoisRoute() {
        return loiRouteRepository.findAll();
    }

    // Mettre à jour une loi de route
    public LoiRoute updateLoiRoute(Long id, LoiRouteDTO dto) {

        return loiRouteRepository.findById(id).map(lr -> {

            lr.setNom(dto.getNom());
            lr.setTemperature(dto.getTemperature());
            lr.setNorme(dto.getNorme());
            lr.setInertieKg(dto.getInertieKg());
            lr.setMasseEssaiKg(dto.getMasseEssaiKg());
            lr.setInertieRotativeTNRKg(dto.getInertieRotativeTNRKg());
            lr.setInertieRotativeDeuxTrainsKg(dto.getInertieRotativeDeuxTrainsKg());
            lr.setF0(dto.getF0());
            lr.setF1(dto.getF1());
            lr.setF2(dto.getF2());
            lr.setDescription(dto.getDescription());

            // 🔥 CLIENT FIX IMPORTANT
            if (dto.getClientId() != null) {
                Client client = clientRepository.findById(dto.getClientId())
                        .orElseThrow(() -> new RuntimeException("Client introuvable"));
                lr.setClient(client);
            }

            return loiRouteRepository.save(lr);

        }).orElseThrow(() -> new RuntimeException("Loi de route non trouvée avec id : " + id));
    }
    public void deleteLoiRoute(Long id) {

        loiRouteRepository.deleteById(id);
    }

    public long getLoiRouteCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = currentUser.getRole();

        // 👤 EXTERNE → uniquement son client
        if (role == Role.EXTERNE) {
            return loiRouteRepository.countByClient(currentUser.getClient());
        }

        // 👑 ADMIN / CHARGE / TECHNICIEN
        boolean isGlobalRole =
                role == Role.ADMIN ||
                        role == Role.CHARGE_ESSAI ||
                        role == Role.TECHNICIEN_ESSAI;

        if (isGlobalRole) {

            // 🔥 filtre client
            if (clientOpt.isPresent()) {
                return loiRouteRepository.countByClient(clientOpt.get());
            }

            // 🔥 total global
            return loiRouteRepository.count();
        }

        return 0;
    }

    public List<LoiRoute> getAllLoisRouteClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        // ADMIN + rôles internes FEV → accès total
        if (currentUser.getRole() == Role.ADMIN
                || currentUser.getRole() == Role.CHARGE_ESSAI
                || currentUser.getRole() == Role.TECHNICIEN_ESSAI) {
            return loiRouteRepository.findAll();
        }

        // EXTERNE → filtré par client
        Client client = currentUser.getClient();
        return loiRouteRepository.findByClient(client);
    }
}

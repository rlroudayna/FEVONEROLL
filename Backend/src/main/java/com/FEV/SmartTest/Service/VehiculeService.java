package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.VehiculeRequestDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.Vehicule;
import com.FEV.SmartTest.Enum.*;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.VehiculeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {

    private final VehiculeRepository vehiculeRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ClientRepository clientRepository;

    public VehiculeService(VehiculeRepository vehiculeRepository, CustomUserDetailsService userDetailsService, ClientRepository clientRepository) {
        this.vehiculeRepository = vehiculeRepository;
        this.userDetailsService = userDetailsService;
        this.clientRepository = clientRepository;
    }

    public Vehicule createVehicule(VehiculeRequestDTO dto) {

        Vehicule v = new Vehicule();

        v.setNomAppliImmat(dto.getNomAppliImmat());
        v.setImmatriculation(dto.getImmatriculation());
        v.setMarque(dto.getMarque());
        v.setVin(dto.getVin());
        v.setSite(dto.getSite());
        v.setResponsable(dto.getResponsable());

        v.setMoteur(dto.getMoteur());
        v.setBoiteVitesse(dto.getBoiteVitesse());
        v.setCouleur(dto.getCouleur());
        v.setFamilleVehicule(dto.getFamilleVehicule());

        v.setDimensionsPneus(dto.getDimensionsPneus());
        v.setPressionPneus(dto.getPressionPneus());
        v.setPuissance(dto.getPuissance());
        v.setDensite(dto.getDensite());
        v.setEmpattement(dto.getEmpattement());

        // ENUMS
        v.setCarburant(dto.getCarburant());
        v.setLocalisation(Localisation.valueOf(dto.getLocalisation()));

        if (dto.getMotorisation() != null && !dto.getMotorisation().isBlank()) {
            v.setMotorisation(TypeMotorisation.valueOf(dto.getMotorisation()));
        }

        if (dto.getModeConduite() != null && !dto.getModeConduite().isBlank()) {
            v.setModeConduite(ModeConduite.valueOf(dto.getModeConduite()));
        }

        if (dto.getTypeCatalyseur() != null && !dto.getTypeCatalyseur().isBlank()) {
            v.setTypeCatalyseur(Type_catalyseur.valueOf(dto.getTypeCatalyseur()));
        }

        // 🔥 CLIENT (IMPORTANT)
        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            v.setClient(client);
        }

        v.setIdentificateur(generateIdentificateur());

        return vehiculeRepository.save(v);
    }
    public Vehicule getVehiculeById(Long id) {
        return vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule non trouvé avec id : " + id));
    }

    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    public Vehicule updateVehicule(Long id, VehiculeRequestDTO dto) {

        return vehiculeRepository.findById(id).map(v -> {

            v.setNomAppliImmat(dto.getNomAppliImmat());
            v.setImmatriculation(dto.getImmatriculation());
            v.setMarque(dto.getMarque());
            v.setVin(dto.getVin());
            v.setSite(dto.getSite());
            v.setResponsable(dto.getResponsable());

            v.setMoteur(dto.getMoteur());
            v.setBoiteVitesse(dto.getBoiteVitesse());
            v.setCouleur(dto.getCouleur());
            v.setFamilleVehicule(dto.getFamilleVehicule());

            v.setDimensionsPneus(dto.getDimensionsPneus());
            v.setPressionPneus(dto.getPressionPneus());
            v.setPuissance(dto.getPuissance());
            v.setDensite(dto.getDensite());
            v.setEmpattement(dto.getEmpattement());

            v.setCarburant(dto.getCarburant());

            if (dto.getLocalisation() != null) {
                v.setLocalisation(Localisation.valueOf(dto.getLocalisation()));
            }

            if (dto.getMotorisation() != null) {
                v.setMotorisation(TypeMotorisation.valueOf(dto.getMotorisation()));
            }

            if (dto.getModeConduite() != null) {
                v.setModeConduite(ModeConduite.valueOf(dto.getModeConduite()));
            }

            if (dto.getTypeCatalyseur() != null) {
                v.setTypeCatalyseur(Type_catalyseur.valueOf(dto.getTypeCatalyseur()));
            }

            // 🔥 CLIENT FIX
            if (dto.getClientId() != null) {
                Client client = clientRepository.findById(dto.getClientId())
                        .orElseThrow(() -> new RuntimeException("Client introuvable"));
                v.setClient(client);
            }

            return vehiculeRepository.save(v);

        }).orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
    }

    public void deleteVehicule(Long id) {

        vehiculeRepository.deleteById(id);
    }

    public Vehicule duplicateVehicule(Long id) {

        Vehicule v = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec id : " + id));

        Vehicule duplicate = new Vehicule();

        // ne pas copier id et identificateur
        BeanUtils.copyProperties(v, duplicate, "id", "identificateur");

        // générer un nouvel identificateur
        duplicate.setIdentificateur(generateIdentificateur());

        return vehiculeRepository.save(duplicate);
    }

    public long getVehiculeCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = currentUser.getRole();

        // 👤 EXTERNE → toujours son client uniquement
        if (role == Role.EXTERNE) {
            return vehiculeRepository.countByClient(currentUser.getClient());
        }

        // 👑 ADMIN / CHARGE / TECHNICIEN
        boolean isGlobalRole =
                role == Role.ADMIN ||
                        role == Role.CHARGE_ESSAI ||
                        role == Role.TECHNICIEN_ESSAI;

        if (isGlobalRole) {

            // 🔥 filtre client
            if (clientOpt.isPresent()) {
                return vehiculeRepository.countByClient(clientOpt.get());
            }

            // 🔥 sans filtre → global
            return vehiculeRepository.count();
        }

        // fallback sécurité
        return 0;
    }
    public List<Vehicule> getVehiculesSelonRole() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = currentUser.getRole();

        // ADMIN + CHARGE + TECHNICIEN → accès total
        if (role == Role.ADMIN ||
                role == Role.CHARGE_ESSAI ||
                role == Role.TECHNICIEN_ESSAI) {

            return vehiculeRepository.findAll();
        }

        // EXTERNE → filtré par client
        return vehiculeRepository.findByClient(currentUser.getClient());
    }
    private String generateIdentificateur() {

        Vehicule lastVehicule = vehiculeRepository.findTopByOrderByIdDesc().orElse(null);

        int nextNumber = 1;

        if (lastVehicule != null && lastVehicule.getIdentificateur() != null) {
            String lastId = lastVehicule.getIdentificateur();
            if (lastId.contains("-")) {

                String[] parts = lastId.split("-");

                if (parts.length == 2) {
                    nextNumber = Integer.parseInt(parts[1]) + 1;
                }
            }
        }
        return String.format("AB-%04d", nextNumber);
    }
}
package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.CycleDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.CycleConduite;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.CycleConduiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CycleService {

    private final CycleConduiteRepository cycleConduiteRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ClientRepository clientRepository;

    public CycleService(CycleConduiteRepository cycleConduiteRepository, CustomUserDetailsService userDetailsService, ClientRepository clientRepository) {
        this.cycleConduiteRepository = cycleConduiteRepository;
        this.userDetailsService = userDetailsService;
        this.clientRepository = clientRepository;
    }

    public CycleConduite createCycle(CycleDTO dto, MultipartFile traceFile) throws IOException {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        CycleConduite cycle = new CycleConduite();

        cycle.setNom(dto.getNom());
        cycle.setFamilleTest(dto.getFamilleTest());
        cycle.setDuree(dto.getDuree());
        cycle.setDureeUnit(dto.getDureeUnit());
        cycle.setNombrePhase(dto.getNombrePhase());
        cycle.setNombreStabilises(dto.getNombreStabilises());

        // ✅ CLIENT LOGIC PROPRE
        Client client = null;

        if (currentUser.getRole() == Role.EXTERNE) {
            client = currentUser.getClient();
        } else if (dto.getClientId() != null) {
            client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
        }

        cycle.setClient(client);

        // ❗ sécurité
        if (client == null) {
            throw new RuntimeException("Client obligatoire");
        }

        // FILE
        if (traceFile != null && !traceFile.isEmpty()) {
            String uploadDir = Paths.get("uploads", "traces").toAbsolutePath().toString();

            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String fileName = UUID.randomUUID() + "_" + traceFile.getOriginalFilename();
            String filePath = uploadDir + File.separator + fileName;

            traceFile.transferTo(new File(filePath));


            cycle.setTraceFilePath("traces/" + fileName);
        }

        return cycleConduiteRepository.save(cycle);
    }

    // READ ALL
    public List<CycleConduite> getAllCycles() {
        return cycleConduiteRepository.findAll();
    }

    // UPDATE
    public CycleConduite updateCycle(Long id, CycleDTO dto, MultipartFile traceFile)
            throws IOException {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return cycleConduiteRepository.findById(id).map(cycle -> {

            cycle.setNom(dto.getNom());
            cycle.setFamilleTest(dto.getFamilleTest());
            cycle.setDuree(dto.getDuree());
            cycle.setDureeUnit(dto.getDureeUnit());
            cycle.setNombrePhase(dto.getNombrePhase());
            cycle.setNombreStabilises(dto.getNombreStabilises());

            // ===================== CLIENT FIX =====================
            Client client = cycle.getClient();

            if (dto.getClientId() != null) {
                client = clientRepository.findById(dto.getClientId())
                        .orElseThrow(() -> new RuntimeException("Client introuvable"));
            }

            // EXTERNE = override obligatoire
            if (currentUser.getRole() == Role.EXTERNE) {
                client = currentUser.getClient();
            }

            cycle.setClient(client);
            // ======================================================

            try {
                if (traceFile != null && !traceFile.isEmpty()) {

                    if (cycle.getTraceFilePath() != null) {
                        File oldFile = new File(cycle.getTraceFilePath());
                        if (oldFile.exists()) oldFile.delete();
                    }

                    String uploadDir = Paths.get("uploads", "traces").toAbsolutePath().toString();

                    File directory = new File(uploadDir);
                    if (!directory.exists()) directory.mkdirs();

                    String fileName = UUID.randomUUID() + "_" + traceFile.getOriginalFilename();
                    String filePath = uploadDir + File.separator + fileName;

                    traceFile.transferTo(new File(filePath));

                    cycle.setTraceFilePath("traces/" + fileName);
                }

            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            return cycleConduiteRepository.save(cycle);

        }).orElseThrow(() -> new RuntimeException("Cycle introuvable"));
    }
    // DELETE
    public void deleteCycle(Long id) {

        CycleConduite cycle =
                cycleConduiteRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Cycle introuvable"));

        if (cycle.getTraceFilePath() != null) {

            File file = new File(cycle.getTraceFilePath());

            if (file.exists()) {
                file.delete();
            }
        }

        cycleConduiteRepository.delete(cycle);
    }
    public long getCycleCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = currentUser.getRole();

        // 👤 EXTERNE → uniquement son client
        if (role == Role.EXTERNE) {
            return cycleConduiteRepository.countByClient(currentUser.getClient());
        }

        // 👑 ADMIN / CHARGE / TECHNICIEN
        boolean isGlobal =
                role == Role.ADMIN
                        || role == Role.CHARGE_ESSAI
                        || role == Role.TECHNICIEN_ESSAI;

        if (isGlobal) {


            if (clientOpt.isPresent()) {
                return cycleConduiteRepository.countByClient(clientOpt.get());
            }


            return cycleConduiteRepository.count();
        }

        return 0;
    }


    public List<CycleConduite> getAllCycleClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        // ADMIN + internes FEV → accès global
        if (currentUser.getRole() == Role.ADMIN
                || currentUser.getRole() == Role.CHARGE_ESSAI
                || currentUser.getRole() == Role.TECHNICIEN_ESSAI) {
            return cycleConduiteRepository.findAll();
        }

        // EXTERNE → uniquement son client
        return cycleConduiteRepository.findByClient(currentUser.getClient());
    }

}

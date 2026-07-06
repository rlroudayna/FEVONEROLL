package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.RapportDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.Rapport;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.DemandeEssaiRepository;
import com.FEV.SmartTest.Repository.RapportRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;
    private final CustomUserDetailsService userDetailsService;
    private final DemandeEssaiRepository demandeEssaiRepository;
    private final  ClientRepository clientRepository;
    public RapportService(
            RapportRepository rapportRepository,
            CustomUserDetailsService userDetailsService,
            DemandeEssaiRepository demandeEssaiRepository,
            ClientRepository clientRepository
    ) {
        this.rapportRepository = rapportRepository;
        this.userDetailsService = userDetailsService;
        this.demandeEssaiRepository = demandeEssaiRepository;
        this.clientRepository = clientRepository;
    }
    private final String uploadDir = Paths.get("uploads", "rapports").toAbsolutePath().toString();



    public List<RapportDTO> getAllRapports() {
        return rapportRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public Rapport uploadRapport(
            String title,
            Long demandeId,
            Long clientId,
            String chargeEssai,
            LocalDate dateCreation,
            String commentaire,
            MultipartFile file
    ) throws IOException {

        // 🔥 1. Création dossier upload si inexistant
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 🔥 2. Vérification fichier
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Fichier vide");
        }


        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + File.separator + fileName;
        file.transferTo(new File(filePath));

        // 🔥 4. Récupération relations DB
        DemandeEssai demande = demandeEssaiRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        Rapport rapport = new Rapport();
        rapport.setTitle(title);
        rapport.setClient(client);
        rapport.setChargeEssai(chargeEssai);
        rapport.setCommentaire(commentaire);
        rapport.setFileName(file.getOriginalFilename());
        rapport.setFilePath(filePath);
        rapport.setDateCreation(dateCreation);
        rapport.setDemandeEssai(demande);

        // 🔥 6. Save DB
        return rapportRepository.save(rapport);
    }

    private RapportDTO toDTO(Rapport r) {
        RapportDTO dto = new RapportDTO();

        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setClient(r.getClient().getNom());
        dto.setDateCreation(r.getDateCreation());
        dto.setChargeEssai(r.getChargeEssai());
        dto.setCommentaire(r.getCommentaire());
        if (r.getDemandeEssai() != null) {
            dto.setDemandeId(r.getDemandeEssai().getId());
            dto.setDemandeNomAuto(r.getDemandeEssai().getNomAuto());
        }
        return dto;
    }


    public Rapport updateRapport(
            Long id,
            String title,
            Long demandeId,
            Long clientId,
            String chargeEssai,
            LocalDate dateCreation,
            String commentaire,
            MultipartFile file
    ) throws IOException {

        // 🔥 1. Charger rapport existant
        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport introuvable"));

        // 🔥 2. Charger relations
        DemandeEssai demande = demandeEssaiRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        // 🔥 3. Update champs simples
        rapport.setTitle(title);
        rapport.setDemandeEssai(demande);
        rapport.setClient(client);
        rapport.setChargeEssai(chargeEssai);
        rapport.setCommentaire(commentaire);
        rapport.setDateCreation(dateCreation);

        // 🔥 4. Update fichier (optionnel)
        if (file != null && !file.isEmpty()) {

            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 🔥 (optionnel mais recommandé) supprimer ancien fichier
            if (rapport.getFilePath() != null) {
                File oldFile = new File(rapport.getFilePath());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            rapport.setFileName(file.getOriginalFilename());


            rapport.setFilePath(filePath);
        }


        return rapportRepository.save(rapport);
    }
    public void deleteRapport(Long id) {

        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport introuvable"));

        // 🔥 suppression du fichier physique
        if (rapport.getFilePath() != null) {
            File file = new File(rapport.getFilePath());
            if (file.exists()) {
                file.delete();
            }
        }

        rapportRepository.delete(rapport);
    }
}
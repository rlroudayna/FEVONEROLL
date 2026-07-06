package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.ValidationCharge;
import com.FEV.SmartTest.Enum.DecisionValidation;
import com.FEV.SmartTest.Repository.DemandeEssaiRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import com.FEV.SmartTest.Repository.ValidationChargeRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class ValidationChargeService {
    private final ValidationChargeRepository validationRepo;
    private final DemandeEssaiRepository demandeRepo;
    private final UserRepository userRepo;
    private final DemandeEssaiService demandeEssaiService;

    public ValidationChargeService(
            ValidationChargeRepository validationRepo,
            DemandeEssaiRepository demandeRepo,
            UserRepository userRepo,
            DemandeEssaiService demandeEssaiService
    ) {
        this.validationRepo = validationRepo;
        this.demandeRepo = demandeRepo;
        this.userRepo = userRepo;
        this.demandeEssaiService =demandeEssaiService;
    }
    public ValidationCharge validerDemande(
            Long demandeId,
            ValidationCharge validationCharge,
            MultipartFile fichierINCA,
            MultipartFile fichierBaR,
            MultipartFile fichierChecklist,
            Authentication authentication
    ) throws IOException {

        DemandeEssai demande = demandeRepo.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        if (validationRepo.existsByDemandeEssaiId(demandeId)) {
            throw new IllegalStateException("Cet essai est déjà validé");
        }

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User introuvable"));

        validationCharge.setDemandeEssai(demande);
        validationCharge.setCharge(user);
        validationCharge.setDateValidation(LocalDate.now());

        // FICHIER INCA
        if (fichierINCA != null && !fichierINCA.isEmpty()) {

            String path = uploadFile(fichierINCA, "validation-charge");

            validationCharge.setFichierINCA(
                    fichierINCA.getOriginalFilename()
            );

            validationCharge.setFichierINCAPath(path);
        }

        // FICHIER BaR
        if (fichierBaR != null && !fichierBaR.isEmpty()) {

            String path = uploadFile(fichierBaR, "validation-charge");

            validationCharge.setFichierBaR(
                    fichierBaR.getOriginalFilename()
            );

            validationCharge.setFichierBaRPath(path);
        }

        // CHECKLIST
        if (fichierChecklist != null && !fichierChecklist.isEmpty()) {

            String path = uploadFile(fichierChecklist, "validation-charge");

            validationCharge.setFichierChecklist(
                    fichierChecklist.getOriginalFilename()
            );

            validationCharge.setFichierChecklistPath(path);
        }

        ValidationCharge saved = validationRepo.save(validationCharge);

        demandeEssaiService.mettreAJourStatut(demandeId);

        return saved;
    }
    private String uploadFile(MultipartFile file, String folder) throws IOException {

        String uploadDir = Paths.get("uploads", folder)
                .toAbsolutePath()
                .toString();

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        String filePath = uploadDir + File.separator + fileName;

        file.transferTo(new File(filePath));

        return filePath;
    }
}


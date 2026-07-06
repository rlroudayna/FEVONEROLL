package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.ValidationCharge;
import com.FEV.SmartTest.Service.ValidationChargeService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/validation_charge")
public class ValidationChargeController {
    private final ValidationChargeService validationService;

    public ValidationChargeController(ValidationChargeService validationService) {
        this.validationService = validationService;
    }
    @PostMapping(
            value = "/valider/{demandeId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ValidationCharge validerDemande(

            @PathVariable Long demandeId,

            @RequestPart("validation")
            ValidationCharge validation,

            @RequestPart(value = "fichierINCA", required = false)
            MultipartFile fichierINCA,

            @RequestPart(value = "fichierBaR", required = false)
            MultipartFile fichierBaR,

            @RequestPart(value = "fichierChecklist", required = false)
            MultipartFile fichierChecklist,

            Authentication authentication

    ) throws IOException {

        return validationService.validerDemande(
                demandeId,
                validation,
                fichierINCA,
                fichierBaR,
                fichierChecklist,
                authentication
        );
    }

    @GetMapping("/view")
    public ResponseEntity<Resource> viewFile(@RequestParam String path) throws IOException {

        Path filePath = Paths.get(path);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Fichier introuvable");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath))
                .body(resource);
    }
}




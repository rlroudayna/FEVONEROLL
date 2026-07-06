package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.RapportDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.Rapport;
import com.FEV.SmartTest.Repository.RapportRepository;
import com.FEV.SmartTest.Service.RapportService;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/Rapport")
@CrossOrigin(origins = "http://localhost:5173")
public class RapportController {

    private final RapportService rapportService;
    private final RapportRepository rapportRepository;

    public RapportController(RapportService rapportService,
                             RapportRepository rapportRepository) {
        this.rapportService = rapportService;
        this.rapportRepository = rapportRepository;
    }
    @GetMapping
    public List<RapportDTO> getAllRapports() {
        return rapportService.getAllRapports();
    }

    @PostMapping("/upload")
    public Rapport uploadRapport(
            @RequestParam String title,
            @RequestParam Long demandeId,
            @RequestParam Long clientId,
            @RequestParam String chargeEssai,
            @RequestParam String dateCreation,
            @RequestParam String commentaire,
            @RequestParam MultipartFile file
    ) throws Exception {

        return rapportService.uploadRapport(
                title,
                demandeId,
                clientId,
                chargeEssai,
                LocalDate.parse(dateCreation),
                commentaire,
                file
        );
    }
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws Exception {

        Rapport rapport = rapportRepository.findById(id).orElseThrow();

        Path path = Paths.get(rapport.getFilePath()).normalize();
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = java.nio.file.Files.probeContentType(path);
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + rapport.getFileName() + "\"")
                .body(resource);
    }

    @PutMapping("/update/{id}")
    public Rapport updateRapport(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam Long demandeId,
            @RequestParam Long clientId,
            @RequestParam String chargeEssai,
            @RequestParam String dateCreation,
            @RequestParam String commentaire,
            @RequestParam(required = false) MultipartFile file
    ) throws IOException {

        return rapportService.updateRapport(
                id,
                title,
                demandeId,
                clientId,
                chargeEssai,
                LocalDate.parse(dateCreation),
                commentaire,
                file
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.ok().build();
    }
}
package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.DemandeEssaiRequest;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import com.FEV.SmartTest.Service.CustomUserDetailsService;
import com.FEV.SmartTest.Service.DemandeEssaiService;
import com.FEV.SmartTest.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/demandes-essai")
@CrossOrigin(origins = "http://localhost:5173")

public class DemandeEssaiController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final DemandeEssaiService demandeEssaiService;
    private final ClientRepository clientRepository;
    private final CustomUserDetailsService userDetailsService;

    public DemandeEssaiController(UserService userService, UserRepository userRepository, DemandeEssaiService demandeEssaiService, ClientRepository clientRepository, CustomUserDetailsService userDetailsService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.demandeEssaiService = demandeEssaiService;
        this.clientRepository = clientRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DemandeEssai> createDemande(
            @RequestPart("data") @Valid DemandeEssaiRequest dto,
            @RequestPart(name = "software1",    required = false) MultipartFile software1,
            @RequestPart(name = "calibration1", required = false) MultipartFile calibration1,
            @RequestPart(name = "experiment1",  required = false) MultipartFile experiment1,
            @RequestPart(name = "software2",    required = false) MultipartFile software2,
            @RequestPart(name = "calibration2", required = false) MultipartFile calibration2,
            @RequestPart(name = "software3",    required = false) MultipartFile software3,
            @RequestPart(name = "calibration3", required = false) MultipartFile calibration3
    ) {
        return ResponseEntity.ok(
                demandeEssaiService.create(dto, software1, calibration1,
                        experiment1, software2, calibration2, software3, calibration3)
        );
    }

    @GetMapping
    public ResponseEntity<List<DemandeEssai>> getAllDemandes() {
        return ResponseEntity.ok(demandeEssaiService.getAllDemandeClient());
    }

    // ------------------ READ ONE ------------------


    @GetMapping("/RépartitionEssais")
    public Map<String, Long> getStatistiquesDemandes(
            @RequestParam(required = false) Client client
    ) {
        return demandeEssaiService.countDemandesByStatut(Optional.ofNullable(client));
    }

    @GetMapping("/evolution-12-mois")
    public ResponseEntity<List<Map<String, Object>>> evolution12Mois(
            @RequestParam(required = false) Long clientId
    ) {
        return ResponseEntity.ok(
                demandeEssaiService.evolutionEssais12Mois(clientId)
        );
    }
    @GetMapping("/evolution-semaine")
    public List<Map<String, Object>> evolutionParSemaine(
            @RequestParam int month,
            @RequestParam(required = false) Long clientId
    ) {
        return demandeEssaiService.evolutionEssaisParSemaine(month, clientId);
    }

    @GetMapping("/countTotal")
    public long getTotalDemandes(@RequestParam(required = false) Long clientId) {

        Optional<Client> clientOpt = Optional.ofNullable(clientId)
                .map(id -> clientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Client introuvable")));

        return demandeEssaiService.getTotalDemandes(clientOpt);
    }


    @GetMapping("/stats/technicien-client")
    public ResponseEntity<List<Map<String, Object>>> getStatsParTechnicienEtClient(
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) Long technicienId
    ) {
        try {
            List<Map<String, Object>> stats =
                    demandeEssaiService.statsParTechnicienEtClient(clientId, technicienId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/stats/charge-client")
    public List<Map<String, Object>> getStatsParCharge(
            @RequestParam(required = false) Long clientId
    ) {
        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        final Client clientFilter;
        if (clientId != null) {
            clientFilter = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
        } else {
            clientFilter = null;
        }
        return demandeEssaiService.statsParCharge(user, clientFilter);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DemandeEssai> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeEssaiService.getById(id));
    }

    // ------------------ UPDATE ------------------
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DemandeEssai> updateDemande(

            @PathVariable Long id,

            @RequestPart("data") DemandeEssaiRequest updatedDemande,

            @RequestPart(value = "software1", required = false) MultipartFile software1,
            @RequestPart(value = "calibration1", required = false) MultipartFile calibration1,
            @RequestPart(value = "experiment1", required = false) MultipartFile experiment1,

            @RequestPart(value = "software2", required = false) MultipartFile software2,
            @RequestPart(value = "calibration2", required = false) MultipartFile calibration2,

            @RequestPart(value = "software3", required = false) MultipartFile software3,
            @RequestPart(value = "calibration3", required = false) MultipartFile calibration3
    ) {

        return ResponseEntity.ok(
                demandeEssaiService.updateDemande(
                        id,
                        updatedDemande,
                        software1,
                        calibration1,
                        experiment1,
                        software2,
                        calibration2,
                        software3,
                        calibration3
                )
        );
    }
    // ------------------ DELETE ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeEssaiService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<DemandeEssai> duplicateDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeEssaiService.duplicateDemande(id));
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> previewFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads", "inca").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    // ✅ inline = afficher dans le navigateur, pas télécharger
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}

package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.CalageDTO;
import com.FEV.SmartTest.Entity.Calage;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Service.CalageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calages")
@CrossOrigin(origins = "http://localhost:5173")

public class CalageController {
    private final CalageService calageService;
    private final ClientRepository clientRepository;

    public CalageController(CalageService calageService, ClientRepository clientRepository) {
        this.calageService = calageService;
        this.clientRepository = clientRepository;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Calage> createCalage(@RequestBody CalageDTO calage) {
        Calage created = calageService.createCalage(calage);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Calage>> getAllCalages() {
        return ResponseEntity.ok(calageService.getAllCalagesClient());
    }
    @GetMapping("/count")
    public long getCalageCount(@RequestParam(required = false) Long clientId) {

        Optional<Client> clientOpt = Optional.ofNullable(clientId)
                .map(id -> clientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Client introuvable")));

        return calageService.getCalageCount(clientOpt);
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Calage> getCalageById(@PathVariable Long id) {
        Calage c = calageService.getAllCalages().stream()
                .filter(cal -> cal.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Calage non trouvé avec id : " + id));
        return ResponseEntity.ok(c);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Calage> updateCalage(@PathVariable Long id, @RequestBody CalageDTO updatedCalage) {
        Calage updated = calageService.updateCalage(id, updatedCalage);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalage(@PathVariable Long id) {
        calageService.deleteCalage(id);
        return ResponseEntity.noContent().build();
    }




}

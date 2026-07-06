package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.CycleDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.CycleConduite;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Service.CycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cycles")
@CrossOrigin(origins = "http://localhost:5173")

public class Cycle_conduiteController {
    private final CycleService cycleService;
    private final ClientRepository clientRepository;

    public Cycle_conduiteController(CycleService cycleService, ClientRepository clientRepository) {
        this.cycleService = cycleService;
        this.clientRepository = clientRepository;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> createCycle(
            @RequestPart("cycle") CycleDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        return ResponseEntity.ok(
                cycleService.createCycle(dto, file)
        );
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<CycleConduite>> getAllCycles() {

        return ResponseEntity.ok(cycleService.getAllCycleClient());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<CycleConduite> getCycleById(@PathVariable Long id) {
        CycleConduite cycle = cycleService.getAllCycles().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cycle non trouvé avec id : " + id));
        return ResponseEntity.ok(cycle);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CycleConduite> updateCycle(
            @PathVariable Long id,
            @RequestPart("cycle") CycleDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        return ResponseEntity.ok(
                cycleService.updateCycle(id, dto, file)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCycle(@PathVariable Long id) {
        cycleService.deleteCycle(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/count")
    public long getCycleCount(@RequestParam(required = false) Long clientId) {

        Optional<Client> clientOpt = Optional.ofNullable(clientId)
                .map(id -> clientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Client introuvable")));

        return cycleService.getCycleCount(clientOpt);
    }
}

package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.VehiculeRequestDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.Vehicule;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Service.VehiculeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)

public class VehiculeController {

    private final VehiculeService vehiculeService;
    private final ClientRepository clientRepository;

    public VehiculeController(VehiculeService vehiculeService, ClientRepository clientRepository) {
        this.vehiculeService = vehiculeService;
        this.clientRepository = clientRepository;
    }

    @PostMapping
    public ResponseEntity<Vehicule> createVehicule(@RequestBody VehiculeRequestDTO  vehicule) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehiculeService.createVehicule(vehicule));
    }

    @GetMapping
    public List<Vehicule> getAllVehiculesClient() {
        return vehiculeService.getVehiculesSelonRole();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> getVehiculeById(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculeService.getVehiculeById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Vehicule> updateVehicule(@PathVariable Long id,
                                                   @RequestBody VehiculeRequestDTO vehicule) {
        return ResponseEntity.ok(vehiculeService.updateVehicule(id, vehicule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehicule(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/duplicate/{id}")
    public ResponseEntity<Vehicule> duplicateVehicule(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehiculeService.duplicateVehicule(id));
    }
    @GetMapping("/count")
    public long getVehiculeCount(@RequestParam(required = false) Long clientId) {

        Optional<Client> clientOpt = Optional.ofNullable(clientId)
                .map(id -> clientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Client introuvable")));

        return vehiculeService.getVehiculeCount(clientOpt);
    }
}
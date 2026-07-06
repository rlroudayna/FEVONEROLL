package com.FEV.SmartTest.Controller;


import com.FEV.SmartTest.DTO.LoiRouteDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.LoiRoute;

import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Service.LoiRouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lois-route")
@CrossOrigin(origins = "http://localhost:5173")

   public class LoiRouteController {

    private final LoiRouteService loiRouteService;
    private final ClientRepository clientRepository;

    public LoiRouteController(LoiRouteService loiRouteService, ClientRepository clientRepository) {
        this.loiRouteService = loiRouteService;
        this.clientRepository = clientRepository;
    }

    @PostMapping
        public ResponseEntity<LoiRoute> createLoiRoute(@RequestBody LoiRouteDTO loiRoute) {
            LoiRoute created = loiRouteService.createLoiRoute(loiRoute);
            return ResponseEntity.ok(created);
        }

        @GetMapping
        public ResponseEntity<List<LoiRoute>> getAllLoisRoute() {
            List<LoiRoute> lois = loiRouteService.getAllLoisRouteClient();
            return ResponseEntity.ok(lois);
        }
    @GetMapping("/count")
    public long getLoiRouteCount(@RequestParam(required = false) Long clientId) {

        Optional<Client> clientOpt = Optional.ofNullable(clientId)
                .map(id -> clientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Client introuvable")));

        return loiRouteService.getLoiRouteCount(clientOpt);
    }




    @GetMapping("/{id}")
     public ResponseEntity<LoiRoute> getLoiRouteById(@PathVariable Long id) {
            LoiRoute lr = loiRouteService.getAllLoisRoute().stream()
                    .filter(l -> l.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Loi de route non trouvée avec id : " + id));
            return ResponseEntity.ok(lr);
        }

        @PutMapping("/{id}")
        public ResponseEntity<LoiRoute> updateLoiRoute(@PathVariable Long id, @RequestBody LoiRouteDTO updatedLoiRoute) {
            LoiRoute lr = loiRouteService.updateLoiRoute(id, updatedLoiRoute);
            return ResponseEntity.ok(lr);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteLoiRoute(@PathVariable Long id) {
            loiRouteService.deleteLoiRoute(id);
            return ResponseEntity.noContent().build();
        }






    }
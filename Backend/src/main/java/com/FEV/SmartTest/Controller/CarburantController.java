package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.Carburant;
import com.FEV.SmartTest.Service.CarburantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carburants")
@CrossOrigin(origins = "http://localhost:5173")
public class CarburantController {
    private final CarburantService service;

    public CarburantController(CarburantService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Carburant>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carburant> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Carburant> create(@RequestBody Carburant carburant) {
        return new ResponseEntity<>(service.create(carburant), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carburant> update(
            @PathVariable Long id,
            @RequestBody Carburant carburant) {

        return ResponseEntity.ok(service.update(id, carburant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}

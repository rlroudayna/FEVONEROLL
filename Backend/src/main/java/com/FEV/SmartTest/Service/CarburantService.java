package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.Carburant;
import com.FEV.SmartTest.Repository.CarburantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CarburantService {
    private final CarburantRepository repository;

    public CarburantService(CarburantRepository repository) {
        this.repository = repository;
    }

    public List<Carburant> getAll() {
        return repository.findAll();
    }

    public Carburant getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carburant introuvable avec l'id : " + id));
    }

    public Carburant create(Carburant carburant) {
        return repository.save(carburant);
    }

    public Carburant update(Long id, Carburant carburant) {

        Carburant existing = getById(id);
        existing.setNom(carburant.getNom());
        existing.setDensity(carburant.getDensity());
        existing.setReferenceTemperature(carburant.getReferenceTemperature());
        existing.setComposition(carburant.getComposition());
        existing.setCarbonNumber(carburant.getCarbonNumber());
        existing.setHydrogenNumber(carburant.getHydrogenNumber());
        existing.setOxygenNumber(carburant.getOxygenNumber());
        existing.setNitrogenNumber(carburant.getNitrogenNumber());
        existing.setSulfurNumber(carburant.getSulfurNumber());
        existing.setH2oContent(carburant.getH2oContent());
        existing.setCo2Content(carburant.getCo2Content());
        existing.setEthanolContent(carburant.getEthanolContent());
        existing.setNhv(carburant.getNhv());
        existing.setStatus(carburant.getStatus());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}


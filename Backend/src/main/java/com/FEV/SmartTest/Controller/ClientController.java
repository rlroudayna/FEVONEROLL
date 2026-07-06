package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.ClientDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")

@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientService.create(client);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Client> getAll() {
        return clientService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/actifs")
    public List<Client> getActifs() {
        return clientService.findActifs();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) {
        return clientService.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        return clientService.update(id, client);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }


    @GetMapping("/ClientDTO")
    public List<ClientDTO> getBasicClients() {
        return clientService.findClientSummaries();

    }
    @GetMapping("/actifs/dto")
    public List<ClientDTO> getActiveClientsDTO() {
        return clientService.findActiveClientSummaries();
    }
}

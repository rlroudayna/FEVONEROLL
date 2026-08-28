package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.ClientDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client create(Client client) {
        if (client.getActif() == null) {
            client.setActif(true);
        }        return clientRepository.save(client);
    }
    public List<Client> findAll() {
        return clientRepository.findAll();
    }
    public List<Client> findActifs() {
        return clientRepository.findByActifTrue();

    }
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }
    public Client update(Long id, Client client) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        existing.setNom(client.getNom());
        existing.setPays(client.getPays());
        existing.setVille(client.getVille());
        existing.setContactEmail(client.getContactEmail());
        existing.setActif(client.getActif());

        return clientRepository.save(existing);
    }
    public void delete(Long id) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        clientRepository.delete(existing);
    }
    public List<ClientDTO> findClientSummaries() {
        return clientRepository.findAll()
                .stream()
                .map(c -> {
                    ClientDTO dto = new ClientDTO();
                    dto.setId(c.getId());
                    dto.setNom(c.getNom());
                    return dto;
                })
                .toList();
    }
    public List<ClientDTO> findActiveClientSummaries() {
        return clientRepository.findByActifTrue()
                .stream()
                .map(client -> new ClientDTO(client.getId(), client.getNom()))
                .toList();
    }
}

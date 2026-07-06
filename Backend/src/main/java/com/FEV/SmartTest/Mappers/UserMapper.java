package com.FEV.SmartTest.Mappers;

import com.FEV.SmartTest.DTO.ClientDTO;
import com.FEV.SmartTest.DTO.UserResponseDTO;
import com.FEV.SmartTest.Entity.User;
import org.springframework.stereotype.Component;

@Component

public class UserMapper {
    public UserResponseDTO mapToDto(User user) {

        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        if (user.getClient() != null) {
            ClientDTO clientDTO = new ClientDTO();
            clientDTO.setId(user.getClient().getId());
            clientDTO.setNom(user.getClient().getNom());

            dto.setClient(clientDTO);
        }

        return dto;
    }



}

package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.Role;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private Role role;

    private ClientDTO client;
}

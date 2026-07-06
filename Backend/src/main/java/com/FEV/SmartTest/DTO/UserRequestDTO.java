package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.Role;
import lombok.Data;

@Data
public class UserRequestDTO {

    private String nom;
    private String prenom;
    private String email;
    private Role role;
    private String numeroTelephone;
    private String motDePasse;
    private Long clientId;
}
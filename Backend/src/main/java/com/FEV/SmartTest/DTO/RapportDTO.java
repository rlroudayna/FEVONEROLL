package com.FEV.SmartTest.DTO;

import lombok.Data;

import java.time.LocalDate;
@Data
public class RapportDTO {
    private Long id;
    private String title;
    private Long demandeId;
    private String demandeNomAuto;
    private String client;
    private LocalDate dateCreation;
    private String chargeEssai;
    private String commentaire;
}

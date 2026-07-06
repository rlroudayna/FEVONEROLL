package com.FEV.SmartTest.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
@Entity
@Data
@Table(name = "rapport")

public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    private String chargeEssai;
    private String commentaire;
    private String fileName;
    private String filePath;
    private LocalDate dateCreation;
    @ManyToOne
    @JoinColumn(name = "demande_id")
    @JsonIgnore
    private DemandeEssai demandeEssai;
}

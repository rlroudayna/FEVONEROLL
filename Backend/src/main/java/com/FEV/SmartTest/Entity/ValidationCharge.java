package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.DecisionValidation;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "validation_charge")
public class ValidationCharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fichierINCA;
    private String fichierBaR;
    private String fichierChecklist;

    private String fichierINCAPath;
    private String fichierBaRPath;
    private String fichierChecklistPath;

    @Enumerated(EnumType.STRING)
    private DecisionValidation validation;

    private Boolean oetbRenseigne;
    private String commentaire;

    @ManyToOne
    @JoinColumn(name = "charge_id")
    private User charge;   // relation avec entité User

    @OneToOne
    @JoinColumn(name = "demande_essai_id")
    @JsonBackReference
    private DemandeEssai demandeEssai;

    private LocalDate dateValidation;
}

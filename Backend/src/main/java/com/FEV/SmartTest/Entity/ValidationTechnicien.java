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
@Table(name = "validation_Technicien")
public class ValidationTechnicien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DecisionValidation decision;

    private String commentaire;

    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User technicien;   // relation avec entité User

    @OneToOne
    @JoinColumn(name = "demande_essai_id")
    @JsonBackReference
    private DemandeEssai demandeEssai;

    private LocalDate dateValidation;
}


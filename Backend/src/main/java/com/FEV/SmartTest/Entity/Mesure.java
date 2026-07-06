package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.TypeMesureAux;
import com.FEV.SmartTest.Enum.TypeMusure;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Mesure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeMesureAux type;

    private Integer indice;

    private Integer numero;

    private TypeMusure sousType;

    @ManyToOne
    @JoinColumn(name = "demande_id")
    @JsonIgnore
    private DemandeEssai demande;
}

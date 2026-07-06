package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehicules")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomAppliImmat;

    private String identificateur;
    private String immatriculation;
    private String marque ;
    private String vin;
    private String site;
    private String responsable;

    @Enumerated(EnumType.STRING)
    private Localisation localisation;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Enumerated(EnumType.STRING)
    private TypeMotorisation motorisation;

    private String moteur;
    private String boiteVitesse;

    @Enumerated(EnumType.STRING)
    private TypeCarburant carburant;


    @Enumerated(EnumType.STRING)
    private ModeConduite modeConduite;

    private String dimensionsPneus;
    private Float pressionPneus;
    private Float puissance;
    private Float densite;
    private Float empattement;
    private String couleur;
    private String familleVehicule;

    @Enumerated(EnumType.STRING)
    private Type_catalyseur typeCatalyseur;

}

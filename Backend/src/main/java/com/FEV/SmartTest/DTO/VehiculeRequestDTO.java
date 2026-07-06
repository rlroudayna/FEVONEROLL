package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Enum.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class VehiculeRequestDTO {

    private String nomAppliImmat;

    private String identificateur;
    private String immatriculation;
    private String marque ;
    private String vin;
    private String site;
    private String responsable;
    public Long clientId;
    private String motorisation;
    private String localisation;
    private String moteur;
    private String boiteVitesse;
    private TypeCarburant carburant;
    private String modeConduite;
    private String dimensionsPneus;
    private Float pressionPneus;
    private Float puissance;
    private Float densite;
    private Float empattement;
    private String couleur;
    private String familleVehicule;

    private String typeCatalyseur;

}

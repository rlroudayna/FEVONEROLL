package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.Composition;
import com.FEV.SmartTest.Enum.FuelStatus;
import com.FEV.SmartTest.Enum.TypeCarbone;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

@Data
@Entity
@Table(name = "carburants")
public class Carburant {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private String nom;

private Double density;

private Double referenceTemperature;

@Enumerated(EnumType.STRING)
private Composition composition;

private Double carbonNumber;
private Double hydrogenNumber;
private Double oxygenNumber;
private Double nitrogenNumber;
private Double sulfurNumber;
private Double h2oContent;
private Double co2Content;
private Double ethanolContent;
// Pouvoir calorifique inférieur (J/kg)
private Double nhv;

@Enumerated(EnumType.STRING)
private FuelStatus status;

private String commentaire;

@Enumerated(EnumType.STRING)
private TypeCarbone typeCarbone;
}

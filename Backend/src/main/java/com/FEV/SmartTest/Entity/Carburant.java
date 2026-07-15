package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.Composition;
import com.FEV.SmartTest.Enum.FuelStatus;
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

// Densité (kg/m³)
private Double density;

// Température de référence de la densité (°C)
private Double referenceTemperature;

// Type de composition (MassRatio, MoleFraction, ...)
@Enumerated(EnumType.STRING)
private Composition composition;

// Nombre d'atomes
private Double carbonNumber;

private Double hydrogenNumber;

private Double oxygenNumber;

private Double nitrogenNumber;

private Double sulfurNumber;

// Contenus (%)
private Double h2oContent;

private Double co2Content;

private Double ethanolContent;

// Pouvoir calorifique inférieur (J/kg)
private Double nhv;

@Enumerated(EnumType.STRING)
private FuelStatus status;
}

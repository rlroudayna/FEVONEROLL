package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.ModeConduite;
import com.FEV.SmartTest.Enum.Norme;
import lombok.Data;

@Data
public class LoiRouteDTO {
    private String nom;
    private Float temperature;
    private Long clientId;
    private Norme norme;
    private ModeConduite modeConduite;
    private Float inertieKg;
    private Float masseEssaiKg;
    private Float f0;
    private Float f1;
    private Float f2;
    private String description;
}

package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.Norme;
import lombok.Data;

@Data
public class LoiRouteDTO {
    private String nom;
    private Float temperature;
    private Long clientId;
    private Norme norme;
    private Float inertieKg;
    private Float masseEssaiKg;
    private Float inertieRotativeTNRKg;
    private Float inertieRotativeDeuxTrainsKg;
    private Float f0;
    private Float f1;
    private Float f2;
    private String description;
}

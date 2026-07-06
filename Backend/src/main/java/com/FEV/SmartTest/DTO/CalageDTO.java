package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.ModeConduite;
import lombok.Data;

@Data
public class CalageDTO {
    private Long id;

    private String nom;

    private Long clientId;

    private Float temperature;

    private Long vehiculeId;

    private Long loiRouteId;

    private ModeConduite modeConduite;

    private Double a;
    private Double b;
    private Double c;

    private String description;
}

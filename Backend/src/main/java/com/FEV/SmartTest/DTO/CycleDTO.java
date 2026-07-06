package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.FamilleTest;
import lombok.Data;

@Data
public class CycleDTO {
    private Long id;

    private String nom;

    private Long clientId;

    private FamilleTest familleTest;

    private Integer duree;
    private String dureeUnit;

    private Integer nombrePhase;
    private Integer nombreStabilises;

    private String traceFilePath;
    private String traceFileName;
}


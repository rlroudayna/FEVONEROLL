package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Enum.TypeMesureAux;
import com.FEV.SmartTest.Enum.TypeMusure;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class MesureDTO {

    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeMesureAux type;
    private Integer indice;
    private Integer numero;
    @Enumerated(EnumType.STRING)
    private TypeMusure sousType;
}

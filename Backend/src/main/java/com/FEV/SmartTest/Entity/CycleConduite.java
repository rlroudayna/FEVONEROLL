package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.FamilleTest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cycles_conduite")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CycleConduite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    @Enumerated(EnumType.STRING)
    private FamilleTest familleTest;

    private Integer duree;
    private String dureeUnit;
    private Integer nombrePhase;
    private Integer nombreStabilises;

    private String traceFilePath;
    private String traceFileName;
}

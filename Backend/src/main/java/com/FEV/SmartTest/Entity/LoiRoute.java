package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.Norme;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lois_route")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoiRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private Float temperature;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    @Enumerated(EnumType.STRING)
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

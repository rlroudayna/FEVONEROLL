package com.FEV.SmartTest.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clients")
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;
    private String pays;
    private String ville;
    private Boolean actif = true;

    private String contactEmail;




}

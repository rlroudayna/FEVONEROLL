package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    @Column(unique = true)
    private String  email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private String motDePasse;

    private String numeroTelephone;

    @Column(columnDefinition = "TEXT")
    private String image;

    private String resetToken;
    private LocalDateTime tokenExpiration;
}



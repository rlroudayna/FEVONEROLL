package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "demandes_essai")
public class DemandeEssai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomAuto;

    private Long numeroProjet;

    @Enumerated(EnumType.STRING)
    private StatutGlobal statutGlobal;

    @Enumerated(EnumType.STRING)
    private StatutDemande statutDemande;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;


    @ManyToOne
    @JoinColumn(name = "calage_id")
    private Calage calage;

    @ManyToOne
    @JoinColumn(name = "cycle_id")
    private CycleConduite cycle ;

    @ManyToOne
    @JoinColumn(name = "loi_id")
    private LoiRoute loi;


    @Enumerated(EnumType.STRING)
    private TypeProjet typeProjet;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    private String demandeur;
    private Long technicienId;
    @Enumerated(EnumType.STRING)
    private Banc banc;
    private java.time.LocalDate datePlanification;
    @Enumerated(EnumType.STRING)
    private Shift shift;

    private Boolean besoinMaceration;
    private Float temperatureMaceration;
    private Float temperatureEau;
    private Float hygrometrieEssai;
    private Boolean activationSTT;
    private Float temperatureEssai;

    @Enumerated(EnumType.STRING)
    private ListeGestionBatterie12V gestionBatterie12V;

    private Float socDepart12V;
    private Boolean activationClim;
    private Float temperatureRegulationClim;
    private Boolean chauffageHabitable;

    @Enumerated(EnumType.STRING)
    private TypeEssai typeEssai;
    private Boolean verificationCoastDown;
    private Integer nombreDecelerations;
    private String commentaire;


    private Boolean mesureSAC;
    private Float debitCVsPhase1;
    private Float debitCVsPhase2;
    private Float debitCVsPhase3;
    private Float debitCVsPhase4;
    private Float debitCVsPhase5;
    private Float debitCVsPhase6;
    private Float debitCVsPhase7;
    private Float debitCVsPhase8;
    private Float debitCVsPhase9;
    private Float debitCVsPhase10;

    private Boolean pm;
    private Float debitPrelevement;
    private Boolean pn10Nano;
    private Float facteurDilutionPN10;
    private Boolean pn23Nano;
    private Float facteurDilutionPN23;

    private Boolean ligne1;
    private String pointPrelevementL1;
    private Boolean ligne2;
    private String pointPrelevementL2;
    private Boolean ligne3;
    private String pointPrelevementL3;
    private Boolean microsot;
    private String pointPrelevementMicrosot;

    private Boolean qcl1;
    private String pointPrelevementQCL1;
    private Boolean qcl2;
    private String pointPrelevementQCL2;

    private Boolean fitr;
    private String pointPrelevementFITR;
    private Boolean egr;

    private Boolean xcu1;
    private String software1;
    private String calibration1;
    private String experiment1;
    private Boolean xcu2;
    private String software2;
    private String calibration2;
    private Boolean xcu3;
    private String software3;
    private String calibration3;
    private Boolean acquisitionEOBD;
    private String typeAcquisition;
    // XCU 1
    private String software1FileName;
    private String software1FilePath;

    private String calibration1FileName;
    private String calibration1FilePath;

    private String experiment1FileName;
    private String experiment1FilePath;

    // XCU 2
    private String software2FileName;
    private String software2FilePath;

    private String calibration2FileName;
    private String calibration2FilePath;

    // XCU 3
    private String software3FileName;
    private String software3FilePath;

    private String calibration3FileName;
    private String calibration3FilePath;



    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Mesure> mesures = new ArrayList<>();
    private Boolean mesureCourant;


    @Enumerated(EnumType.STRING)
    private CapotListe capot;

    @Enumerated(EnumType.STRING)
    private SoufflanteListe soufflante;

    private Float qcvs;
    private Boolean carflow;
    private Boolean mesureTension;


    private Boolean thermocouples;

    @Enumerated(EnumType.STRING)
    private TypeMusure typeMesurethermocouples;

    private Boolean sondeLambdaLA4;


    @Enumerated(EnumType.STRING)
    private TypeMusure typeMesuresondeLambdaLA4;


    @OneToOne(mappedBy = "demandeEssai")
    @JsonManagedReference
    private ValidationTechnicien validationTechnicien;

    @OneToOne(mappedBy = "demandeEssai")
    @JsonManagedReference
    private ValidationCharge validationCharge;



}

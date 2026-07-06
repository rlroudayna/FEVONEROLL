package com.FEV.SmartTest.DTO;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Enum.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
public class DemandeEssaiRequest {

    private Long vehiculeId;
    private Long calageId;
    private Long cycleId;
    private Long loiId;

    private String nomAuto;
    private Long numeroProjet;

    private StatutDemande statutDemande;

    private TypeProjet typeProjet;
    private Long clientId;

    private String demandeur;
    private Long technicienId;

    private Banc banc;
    private LocalDate datePlanification;
    private Shift shift;

    private Boolean besoinMaceration;
    private Float temperatureMaceration;
    private Float temperatureEau;
    private Float hygrometrieEssai;
    private Boolean activationSTT;
    private Float temperatureEssai;

    private ListeGestionBatterie12V gestionBatterie12V;

    private Float socDepart12V;
    private Boolean activationClim;
    private Float temperatureRegulationClim;
    private Boolean chauffageHabitable;

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

    private Boolean mesureCourant;
    private List<MesureDTO> mesures;


    private CapotListe capot;
    private SoufflanteListe soufflante;

    private Float qcvs;
    private Boolean carflow;

    private Boolean mesureTension;

    private StatutGlobal StatutGlobal;



    private Boolean thermocouples;


    private Boolean sondeLambdaLA4;

    private MultipartFile software1File;
    private MultipartFile calibration1File;
    private MultipartFile experiment1File;

    private MultipartFile software2File;
    private MultipartFile calibration2File;

    private MultipartFile software3File;
    private MultipartFile calibration3File;

}
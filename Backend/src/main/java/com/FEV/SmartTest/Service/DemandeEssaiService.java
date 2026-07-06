package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.DemandeEssaiRequest;
import com.FEV.SmartTest.DTO.MesureDTO;
import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.Mesure;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.Client;


import com.FEV.SmartTest.Enum.*;
import com.FEV.SmartTest.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class DemandeEssaiService {

    private final DemandeEssaiRepository demandRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ValidationTechnicienRepository validationTechnicienRepo;
    private final ValidationChargeRepository validationChargeRepo;
    private final VehiculeRepository vehiculeRepository;
    private final CalageRepository calageRepository;
    private final CycleConduiteRepository cycleRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final LoiRouteRepository loiRepository;

    public DemandeEssaiService(DemandeEssaiRepository demandRepository, CustomUserDetailsService userDetailsService, ValidationTechnicienRepository validationTechnicienRepo, ValidationChargeRepository validationChargeRepo, VehiculeRepository vehiculeRepository, CalageRepository calageRepository, CycleConduiteRepository cycleRepository, UserRepository userRepository, ClientRepository clientRepository, LoiRouteRepository loiRepository) {
        this.demandRepository = demandRepository;
        this.userDetailsService = userDetailsService;
        this.validationTechnicienRepo = validationTechnicienRepo;
        this.validationChargeRepo = validationChargeRepo;
        this.vehiculeRepository = vehiculeRepository;
        this.calageRepository = calageRepository;
        this.cycleRepository = cycleRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.loiRepository = loiRepository;
    }

    {/*public DemandeEssai create(DemandeEssaiRequest dto) {

        DemandeEssai demande = new DemandeEssai();

        demande.setVehicule(
                vehiculeRepository.findById(dto.getVehiculeId())
                        .orElseThrow(() -> new RuntimeException("Vehicule introuvable"))
        );

        demande.setCalage(
                calageRepository.findById(dto.getCalageId())
                        .orElseThrow(() -> new RuntimeException("Calage introuvable"))
        );

        demande.setCycle(
                cycleRepository.findById(dto.getCycleId())
                        .orElseThrow(() -> new RuntimeException("Cycle introuvable"))
        );
        demande.setLoi(
                loiRepository.findById(dto.getLoiId())
                        .orElseThrow(() -> new RuntimeException("Loi introuvable"))
        );

        demande.setNomAuto(dto.getNomAuto());
        demande.setNumeroProjet(dto.getNumeroProjet());
        demande.setDemandeur(dto.getDemandeur());
        demande.setTechnicienId(dto.getTechnicienId());


        if (dto.getStatutDemande() != null)
            demande.setStatutDemande((dto.getStatutDemande()));

        if (dto.getStatutGlobal() != null)
            demande.setStatutGlobal((dto.getStatutGlobal()));

        if (dto.getTypeProjet() != null)
            demande.setTypeProjet((dto.getTypeProjet()));


        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));

            demande.setClient(client);
        }

        if (dto.getBanc() != null)
            demande.setBanc((dto.getBanc()));

        if (dto.getShift() != null)
            demande.setShift((dto.getShift()));

        if (dto.getTypeEssai() != null)
            demande.setTypeEssai((dto.getTypeEssai()));

        if (dto.getCapot() != null)
            demande.setCapot((dto.getCapot()));

        if (dto.getSoufflante() != null)
            demande.setSoufflante((dto.getSoufflante()));

        if (dto.getGestionBatterie12V() != null)
            demande.setGestionBatterie12V((dto.getGestionBatterie12V()));

        demande.setDatePlanification(dto.getDatePlanification());


        demande.setBesoinMaceration(dto.getBesoinMaceration());
        demande.setTemperatureMaceration(dto.getTemperatureMaceration());
        demande.setTemperatureEau(dto.getTemperatureEau());
        demande.setHygrometrieEssai(dto.getHygrometrieEssai());
        demande.setActivationSTT(dto.getActivationSTT());
        demande.setTemperatureEssai(dto.getTemperatureEssai());

        demande.setSocDepart12V(dto.getSocDepart12V());
        demande.setActivationClim(dto.getActivationClim());
        demande.setTemperatureRegulationClim(dto.getTemperatureRegulationClim());
        demande.setChauffageHabitable(dto.getChauffageHabitable());
        demande.setVerificationCoastDown(dto.getVerificationCoastDown());
        demande.setNombreDecelerations(dto.getNombreDecelerations());
        demande.setCommentaire(dto.getCommentaire());

        demande.setPm(dto.getPm());
        demande.setDebitPrelevement(dto.getDebitPrelevement());
        demande.setPn10Nano(dto.getPn10Nano());
        demande.setFacteurDilutionPN10(dto.getFacteurDilutionPN10());
        demande.setPn23Nano(dto.getPn23Nano());
        demande.setFacteurDilutionPN23(dto.getFacteurDilutionPN23());

        demande.setLigne1(dto.getLigne1());
        demande.setPointPrelevementL1(dto.getPointPrelevementL1());

        demande.setLigne2(dto.getLigne2());
        demande.setPointPrelevementL2(dto.getPointPrelevementL2());

        demande.setLigne3(dto.getLigne3());
        demande.setPointPrelevementL3(dto.getPointPrelevementL3());

        demande.setMicrosot(dto.getMicrosot());
        demande.setPointPrelevementMicrosot(dto.getPointPrelevementMicrosot());

        demande.setQcl1(dto.getQcl1());
        demande.setPointPrelevementQCL1(dto.getPointPrelevementQCL1());

        demande.setQcl2(dto.getQcl2());
        demande.setPointPrelevementQCL2(dto.getPointPrelevementQCL2());

        demande.setPointPrelevementFITR(dto.getPointPrelevementFITR());
        demande.setEgr(dto.getEgr());
        demande.setAcquisitionEOBD(dto.getAcquisitionEOBD());
        demande.setTypeAcquisition(dto.getTypeAcquisition());
        demande.setCarflow(dto.getCarflow());
        demande.setMesureCourant(dto.getMesureCourant());
        demande.setMesureTension(dto.getMesureTension());
        demande.setThermocouples(dto.getThermocouples());
        demande.setSondeLambdaLA4(dto.getSondeLambdaLA4());

        demande.setXcu1(dto.getXcu1());
        demande.setSoftware1(dto.getSoftware1());
        demande.setCalibration1(dto.getCalibration1());
        demande.setExperiment1(dto.getExperiment1());


        demande.setMesureSAC(dto.getMesureSAC());
        demande.setDebitCVsPhase1(dto.getDebitCVsPhase1());
        demande.setDebitCVsPhase2(dto.getDebitCVsPhase2());
        demande.setDebitCVsPhase3(dto.getDebitCVsPhase3());
        demande.setDebitCVsPhase4(dto.getDebitCVsPhase4());
        demande.setDebitCVsPhase5(dto.getDebitCVsPhase5());
        demande.setDebitCVsPhase6(dto.getDebitCVsPhase6());
        demande.setDebitCVsPhase7(dto.getDebitCVsPhase7());
        demande.setDebitCVsPhase8(dto.getDebitCVsPhase8());
        demande.setDebitCVsPhase9(dto.getDebitCVsPhase9());
        demande.setDebitCVsPhase10(dto.getDebitCVsPhase10());
        demande.setQcvs(dto.getQcvs());
        demande.setFitr(dto.getFitr());

        if (dto.getMesures() != null) {

            List<Mesure> mesures = dto.getMesures().stream().map(m -> {
                Mesure mesure = new Mesure();

                mesure.setType(m.getType());
                mesure.setIndice(m.getIndice());
                mesure.setNumero(m.getNumero());
                mesure.setSousType(m.getSousType());

                // 🔥 IMPORTANT FIX
                mesure.setDemande(demande);

                return mesure;
            }).collect(Collectors.toList());

            demande.setMesures(mesures);
        }

        return demandRepository.save(demande);
    }    */}

    public DemandeEssai create(DemandeEssaiRequest dto,
                               MultipartFile software1,
                               MultipartFile calibration1,
                               MultipartFile experiment1,
                               MultipartFile software2,
                               MultipartFile calibration2,
                               MultipartFile software3,
                               MultipartFile calibration3) {

        DemandeEssai demande = new DemandeEssai();

        // ----- Relations ManyToOne -----
        demande.setVehicule(
                vehiculeRepository.findById(dto.getVehiculeId())
                        .orElseThrow(() -> new RuntimeException("Vehicule introuvable"))
        );

        demande.setCalage(
                calageRepository.findById(dto.getCalageId())
                        .orElseThrow(() -> new RuntimeException("Calage introuvable"))
        );

        demande.setCycle(
                cycleRepository.findById(dto.getCycleId())
                        .orElseThrow(() -> new RuntimeException("Cycle introuvable"))
        );

        demande.setLoi(
                loiRepository.findById(dto.getLoiId())
                        .orElseThrow(() -> new RuntimeException("Loi introuvable"))
        );

        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            demande.setClient(client);
        }

        // ----- Champs simples -----
        demande.setNomAuto(dto.getNomAuto());
        demande.setNumeroProjet(dto.getNumeroProjet());
        demande.setDemandeur(dto.getDemandeur());
        demande.setTechnicienId(dto.getTechnicienId());
        demande.setStatutDemande(dto.getStatutDemande());
        demande.setStatutGlobal(dto.getStatutGlobal());
        demande.setTypeProjet(dto.getTypeProjet());
        demande.setBanc(dto.getBanc());
        demande.setShift(dto.getShift());
        demande.setTypeEssai(dto.getTypeEssai());
        demande.setCapot(dto.getCapot());
        demande.setSoufflante(dto.getSoufflante());
        demande.setGestionBatterie12V(dto.getGestionBatterie12V());
        demande.setDatePlanification(dto.getDatePlanification());
        demande.setBesoinMaceration(dto.getBesoinMaceration());
        demande.setTemperatureMaceration(dto.getTemperatureMaceration());
        demande.setTemperatureEau(dto.getTemperatureEau());
        demande.setHygrometrieEssai(dto.getHygrometrieEssai());
        demande.setActivationSTT(dto.getActivationSTT());
        demande.setTemperatureEssai(dto.getTemperatureEssai());
        demande.setSocDepart12V(dto.getSocDepart12V());
        demande.setActivationClim(dto.getActivationClim());
        demande.setTemperatureRegulationClim(dto.getTemperatureRegulationClim());
        demande.setChauffageHabitable(dto.getChauffageHabitable());
        demande.setVerificationCoastDown(dto.getVerificationCoastDown());
        demande.setNombreDecelerations(dto.getNombreDecelerations());
        demande.setCommentaire(dto.getCommentaire());

        // ----- Mesures particules -----
        demande.setPm(dto.getPm());
        demande.setDebitPrelevement(dto.getDebitPrelevement());
        demande.setPn10Nano(dto.getPn10Nano());
        demande.setFacteurDilutionPN10(dto.getFacteurDilutionPN10());
        demande.setPn23Nano(dto.getPn23Nano());
        demande.setFacteurDilutionPN23(dto.getFacteurDilutionPN23());

        // ----- Lignes et points de prélèvement -----
        demande.setLigne1(dto.getLigne1());
        demande.setPointPrelevementL1(dto.getPointPrelevementL1());
        demande.setLigne2(dto.getLigne2());
        demande.setPointPrelevementL2(dto.getPointPrelevementL2());
        demande.setLigne3(dto.getLigne3());
        demande.setPointPrelevementL3(dto.getPointPrelevementL3());
        demande.setMicrosot(dto.getMicrosot());
        demande.setPointPrelevementMicrosot(dto.getPointPrelevementMicrosot());
        demande.setQcl1(dto.getQcl1());
        demande.setPointPrelevementQCL1(dto.getPointPrelevementQCL1());
        demande.setQcl2(dto.getQcl2());
        demande.setPointPrelevementQCL2(dto.getPointPrelevementQCL2());
        demande.setFitr(dto.getFitr());
        demande.setPointPrelevementFITR(dto.getPointPrelevementFITR());
        demande.setEgr(dto.getEgr());

        demande.setXcu1(dto.getXcu1());
        demande.setXcu2(dto.getXcu2());
        demande.setXcu2(dto.getXcu2());




        // ----- Mesures CVS -----
        demande.setMesureSAC(dto.getMesureSAC());
        demande.setDebitCVsPhase1(dto.getDebitCVsPhase1());
        demande.setDebitCVsPhase2(dto.getDebitCVsPhase2());
        demande.setDebitCVsPhase3(dto.getDebitCVsPhase3());
        demande.setDebitCVsPhase4(dto.getDebitCVsPhase4());
        demande.setDebitCVsPhase5(dto.getDebitCVsPhase5());
        demande.setDebitCVsPhase6(dto.getDebitCVsPhase6());
        demande.setDebitCVsPhase7(dto.getDebitCVsPhase7());
        demande.setDebitCVsPhase8(dto.getDebitCVsPhase8());
        demande.setDebitCVsPhase9(dto.getDebitCVsPhase9());
        demande.setDebitCVsPhase10(dto.getDebitCVsPhase10());
        demande.setQcvs(dto.getQcvs());
        demande.setCarflow(dto.getCarflow());

        demande.setAcquisitionEOBD(dto.getAcquisitionEOBD());
        demande.setTypeAcquisition(dto.getTypeAcquisition());


        // ----- Mesure courant et tension -----
        demande.setMesureCourant(dto.getMesureCourant());
        demande.setMesureTension(dto.getMesureTension());
        demande.setThermocouples(dto.getThermocouples());
        demande.setSondeLambdaLA4(dto.getSondeLambdaLA4());

        // ----- Mesures enfants -----
        if (dto.getMesures() != null) {
            List<Mesure> mesures = dto.getMesures().stream().map(m -> {
                Mesure mesure = new Mesure();
                mesure.setType(m.getType());
                mesure.setIndice(m.getIndice());
                mesure.setNumero(m.getNumero());
                mesure.setSousType(m.getSousType());
                mesure.setDemande(demande); // IMPORTANT : relation bidirectionnelle
                return mesure;
            }).collect(Collectors.toList());
            demande.setMesures(mesures);
        }

        // ----- Upload fichiers XCU -----
        demande.setSoftware1FileName(software1 != null ? software1.getOriginalFilename() : null);
        demande.setSoftware1FilePath(saveFile(software1));
        demande.setCalibration1FileName(calibration1 != null ? calibration1.getOriginalFilename() : null);
        demande.setCalibration1FilePath(saveFile(calibration1));
        demande.setExperiment1FileName(experiment1 != null ? experiment1.getOriginalFilename() : null);
        demande.setExperiment1FilePath(saveFile(experiment1));

        demande.setSoftware2FileName(software2 != null ? software2.getOriginalFilename() : null);
        demande.setSoftware2FilePath(saveFile(software2));
        demande.setCalibration2FileName(calibration2 != null ? calibration2.getOriginalFilename() : null);
        demande.setCalibration2FilePath(saveFile(calibration2));

        demande.setSoftware3FileName(software3 != null ? software3.getOriginalFilename() : null);
        demande.setSoftware3FilePath(saveFile(software3));
        demande.setCalibration3FileName(calibration3 != null ? calibration3.getOriginalFilename() : null);
        demande.setCalibration3FilePath(saveFile(calibration3));

        // ----- Sauvegarde finale -----
        return demandRepository.save(demande);
    }

    // ----- Méthode utilitaire upload -----
    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        try {
            // Chemin absolu basé sur le répertoire de travail
            Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "inca");
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toAbsolutePath().toFile());

            return "inca/" + fileName;

        } catch (Exception e) {
            // Log l'erreur réelle pour diagnostiquer
            e.printStackTrace();
            throw new RuntimeException("Erreur upload fichier : " + e.getMessage(), e);
        }
    }
    // ------------------ READ ALL ------------------
    public List<DemandeEssai> getAllDemandes() {
        return demandRepository.findAll();
    }

    // ------------------ READ ONE ------------------
    public DemandeEssai getById(Long id) {
        return demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }

    // ------------------ UPDATE ------------------


    public DemandeEssai updateDemande(
            Long id,
            DemandeEssaiRequest updated,
            MultipartFile software1,
            MultipartFile calibration1,
            MultipartFile experiment1,
            MultipartFile software2,
            MultipartFile calibration2,
            MultipartFile software3,
            MultipartFile calibration3){
        return demandRepository.findById(id).map(d -> {

            // Informations générales
            d.setNomAuto(updated.getNomAuto());
            d.setNumeroProjet(updated.getNumeroProjet());
            d.setStatutGlobal(updated.getStatutGlobal());
            d.setStatutDemande(updated.getStatutDemande());
            d.setDemandeur(updated.getDemandeur());
            d.setTechnicienId(updated.getTechnicienId());

            d.setVehicule(
                    vehiculeRepository.findById(updated.getVehiculeId())
                            .orElseThrow(() -> new RuntimeException("Vehicule introuvable"))
            );

            d.setCalage(
                    calageRepository.findById(updated.getCalageId())
                            .orElseThrow(() -> new RuntimeException("Calage introuvable"))
            );

            d.setCycle(
                    cycleRepository.findById(updated.getCycleId())
                            .orElseThrow(() -> new RuntimeException("Cycle introuvable"))
            );

            d.setLoi(
                    loiRepository.findById(updated.getLoiId())
                            .orElseThrow(() -> new RuntimeException("Loi introuvable"))
            );

            d.setClient(
                    clientRepository.findById(updated.getClientId())
                            .orElseThrow(() -> new RuntimeException("Client introuvable"))
            );

            // Planification
            d.setDatePlanification(updated.getDatePlanification());
            d.setShift(updated.getShift());
            d.setBanc(updated.getBanc());
            d.setTypeProjet(updated.getTypeProjet());

            // Conditions essai
            d.setBesoinMaceration(updated.getBesoinMaceration());
            d.setTemperatureMaceration(updated.getTemperatureMaceration());
            d.setTemperatureEau(updated.getTemperatureEau());
            d.setHygrometrieEssai(updated.getHygrometrieEssai());
            d.setActivationSTT(updated.getActivationSTT());
            d.setTemperatureEssai(updated.getTemperatureEssai());

            // Batterie / clim
            d.setGestionBatterie12V(updated.getGestionBatterie12V());
            d.setSocDepart12V(updated.getSocDepart12V());
            d.setActivationClim(updated.getActivationClim());
            d.setTemperatureRegulationClim(updated.getTemperatureRegulationClim());
            d.setChauffageHabitable(updated.getChauffageHabitable());

            // Type essai
            d.setTypeEssai(updated.getTypeEssai());
            d.setVerificationCoastDown(updated.getVerificationCoastDown());
            d.setNombreDecelerations(updated.getNombreDecelerations());
            d.setCommentaire(updated.getCommentaire());

            // Débits CVS
            d.setMesureSAC(updated.getMesureSAC());
            d.setDebitCVsPhase1(updated.getDebitCVsPhase1());
            d.setDebitCVsPhase2(updated.getDebitCVsPhase2());
            d.setDebitCVsPhase3(updated.getDebitCVsPhase3());
            d.setDebitCVsPhase4(updated.getDebitCVsPhase4());
            d.setDebitCVsPhase5(updated.getDebitCVsPhase5());
            d.setDebitCVsPhase6(updated.getDebitCVsPhase6());
            d.setDebitCVsPhase7(updated.getDebitCVsPhase7());
            d.setDebitCVsPhase8(updated.getDebitCVsPhase8());
            d.setDebitCVsPhase9(updated.getDebitCVsPhase9());
            d.setDebitCVsPhase10(updated.getDebitCVsPhase10());

            // Particules
            d.setPm(updated.getPm());
            d.setDebitPrelevement(updated.getDebitPrelevement());
            d.setPn10Nano(updated.getPn10Nano());
            d.setFacteurDilutionPN10(updated.getFacteurDilutionPN10());
            d.setPn23Nano(updated.getPn23Nano());
            d.setFacteurDilutionPN23(updated.getFacteurDilutionPN23());

            // Lignes
            d.setLigne1(updated.getLigne1());
            d.setPointPrelevementL1(updated.getPointPrelevementL1());
            d.setLigne2(updated.getLigne2());
            d.setPointPrelevementL2(updated.getPointPrelevementL2());
            d.setLigne3(updated.getLigne3());
            d.setPointPrelevementL3(updated.getPointPrelevementL3());

            // Microsot / QCL
            d.setMicrosot(updated.getMicrosot());
            d.setPointPrelevementMicrosot(updated.getPointPrelevementMicrosot());

            d.setQcl1(updated.getQcl1());
            d.setPointPrelevementQCL1(updated.getPointPrelevementQCL1());
            d.setQcl2(updated.getQcl2());
            d.setPointPrelevementQCL2(updated.getPointPrelevementQCL2());

            d.setFitr(updated.getFitr());
            d.setPointPrelevementFITR(updated.getPointPrelevementFITR());

            d.setEgr(updated.getEgr());

            // ECU
            d.setXcu1(updated.getXcu1());
            d.setSoftware1(updated.getSoftware1());
            d.setCalibration1(updated.getCalibration1());
            d.setExperiment1(updated.getExperiment1());

            d.setXcu2(updated.getXcu2());
            d.setSoftware2(updated.getSoftware2());
            d.setCalibration2(updated.getCalibration2());

            d.setXcu3(updated.getXcu3());
            d.setSoftware3(updated.getSoftware3());
            d.setCalibration3(updated.getCalibration3());

            // Acquisition
            d.setAcquisitionEOBD(updated.getAcquisitionEOBD());
            d.setTypeAcquisition(updated.getTypeAcquisition());

            // Mesure courant
            d.setMesureCourant(updated.getMesureCourant());


            // Capot / soufflante
            d.setCapot(updated.getCapot());
            d.setSoufflante(updated.getSoufflante());

            // CVS
            d.setQcvs(updated.getQcvs());
            d.setCarflow(updated.getCarflow());

            // Mesure tension
            d.setMesureTension(updated.getMesureTension());


            // Thermocouples
            d.setThermocouples(updated.getThermocouples());


            // Sonde Lambda
            d.setSondeLambdaLA4(updated.getSondeLambdaLA4());


            if (updated.getMesures() != null) {
                // Supprimer les mesures qui ne sont plus dans la liste
                List<Long> idsEntrants = updated.getMesures().stream()
                        .filter(m -> m.getId() != null)
                        .map(MesureDTO::getId)
                        .toList();

                d.getMesures().removeIf(m -> !idsEntrants.contains(m.getId()));

                for (MesureDTO dto : updated.getMesures()) {
                    if (dto.getId() != null) {
                        d.getMesures().stream()
                                .filter(m -> m.getId().equals(dto.getId()))
                                .findFirst()
                                .ifPresent(m -> {
                                    m.setType(dto.getType());
                                    m.setIndice(dto.getIndice());
                                    m.setNumero(dto.getNumero());
                                    m.setSousType(dto.getSousType());
                                });
                    } else {
                        Mesure mesure = new Mesure();
                        mesure.setType(dto.getType());
                        mesure.setIndice(dto.getIndice());
                        mesure.setNumero(dto.getNumero());
                        mesure.setSousType(dto.getSousType());
                        mesure.setDemande(d);
                        d.getMesures().add(mesure);
                    }
                }
            }
            // XCU1
            if (software1 != null && !software1.isEmpty()) {
                d.setSoftware1FileName(software1.getOriginalFilename());
                d.setSoftware1FilePath(saveFile(software1));
            }

            if (calibration1 != null && !calibration1.isEmpty()) {
                d.setCalibration1FileName(calibration1.getOriginalFilename());
                d.setCalibration1FilePath(saveFile(calibration1));
            }

            if (experiment1 != null && !experiment1.isEmpty()) {
                d.setExperiment1FileName(experiment1.getOriginalFilename());
                d.setExperiment1FilePath(saveFile(experiment1));
            }

// XCU2
            if (software2 != null && !software2.isEmpty()) {
                d.setSoftware2FileName(software2.getOriginalFilename());
                d.setSoftware2FilePath(saveFile(software2));
            }

            if (calibration2 != null && !calibration2.isEmpty()) {
                d.setCalibration2FileName(calibration2.getOriginalFilename());
                d.setCalibration2FilePath(saveFile(calibration2));
            }

// XCU3
            if (software3 != null && !software3.isEmpty()) {
                d.setSoftware3FileName(software3.getOriginalFilename());
                d.setSoftware3FilePath(saveFile(software3));
            }

            if (calibration3 != null && !calibration3.isEmpty()) {
                d.setCalibration3FileName(calibration3.getOriginalFilename());
                d.setCalibration3FilePath(saveFile(calibration3));
            }

            return demandRepository.save(d);

        }).orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }
    // ------------------ DELETE ------------------
    @Transactional
    public void deleteDemande(Long id) {

        DemandeEssai demande = demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        // 1. supprimer validations liées
        validationChargeRepo.deleteByDemandeEssaiId(id);
        validationTechnicienRepo.deleteByDemandeEssaiId(id);

        // 2. supprimer fichiers si tu stockes en local
        deleteFiles(demande);

        // 3. supprimer la demande
        demandRepository.delete(demande);
    }
    private void deleteFiles(DemandeEssai demande) {

        // exemple validation charge
        if (demande.getValidationCharge() != null) {
            deleteFile(demande.getValidationCharge().getFichierINCAPath());
            deleteFile(demande.getValidationCharge().getFichierBaRPath());
            deleteFile(demande.getValidationCharge().getFichierChecklistPath());
        }
    }

    private void deleteFile(String path) {
        if (path == null) return;

        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
    }
    public DemandeEssai duplicateDemande(Long id) {

        DemandeEssai original = demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        DemandeEssai copy = new DemandeEssai();

        BeanUtils.copyProperties(original, copy, "id", "mesures");

        copy.setStatutGlobal(StatutGlobal.PAS_FAIT);

        // 🔥 IMPORTANT : nouvelle liste indépendante
        if (original.getMesures() != null) {

            List<Mesure> newMesures = original.getMesures().stream()
                    .map(m -> {
                        Mesure nm = new Mesure();
                        nm.setType(m.getType());
                        nm.setIndice(m.getIndice());
                        nm.setNumero(m.getNumero());
                        nm.setSousType(m.getSousType());
                        nm.setDemande(copy);
                        return nm;
                    })
                    .toList();

            copy.setMesures(new ArrayList<>(newMesures));
        } else {
            copy.setMesures(new ArrayList<>());
        }

        return demandRepository.save(copy);
    }
    public  void mettreAJourStatut(Long demandeId) {

        DemandeEssai demande = demandRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        boolean validationTech =
                validationTechnicienRepo.existsByDemandeEssaiId(demandeId);

        boolean validationCharge =
                validationChargeRepo.existsByDemandeEssaiId(demandeId);

        if (validationTech && validationCharge) {
            demande.setStatutGlobal(StatutGlobal.FAIT);
        }
        else if (validationTech || validationCharge) {
            demande.setStatutGlobal(StatutGlobal.EN_COURS);
        }
        else {
            demande.setStatutGlobal(StatutGlobal.PAS_FAIT);
        }

        demandRepository.save(demande);
    }
    public Map<String, Long> countDemandesByStatut() {

        long fait = demandRepository.countByStatutGlobal(StatutGlobal.FAIT);
        long encours = demandRepository.countByStatutGlobal(StatutGlobal.EN_COURS);
        long pasFait = demandRepository.countByStatutGlobal(StatutGlobal.PAS_FAIT);

        Map<String, Long> stats = new HashMap<>();
        stats.put("fait", fait);
        stats.put("encours", encours);
        stats.put("pasFait", pasFait);

        return stats;
    }

    public List<Map<String, Object>> evolutionEssais12Mois(Long clientId) {

        int year = LocalDate.now().getYear();

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        boolean isGlobalAccess =
                user.getRole() == Role.ADMIN ||
                        user.getRole() == Role.CHARGE_ESSAI ||
                        user.getRole() == Role.TECHNICIEN_ESSAI;

        Client client = null;

        if (isGlobalAccess) {
            if (user.getRole() == Role.ADMIN && clientId != null) {
                client = clientRepository.findById(clientId).orElse(null);
            }
        } else {
            client = user.getClient();
        }

        List<Object[]> results = (client == null)
                ? demandRepository.countByMonthAndStatut(year)
                : demandRepository.countByMonthAndStatutAndClient(year, client);
        Map<Integer, Map<String, Object>> data = new HashMap<>();

        String[] mois = {"Jan","Fév","Mars","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"};

        for (int i = 1; i <= 12; i++) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", mois[i - 1]);
            m.put("Fait", 0L);
            m.put("Pas_fait", 0L);
            m.put("En_cours", 0L);
            data.put(i, m);
        }

        for (Object[] r : results) {

            int month = (Integer) r[0];

            StatutGlobal statut = (r[1] instanceof StatutGlobal)
                    ? (StatutGlobal) r[1]
                    : StatutGlobal.valueOf(r[1].toString());

            Long count = (Long) r[2];

            Map<String, Object> m = data.get(month);

            if (statut == StatutGlobal.FAIT) {
                m.put("Fait", count);
            } else if (statut == StatutGlobal.PAS_FAIT) {
                m.put("Pas_fait", count);
            } else if (statut == StatutGlobal.EN_COURS) {
                m.put("En_cours", count);
            }
        }

        return data.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(Map.Entry::getValue)
                .toList();
    }
    public int convertMonth(String m) {
        return switch (m) {
            case "Jan" -> 1;
            case "Feb" -> 2;
            case "Mar" -> 3;
            case "Apr" -> 4;
            case "May" -> 5;
            case "Jun" -> 6;
            case "Jul" -> 7;
            case "Aug" -> 8;
            case "Sep" -> 9;
            case "Oct" -> 10;
            case "Nov" -> 11;
            case "Dec" -> 12;
            default -> throw new IllegalArgumentException("Mois invalide");
        };
    }

    public List<Map<String, Object>> evolutionEssaisParSemaine(int month, Long clientId) {

        int year = LocalDate.now().getYear();

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        boolean isGlobalAccess =
                user.getRole() == Role.ADMIN ||
                        user.getRole() == Role.CHARGE_ESSAI ||
                        user.getRole() == Role.TECHNICIEN_ESSAI;

        Client client = null;

        if (isGlobalAccess) {
            if (user.getRole() == Role.ADMIN && clientId != null) {
                client = clientRepository.findById(clientId).orElse(null);
            }
        } else {
            client = user.getClient();
        }

        List<Object[]> results =
                demandRepository.countByWeekAndStatut(year, month, client);

        List<Map<String, Object>> weeks = new ArrayList<>();

        for (int i = 1; i <= 5; i++) {
            Map<String, Object> w = new HashMap<>();
            w.put("week", "S" + i);
            w.put("Fait", 0);
            w.put("Pas_fait", 0);
            w.put("En_cours", 0);
            weeks.add(w);
        }

        for (Object[] r : results) {

            int week = ((Number) r[0]).intValue();
            StatutGlobal statut = (StatutGlobal) r[1];
            Long count = (Long) r[2];

            Map<String, Object> w = weeks.get(week - 1);

            switch (statut) {
                case FAIT -> w.put("Fait", count);
                case PAS_FAIT -> w.put("Pas_fait", count);
                case EN_COURS -> w.put("En_cours", count);
            }
        }

        return weeks;
    }

    public long getTotalDemandes(Optional<Client> clientOpt) {

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Role role = user.getRole();

        // 👤 EXTERNE
        if (role == Role.EXTERNE) {
            return demandRepository.countByClient(user.getClient());
        }

        boolean isGlobal =
                role == Role.ADMIN
                        || role == Role.CHARGE_ESSAI
                        || role == Role.TECHNICIEN_ESSAI;

        if (isGlobal) {

            if (clientOpt.isPresent()) {
                return demandRepository.countByClient(clientOpt.get());
            }

            return demandRepository.count();
        }

        return 0;
    }


    public List<DemandeEssai> getAllDemandeClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        // ADMIN + internes FEV → accès global
        if (currentUser.getRole() == Role.ADMIN
                || currentUser.getRole() == Role.CHARGE_ESSAI
                || currentUser.getRole() == Role.TECHNICIEN_ESSAI) {
            return demandRepository.findAll();
        }

        // EXTERNE → uniquement son client
        return demandRepository.findByClient(currentUser.getClient());
    }


    public Map<String, Long> countDemandesByStatut(Optional<Client> clientOpt) {

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        boolean isGlobalAccess =
                user.getRole() == Role.ADMIN ||
                        user.getRole() == Role.CHARGE_ESSAI ||
                        user.getRole() == Role.TECHNICIEN_ESSAI;

        Client client = null;

        if (isGlobalAccess) {
            // ADMIN peut filtrer, les autres voient tout si null
            client = (user.getRole() == Role.ADMIN)
                    ? clientOpt.orElse(null)
                    : null;
        } else {
            // EXTERNE → toujours son client
            client = user.getClient();
        }

        long fait = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.FAIT)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.FAIT, client);

        long encours = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.EN_COURS)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.EN_COURS, client);

        long pasFait = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.PAS_FAIT)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.PAS_FAIT, client);

        Map<String, Long> stats = new HashMap<>();
        stats.put("fait", fait);
        stats.put("encours", encours);
        stats.put("pasFait", pasFait);
        return stats;
    }


    public List<Map<String, Object>> statsParTechnicienEtClient(
            Long clientId,
            Long technicienId
    ) {
        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        boolean isTechnicien  = user.getRole() == Role.TECHNICIEN_ESSAI;
        boolean isChargeEssai = user.getRole() == Role.CHARGE_ESSAI;

        final Long effectiveTechnicienId = isTechnicien ? user.getId() : technicienId;

        final Client clientFilter;
        if (clientId != null) {
            clientFilter = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
        } else {
            clientFilter = null;
        }

        List<Object[]> results =
                demandRepository.countStatutByTechnicienAndClient(clientFilter, effectiveTechnicienId);

        Map<String, Map<String, Object>> response = new LinkedHashMap<>();

        for (Object[] r : results) {
            // ✅ Nouveaux index — plus de rowClient en r[0]
            Long   techId      = ((Number) r[0]).longValue();
            String nom         = (String)  r[1];
            String prenom      = (String)  r[2];
            String decisionRaw = r[3] != null ? r[3].toString() : null;
            Long   count       = r[4] != null ? ((Number) r[4]).longValue() : 0L;

            if (isChargeEssai && !techId.equals(user.getId())) continue;
            if (isTechnicien  && !techId.equals(user.getId())) continue;

            // Clé simple par techId (le client est géré dans la query via LEFT JOIN)
            String key = String.valueOf(techId);

            Map<String, Object> map = response.computeIfAbsent(key, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("technicienId",  techId);
                m.put("nom",           nom);
                m.put("prenom",        prenom);
                m.put("client",        clientFilter == null ? "ALL" : clientFilter);
                m.put("ok",            0L);
                m.put("okSousReserve", 0L);
                m.put("nok",           0L);
                m.put("total",         0L);
                return m;
            });

            if (decisionRaw == null) continue;

            DecisionValidation decision = DecisionValidation.valueOf(decisionRaw);
            switch (decision) {
                case OK ->
                        map.put("ok", ((Number) map.get("ok")).longValue() + count);
                case OK_SOUS_RESERVE ->
                        map.put("okSousReserve", ((Number) map.get("okSousReserve")).longValue() + count);
                case NOK ->
                        map.put("nok", ((Number) map.get("nok")).longValue() + count);
            }

            map.put("total", ((Number) map.get("total")).longValue() + count);
        }

        return new ArrayList<>(response.values());
    }
    public List<Map<String, Object>> statsParCharge(User user, Client clientFilter) {

        // ─── 1. Résolution du client et du rôle ──────────────────────────────
        final Client client;
        final boolean isChargeEssai = user.getRole() == Role.CHARGE_ESSAI;

        if (user.getRole() == Role.ADMIN) {
            client = clientFilter;           // ADMIN   → filtre libre
        } else if (isChargeEssai) {
            client = null;                   // CHARGE  → tous les clients
        } else {
            client = user.getClient();       // EXTERNE → son propre client
        }

        // ─── 2. Requête repo ─────────────────────────────────────────────────
        List<Object[]> results;

        if (isChargeEssai) {
            // null client = pas de filtre client, mais filtré sur son propre id
            results = demandRepository.countValidationByChargeAndUserId(null, user.getId());
        } else {
            results = demandRepository.countValidationByCharge(client);
        }

        // ─── 3. Agrégation ───────────────────────────────────────────────────
        Map<String, Map<String, Object>> response = new LinkedHashMap<>();

        for (Object[] r : results) {
            Long   chargeId = ((Number) r[0]).longValue();
            String nom      = (String)  r[1];
            String prenom   = (String)  r[2];
            String validRaw = r[3] != null ? r[3].toString() : null;
            Long   count    = r[4] != null ? ((Number) r[4]).longValue() : 0L;

            Map<String, Object> map = response.computeIfAbsent(
                    String.valueOf(chargeId), k -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("chargeId",      chargeId);
                        m.put("nom",           nom);
                        m.put("prenom",        prenom);
                        m.put("client",        isChargeEssai ? "ALL" : (client == null ? "ALL" : client));
                        m.put("ok",            0L);
                        m.put("okSousReserve", 0L);
                        m.put("nok",           0L);
                        m.put("total",         0L);
                        return m;
                    });

            if (validRaw == null) continue;

            switch (validRaw) {
                case "OK"              -> map.put("ok",            ((Number) map.get("ok")).longValue()            + count);
                case "OK_SOUS_RESERVE" -> map.put("okSousReserve", ((Number) map.get("okSousReserve")).longValue() + count);
                case "NOK"             -> map.put("nok",           ((Number) map.get("nok")).longValue()           + count);
            }

            map.put("total", ((Number) map.get("total")).longValue() + count);
        }

        return new ArrayList<>(response.values());
    }
}

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  X,
  Upload,
  Settings,
  Activity,
  Calendar,
} from "lucide-react";
import { authFetch } from "../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

import { toast } from "sonner";

export enum statutGlobal {
  FAIT = "FAIT",
  PAS_FAIT = "PAS_FAIT",
  EN_COURS = "EN_COURS",
}
export enum TypeMusure {
  ANALOGIQUE = "ANALOGIQUE",
  CAN = "CAN",
  FIBRE_OPTIQUE = "FIBRE_OPTIQUE",
}
export enum Role {
  ADMIN = "ADMIN",
  CHARGE_ESSAI = "CHARGE_ESSAI",
  TECHNICIEN_ESSAI = "TECHNICIEN_ESSAI",
  EXTERNE = "EXTERNE",
}
export enum familleTest {
  WLTC,
  RDE,
}
export enum TypeMesureAux {
  COURANT = "COURANT",
  TENSION = "TENSION",
  THERMOCOUPLE = "THERMOCOUPLE",
  SONDE_LAMBDA = "SONDE_LAMBDA",
}

interface Client {
  id?: number;
  nom: string;
}
export enum StatutDemande {
  EN_CREATION = "En_creation",
  VALIDE = "VALIDE",
}
export const StatutGlobalOptions = ["EN_COURS", "FAIT", "PAS_FAIT"] as const;

interface User {
  id?: number;
  nom: string;
  prenom: string;
  client: Client;
  email: string;
  role: Role;
  numeroTelephone?: string;
  motDePasse?: string;
  image?: string;
}
export function Demandes() {
  const BASE = "/demandes-essai";

  const [showForm, setShowForm] = useState(false);
  const [techniciens, setTechniciens] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [search, setSearch] = useState("");
  const [filterProjet, setFilterProjet] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterStatutGlobal, setFilterStatutGlobal] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [filterDemandeur, setFilterDemandeur] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<string>("");
  const isAdmin = role?.includes("ADMIN");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  type ModalMode = "add" | "edit" | "view";
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const [userClient, setUserClient] = useState<Client | null>(null);
  const [mode, setMode] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isView = modalMode === "view";
  // create | edit | view

  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState<number | null>(null);
  const [filterValidation, setFilterValidation] = useState("");
  const [selectedDemande, setSelectedDemande] = useState<DemandeEssai | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [calages, setCalages] = useState<Calage[]>([]);
  const [loisRoute, setLoisRoute] = useState<LoiRoute[]>([]);
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiculeDetails, setVehiculeDetails] = useState<Vehicule | null>(null);
  const [calageDetails, setCalageDetails] = useState<Calage | null>(null);
  const [loiDetails, setLoiDetails] = useState<LoiRoute | null>(null);
  const [cycleDetails, setCycleDetails] = useState<Cycle | null>(null);
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );
  // Déclarer DANS le composant, avant le return
  const mesureItems: { id: MesureKey; label: string }[] = [
    { id: "mesureCourant", label: "Mesure Courant" },
    { id: "mesureTension", label: "Mesure Tension" },
    { id: "thermocouples", label: "Thermocouples" },
    { id: "sondeLambdaLA4", label: "Sonde Lambda LA4" },
  ];
  // ✅ Correction du state
  const [files, setFiles] = useState<{
    software1: File | null;
    calibration1: File | null;
    experiment1: File | null;
    software2: File | null;
    calibration2: File | null;
    software3: File | null;
    calibration3: File | null;
  }>({
    software1: null,
    calibration1: null,
    experiment1: null,
    software2: null,
    calibration2: null,
    software3: null,
    calibration3: null,
  });

  type MesureKey =
    | "mesureCourant"
    | "mesureTension"
    | "thermocouples"
    | "sondeLambdaLA4";

  type MesuresRowsState = Record<MesureKey, MesureRow[]>;

  const [mesuresRows, setMesuresRows] = useState<MesuresRowsState>({
    mesureCourant: [],
    mesureTension: [],
    thermocouples: [],
    sondeLambdaLA4: [],
  });

  interface Vehicule {
    id: number;
    nomAppliImmat?: string;
    identificateur?: string;
    nomAuto?: string;
    codeInterne?: string;
  }
  interface Cycle {
    id: number;
    nom?: string;
    familleTest?: familleTest;
  }
  interface MesureRow {
    id?: number;
    indice: string;
    numero: string;
    type: TypeMusure | "";
  }
  interface DemandeEssaiForm extends Omit<
    DemandeEssai,
    "vehicule" | "cycle" | "calage"
  > {
    vehiculeId?: number;
    cycleId?: number;
    calageId?: number;
    loiId?: number;
    technicienId: number;
    clientId: number;
  }
  interface Calage {
    id: number;
    nom?: string;
    temperature?: number;
  }
  interface MesureDTO {
    id?: number;
    type: TypeMesureAux;
    indice?: number;
    numero?: number;
    sousType?: TypeMusure;
  }

  interface LoiRoute {
    id: number;
    nom?: string;
    masseEssaiKg?: number;
    f0?: number;
    f1?: number;
    f2?: number;
  }
  interface Client {
    id?: number;
    nom: string;
  }
  interface DemandeEssai {
    id?: number;
    nomAuto?: string;
    numeroProjet?: number;

    statutGlobal?: statutGlobal;
    statutDemande?: StatutDemande;

    vehicule?: { id: number };
    cycle?: { id: number };
    calage?: { id: number };
    loi?: { id: number };

    typeProjet?: string;
    client?: { id: number; nom: string };

    demandeur?: string;
    technicienId?: number;

    banc?: string;
    datePlanification?: string;
    shift: "MATIN" | "SOIR" | "NUIT" | undefined;

    besoinMaceration?: boolean;
    temperatureMaceration?: number;
    temperatureEau?: number;
    hygrometrieEssai?: number;
    activationSTT?: boolean;
    temperatureEssai?: number;

    gestionBatterie12V?: string;
    socDepart12V?: number;

    activationClim?: boolean;
    temperatureRegulationClim?: number;
    chauffageHabitable?: boolean;

    typeEssai?: string;
    verificationCoastDown?: boolean;
    nombreDecelerations?: number;
    commentaire?: string;

    mesureSAC?: boolean;
    debitCVsPhase1?: number;
    debitCVsPhase2?: number;
    debitCVsPhase3?: number;
    debitCVsPhase4?: number;
    debitCVsPhase5?: number;
    debitCVsPhase6?: number;
    debitCVsPhase7?: number;
    debitCVsPhase8?: number;
    debitCVsPhase9?: number;
    debitCVsPhase10?: number;

    pm?: boolean;
    debitPrelevement?: number;

    pn10Nano?: boolean;
    facteurDilutionPN10?: number;

    pn23Nano?: boolean;
    facteurDilutionPN23?: number;

    ligne1?: boolean;
    pointPrelevementL1?: string;

    ligne2?: boolean;
    pointPrelevementL2?: string;

    ligne3?: boolean;
    pointPrelevementL3?: string;

    microsot?: boolean;
    pointPrelevementMicrosot?: string;

    qcl1?: boolean;
    pointPrelevementQCL1?: string;

    qcl2?: boolean;
    pointPrelevementQCL2?: string;

    fitr?: boolean;
    pointPrelevementFITR?: string;

    egr?: boolean;

    xcu1?: boolean;
    software1?: string;
    calibration1?: string;
    experiment1?: string;

    xcu2?: boolean;
    software2?: string;
    calibration2?: string;

    xcu3?: boolean;
    software3?: string;
    calibration3?: string;

    acquisitionEOBD?: boolean;
    typeAcquisition?: string;

    mesureCourant?: boolean;

    capot?: "OUVERT" | "FERME";
    soufflante?: string;
    qcvs?: number;
    carflow?: boolean;

    mesureTension?: boolean;
    thermocouples?: boolean;
    sondeLambdaLA4?: boolean;

    mesures?: MesureDTO[];

    software1FileName?: string;
    software1FilePath?: string;
    calibration1FileName?: string;
    calibration1FilePath?: string;
    experiment1FileName?: string;
    experiment1FilePath?: string;
    software2FileName?: string;
    software2FilePath?: string;
    calibration2FileName?: string;
    calibration2FilePath?: string;
    software3FileName?: string;
    software3FilePath?: string;
    calibration3FileName?: string;
    calibration3FilePath?: string;
  }

  const [form, setForm] = useState<Partial<DemandeEssaiForm>>({
    // ===== IDENTITÉ =====
    nomAuto: "",
    numeroProjet: undefined,
    statutGlobal: statutGlobal.PAS_FAIT,
    statutDemande: undefined,
    // ===== RELATIONS =====
    vehiculeId: undefined,
    cycleId: undefined,
    calageId: undefined,
    loiId: undefined,

    // ===== PROJET =====
    typeProjet: "",
    clientId: undefined,
    demandeur: "",
    technicienId: undefined,

    banc: "BANC_1",
    datePlanification: "",
    shift: undefined,

    // ===== CONDITIONS ESSAI =====
    besoinMaceration: false,
    temperatureMaceration: 0,
    temperatureEau: 0,
    hygrometrieEssai: 0,
    activationSTT: false,
    temperatureEssai: 0,

    // ===== BATTERIE / CLIM =====
    gestionBatterie12V: "",
    socDepart12V: 0,
    activationClim: false,
    temperatureRegulationClim: 0,
    chauffageHabitable: false,

    // ===== TYPE ESSAI =====
    typeEssai: "",
    verificationCoastDown: false,
    nombreDecelerations: 0,
    commentaire: "",

    // ===== SAC =====
    mesureSAC: false,
    debitCVsPhase1: 0,
    debitCVsPhase2: 0,
    debitCVsPhase3: 0,
    debitCVsPhase4: 0,
    debitCVsPhase5: 0,
    debitCVsPhase6: 0,
    debitCVsPhase7: 0,
    debitCVsPhase8: 0,
    debitCVsPhase9: 0,
    debitCVsPhase10: 0,

    // ===== PM / PN =====
    pm: false,
    debitPrelevement: 0,
    pn10Nano: false,
    facteurDilutionPN10: 0,
    pn23Nano: false,
    facteurDilutionPN23: 0,

    // ===== GAZ BRUTS =====
    ligne1: false,
    pointPrelevementL1: "",
    ligne2: false,
    pointPrelevementL2: "",
    ligne3: false,
    pointPrelevementL3: "",
    microsot: false,
    pointPrelevementMicrosot: "",

    qcl1: false,
    pointPrelevementQCL1: "",
    qcl2: false,
    pointPrelevementQCL2: "",

    fitr: false,
    pointPrelevementFITR: "",
    egr: false,

    // ===== XCU =====
    xcu1: false,
    software1: "",
    calibration1: "",
    experiment1: "",

    xcu2: false,
    software2: "",
    calibration2: "",

    xcu3: false,
    software3: "",
    calibration3: "",

    acquisitionEOBD: false,
    typeAcquisition: "",

    // ===== MESURES COURANT =====
    mesureCourant: false,

    capot: "FERME",
    soufflante: "",
    qcvs: 0,
    carflow: false,

    mesureTension: false,
    thermocouples: false,
    sondeLambdaLA4: false,
  });
  const openModal = (mode: ModalMode, demande?: DemandeEssai) => {
    setModalMode(mode);
    setActiveTab("general");

    if (mode === "add") {
      setSelectedDemande(null);

      setForm({
        nomAuto: "",
        numeroProjet: undefined,
        statutGlobal: statutGlobal.PAS_FAIT,
        statutDemande: undefined,
        vehiculeId: undefined,
        cycleId: undefined,
        calageId: undefined,
        loiId: undefined,
        technicienId: demande?.technicienId,

        typeProjet: "",
        client: undefined,
        demandeur: "",
        banc: "BANC_1",
        datePlanification: "",
        shift: undefined,

        besoinMaceration: false,
        temperatureMaceration: 0,
        temperatureEau: 0,
        hygrometrieEssai: 0,
        activationSTT: false,
        temperatureEssai: 0,

        gestionBatterie12V: "",
        socDepart12V: 0,
        activationClim: false,
        temperatureRegulationClim: 0,
        chauffageHabitable: false,

        typeEssai: "",
        verificationCoastDown: false,
        nombreDecelerations: 0,
        commentaire: "",

        mesureSAC: false,
        pm: false,
        pn10Nano: false,
        pn23Nano: false,

        ligne1: false,
        ligne2: false,
        ligne3: false,
        microsot: false,
        egr: false,
        fitr: false,

        xcu1: false,
        xcu2: false,
        xcu3: false,
        acquisitionEOBD: false,
        qcvs: 0,
        carflow: false,
        mesureCourant: false,
        mesureTension: false,
        thermocouples: false,
        sondeLambdaLA4: false,
      });
      setMesuresRows({
        mesureCourant:
          demande?.mesures
            ?.filter((m) => m.type === "COURANT")
            .map((m) => ({
              id: m.id,
              indice: String(m.indice ?? ""),
              numero: String(m.numero ?? ""),
              type: m.sousType ?? "",
            })) ?? [],

        mesureTension:
          demande?.mesures
            ?.filter((m) => m.type === "TENSION")
            .map((m) => ({
              id: m.id,
              indice: String(m.indice ?? ""),
              numero: String(m.numero ?? ""),
              type: m.sousType ?? "",
            })) ?? [],

        thermocouples:
          demande?.mesures
            ?.filter((m) => m.type === "THERMOCOUPLE")
            .map((m) => ({
              id: m.id,
              indice: String(m.indice ?? ""),
              numero: String(m.numero ?? ""),
              type: m.sousType ?? "",
            })) ?? [],

        sondeLambdaLA4:
          demande?.mesures
            ?.filter((m) => m.type === "SONDE_LAMBDA")
            .map((m) => ({
              id: m.id,
              indice: String(m.indice ?? ""),
              numero: String(m.numero ?? ""),
              type: m.sousType ?? "",
            })) ?? [],
      });
      setShowModal(true);
      return;
    }

    // VIEW / EDIT
    if (demande) {
      setSelectedDemande(demande);

      setForm({
        ...demande,
        vehiculeId: demande.vehicule?.id,
        cycleId: demande.cycle?.id,
        calageId: demande.calage?.id,
        loiId: demande.loi?.id,
        clientId: demande.client?.id,
        mesureCourant: demande.mesureCourant ?? false,
        mesureTension: demande.mesureTension ?? false,
        thermocouples: demande.thermocouples ?? false,
        sondeLambdaLA4: demande.sondeLambdaLA4 ?? false,
      });
      setMesuresRows({
        mesureCourant:
          demande.mesures
            ?.filter((m) => m.type === TypeMesureAux.COURANT)
            .map((m) => ({
              id: m.id,
              indice: m.indice?.toString() || "",
              numero: m.numero?.toString() || "",
              type: m.sousType || "",
            })) ?? [],

        mesureTension:
          demande.mesures
            ?.filter((m) => m.type === TypeMesureAux.TENSION)
            .map((m) => ({
              id: m.id,
              indice: m.indice?.toString() || "",
              numero: m.numero?.toString() || "",
              type: m.sousType || "",
            })) ?? [],

        thermocouples:
          demande.mesures
            ?.filter((m) => m.type === TypeMesureAux.THERMOCOUPLE)
            .map((m) => ({
              id: m.id,
              indice: m.indice?.toString() || "",
              numero: m.numero?.toString() || "",
              type: m.sousType || "",
            })) ?? [],

        sondeLambdaLA4:
          demande.mesures
            ?.filter((m) => m.type === TypeMesureAux.SONDE_LAMBDA)
            .map((m) => ({
              id: m.id,
              indice: m.indice?.toString() || "",
              numero: m.numero?.toString() || "",
              type: m.sousType || "",
            })) ?? [],
      });

      setShowModal(true);
    }
  };
  const removeRow = (type: MesureKey, index: number) => {
    setMesuresRows((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };
  const ensureRowExists = (type: MesureKey) => {
    setMesuresRows((prev) => {
      if (prev[type].length > 0) return prev;
      return {
        ...prev,
        [type]: [{ indice: "", numero: "", type: "" }],
      };
    });
  };

  const getFileUrl = (filePath?: string | null): string | null => {
    if (!filePath) return null;

    const match = filePath.match(/(?:inca|traces)[/\\].+$/);
    if (!match) return null;

    const cleanPath = match[0].replace(/\\/g, "/");
    return `http://localhost:8080/uploads/${cleanPath}`;
  };

  const FileDisplay = ({
    label,
    fileName,
    filePath,
  }: {
    label: string;
    fileName?: string | null;
    filePath?: string | null;
  }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
        {label}
      </label>
      {fileName ? (
        <a
          href={getFileUrl(filePath) ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full text-xs border border-green-200 bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition text-left"
        >
          <span>📎</span>
          <span className="truncate flex-1">{fileName}</span>
          <span className="text-[10px] shrink-0 underline">👁 Voir</span>
        </a>
      ) : (
        <div className="w-full text-xs border border-dashed border-border text-muted-foreground p-2 rounded-lg">
          Aucun fichier
        </div>
      )}
    </div>
  );

  const buildMesures = (key: MesureKey, type: TypeMesureAux): MesureDTO[] =>
    mesuresRows[key]
      .filter((row) => row.indice || row.numero || row.type)
      .map((row) => ({
        ...(row.id ? { id: row.id } : {}), // ✅ conserver l'id si présent
        type,
        indice: row.indice ? Number(row.indice) : undefined,
        numero: row.numero ? Number(row.numero) : undefined,
        sousType: row.type ? (row.type as TypeMusure) : undefined,
      }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? value === ""
              ? undefined
              : parseFloat(value)
            : value,
    }));

    const mesureKeys = [
      "mesureCourant",
      "mesureTension",
      "thermocouples",
      "sondeLambdaLA4",
    ];

    if (type === "checkbox" && mesureKeys.includes(name)) {
      const key = name as MesureKey;
      setMesuresRows((prev) => {
        const alreadyExists = prev[key]?.length > 0;

        return {
          ...prev,
          [key]: checked
            ? alreadyExists
              ? prev[key]
              : [{ indice: "", numero: "", type: "" }]
            : [],
        };
      });
    }
  };

  const getTechnicienName = (id?: number) => {
    const tech = techniciens.find((t) => t.id === id);
    return tech ? `${tech.nom} ${tech.prenom}` : "";
  };

  const addRow = (type: MesureKey) => {
    setMesuresRows((prev) => ({
      ...prev,
      [type]: [...prev[type], { indice: "", numero: "", type: "" }],
    }));
  };

  const updateRow = (
    type: MesureKey,
    index: number,
    field: keyof MesureRow,
    value: string,
  ) => {
    setMesuresRows((prev) => {
      // Si tableau vide, créer d'abord une ligne vide
      const currentRows =
        prev[type].length === 0
          ? [{ indice: "", numero: "", type: "" as TypeMusure | "" }]
          : prev[type];

      return {
        ...prev,
        [type]: currentRows.map((row, i) =>
          i === index ? { ...row, [field]: value } : row,
        ),
      };
    });
  };

  // ✅ Handler unifié pour tous les fichiers
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof files,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleNextTab = () => {
    const form = document.getElementById("demandeForm") as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    fetchDemandes();
    fetchVehicules();
    fetchCycles();
    fetchCalages();
    fetchLoisRoute();
    fetchActiveClients();
    fetchAllClients();
  }, []);
  const fetchActiveClients = async () => {
    try {
      const data = await authFetch("/clients/actifs/dto");
      setActiveClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement clients actifs", error);
    }
  };
  const fetchAllClients = async () => {
    try {
      const data = await authFetch("/clients/ClientDTO");
      setAllClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement tous clients", error);
    }
  };
  const fetchCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement cycles", error);
    }
  };

  const fetchCalages = async () => {
    try {
      const data = await authFetch("/calages");
      setCalages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement calages", error);
    }
  };

  const fetchLoisRoute = async () => {
    try {
      const data = await authFetch("/lois-route");
      setLoisRoute(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement lois de route", error);
    }
  };

  // Fonction pour revenir à l'onglet précédent (optionnel mais recommandé)
  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const filteredDemandes = useMemo(() => {
    return demandes.filter((d) => {
      const nomAuto = (d.nomAuto ?? "").toLowerCase();

      const demandeur = (d.demandeur ?? "").toLowerCase();
      const projet = String(d.numeroProjet ?? "").toLowerCase();
      const statutGlobal = (d.statutGlobal ?? "").toLowerCase().trim();
      const validation = String(d.statutDemande ?? "");
      const shift = (d.shift ?? "").toLowerCase().trim();
      const client = String(d.client ?? "")
        .toLowerCase()
        .trim();
      const date = d.datePlanification?.slice(0, 10) ?? "";

      const matchSearch = !search || nomAuto.includes(search.toLowerCase());

      const matchDemandeur =
        !filterDemandeur || demandeur.includes(filterDemandeur.toLowerCase());

      const matchProjet =
        !filterProjet || projet.includes(filterProjet.toLowerCase());

      const matchStatutGlobal =
        !filterStatutGlobal ||
        statutGlobal === filterStatutGlobal.toLowerCase().trim();

      const matchShift =
        !filterShift || shift === filterShift.toLowerCase().trim();

      const matchDate = !filterDate || date === filterDate;

      const matchValidation =
        !filterValidation || d.statutDemande === filterValidation;

      const matchesClient =
        clientFilter === "Tous" || d.client?.id === Number(clientFilter);
      return (
        matchSearch &&
        matchesClient &&
        matchDemandeur &&
        matchProjet &&
        matchStatutGlobal &&
        matchShift &&
        matchDate &&
        matchValidation
      );
    });
  }, [
    demandes,
    search,
    clientFilter,
    filterDemandeur,
    filterProjet,
    filterStatutGlobal,
    filterShift,
    filterDate,
    filterValidation,
  ]);

  useEffect(() => {
    if (
      (modalMode !== "add" && modalMode !== "edit") ||
      !form.typeProjet ||
      !form.demandeur ||
      !form.vehiculeId ||
      !form.cycleId ||
      vehicules.length === 0 ||
      cycles.length === 0
    ) {
      return;
    }

    const vehicule = vehicules.find(
      (v) => Number(v.id) === Number(form.vehiculeId),
    );

    const cycle = cycles.find((c) => Number(c.id) === Number(form.cycleId));

    const vehiculeNom =
      vehicule?.nomAppliImmat ||
      vehicule?.identificateur ||
      vehicule?.nomAuto ||
      vehicule?.codeInterne ||
      `VEH${form.vehiculeId}`;

    const cycleNom = cycle?.nom || `CYCLE${form.cycleId}`;

    const vehiculeClean = vehiculeNom.replace(/\s+/g, "_");
    const cycleClean = cycleNom.replace(/\s+/g, "_");
    const demandeurClean = form.demandeur.replace(/\s+/g, "_");

    const prefix = `${form.typeProjet}_${demandeurClean}_${vehiculeClean}_${cycleClean}`;

    const demandesSimilaires = demandes.filter((d) =>
      d.nomAuto?.includes(prefix),
    );

    let max = 0;
    demandesSimilaires.forEach((d) => {
      const dernier = d.nomAuto?.split("_").pop();
      const numero = parseInt(dernier, 10);
      if (!isNaN(numero) && numero > max) {
        max = numero;
      }
    });

    const increment = String(max + 1).padStart(3, "0");

    const nouveauNom = `${prefix}_${increment}`;

    if (form.nomAuto !== nouveauNom) {
      setForm((prev) => ({
        ...prev,
        nomAuto: nouveauNom,
      }));
    }
  }, [
    form.typeProjet,
    form.vehiculeId,
    form.cycleId,
    form.demandeur,
    vehicules,
    cycles,
    demandes,
    modalMode,
  ]);

  const tabs = [
    { id: "general", label: "Informations générales" },
    { id: "vehicle", label: "Véhicule/Calage" },
    { id: "gazDilues", label: "Gaz dilués" },
    { id: "gazBruts", label: "Gaz bruts" },
    { id: "inca", label: "Données INCA" },
    { id: "mesuresAux", label: "Mesures auxiliaires" },
  ];

  // etc.
  // Fonction pour récupérer les véhicules
  const fetchVehicules = async () => {
    try {
      const data = await authFetch("/vehicules"); // Remplacez par votre endpoint réel
      setVehicules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement véhicules", error);
    }
  };

  useEffect(() => {
    if (form.vehiculeId) {
      authFetch(`/vehicules/${form.vehiculeId}`)
        .then(setVehiculeDetails)
        .catch(console.error);
    } else {
      setVehiculeDetails(null);
    }
  }, [form.vehiculeId]);

  useEffect(() => {
    if (form.calageId) {
      authFetch(`/calages/${form.calageId}`)
        .then(setCalageDetails)
        .catch(console.error);
    } else {
      setCalageDetails(null);
    }
  }, [form.calageId]);

  useEffect(() => {
    if (form.loiId) {
      authFetch(`/lois-route/${form.loiId}`)
        .then(setLoiDetails)
        .catch(console.error);
    } else {
      setLoiDetails(null);
    }
  }, [form.loiId]);
  useEffect(() => {
    if (form.cycleId) {
      authFetch(`/cycles/${form.cycleId}`)
        .then((data) => {
          setCycleDetails(data);
        })
        .catch(console.error);
    }
  }, [form.cycleId]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await authFetch("/demandes-essai");
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDemande = async (id: number) => {
    try {
      await authFetch(`/demandes-essai/${id}`, {
        method: "DELETE",
      });

      setDemandes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Demande supprimée avec succès");
    } catch (error: any) {
      console.error("Erreur suppression :", error);

      const isConstraint =
        error?.message?.includes("constraint") ||
        error?.message?.includes("foreign key");

      const message = isConstraint
        ? "Suppression impossible : cette demande est liée à d'autres données."
        : "Erreur lors de la suppression de la demande.";

      toast.error(message);
    }
  };

  const duplicateDemande = async (id: number) => {
    try {
      const newDemande: DemandeEssai = await authFetch(
        `/demandes-essai/${id}/duplicate`,
        { method: "POST" },
      );

      setDemandes((prev) => [newDemande, ...prev]);
      toast.success("Demande dupliquée avec succès");
    } catch (error) {
      console.error("Erreur duplication :", error);
      toast.error("Erreur lors de la duplication");
    }
  };
  const getStatutStyle = (status?: string) => {
    switch (status) {
      case "FAIT":
        return "bg-[#E8F5E9] text-[#2E7D32]";
      case "EN_COURS":
        return "bg-[#FFF9C4] text-[#FBC02D]";
      case "PAS_FAIT":
        return "bg-[#FFEBEE] text-[#C62828]";
      default:
        return "bg-gray-100 text-muted-foreground-600";
    }
  };

  const handleSubmit = async () => {
    try {
      // ✅ Transformer les mesures en tableau backend propre

      // ✅ PAYLOAD PROPRE (IMPORTANT : PAS de vehicule/cycle objets)
      const payload = {
        id: selectedDemande?.id,

        vehiculeId: form.vehiculeId,
        cycleId: form.cycleId,
        calageId: form.calageId,
        loiId: form.loiId,
        clientId: form.clientId,
        technicienId: form.technicienId,

        nomAuto: form.nomAuto,
        numeroProjet: form.numeroProjet,

        statutGlobal: form.statutGlobal,
        statutDemande: form.statutDemande,

        typeProjet: form.typeProjet,
        demandeur: form.demandeur,

        banc: form.banc,
        datePlanification: form.datePlanification,
        shift: form.shift,

        // conditions essai
        besoinMaceration: form.besoinMaceration,
        temperatureMaceration: form.temperatureMaceration,
        temperatureEau: form.temperatureEau,
        hygrometrieEssai: form.hygrometrieEssai,
        activationSTT: form.activationSTT,
        temperatureEssai: form.temperatureEssai,

        // autres champs
        gestionBatterie12V: form.gestionBatterie12V,
        socDepart12V: form.socDepart12V,
        activationClim: form.activationClim,
        temperatureRegulationClim: form.temperatureRegulationClim,
        chauffageHabitable: form.chauffageHabitable,

        typeEssai: form.typeEssai,
        verificationCoastDown: form.verificationCoastDown,
        nombreDecelerations: form.nombreDecelerations,
        commentaire: form.commentaire,

        mesureSAC: form.mesureSAC,
        pm: form.pm,
        debitPrelevement: form.debitPrelevement,

        pn10Nano: form.pn10Nano,
        facteurDilutionPN10: form.facteurDilutionPN10,

        pn23Nano: form.pn23Nano,
        facteurDilutionPN23: form.facteurDilutionPN23,

        ligne1: form.ligne1,
        pointPrelevementL1: form.pointPrelevementL1,

        ligne2: form.ligne2,
        ligne3: form.ligne3,

        qcl1: form.qcl1,
        qcl2: form.qcl2,
        fitr: form.fitr,
        egr: form.egr,

        xcu1: form.xcu1,
        xcu2: form.xcu2,
        xcu3: form.xcu3,

        acquisitionEOBD: form.acquisitionEOBD,
        typeAcquisition: form.typeAcquisition,

        mesureCourant: form.mesureCourant,
        mesureTension: form.mesureTension,
        thermocouples: form.thermocouples,
        sondeLambdaLA4: form.sondeLambdaLA4,

        capot: form.capot,
        soufflante: form.soufflante,
        qcvs: form.qcvs,
        carflow: form.carflow,
        pointPrelevementL2: form.pointPrelevementL2,
        pointPrelevementL3: form.pointPrelevementL3,
        microsot: form.microsot,
        debitCVsPhase1: form.debitCVsPhase1,
        debitCVsPhase2: form.debitCVsPhase2,
        debitCVsPhase3: form.debitCVsPhase3,
        debitCVsPhase4: form.debitCVsPhase4,
        debitCVsPhase5: form.debitCVsPhase5,
        debitCVsPhase6: form.debitCVsPhase6,
        debitCVsPhase7: form.debitCVsPhase7,
        debitCVsPhase8: form.debitCVsPhase8,
        debitCVsPhase9: form.debitCVsPhase9,
        debitCVsPhase10: form.debitCVsPhase10,

        pointPrelevementMicrosot: form.pointPrelevementMicrosot,

        pointPrelevementQCL1: form.pointPrelevementQCL1,
        pointPrelevementQCL2: form.pointPrelevementQCL2,

        pointPrelevementFITR: form.pointPrelevementFITR,
        mesures: [
          ...buildMesures("mesureCourant", TypeMesureAux.COURANT),
          ...buildMesures("mesureTension", TypeMesureAux.TENSION),
          ...buildMesures("thermocouples", TypeMesureAux.THERMOCOUPLE),
          ...buildMesures("sondeLambdaLA4", TypeMesureAux.SONDE_LAMBDA),
        ],
      };

      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );

      if (files.software1) formData.append("software1", files.software1);
      if (files.calibration1)
        formData.append("calibration1", files.calibration1);
      if (files.experiment1) formData.append("experiment1", files.experiment1);

      if (files.software2) formData.append("software2", files.software2);
      if (files.calibration2)
        formData.append("calibration2", files.calibration2);

      if (files.software3) formData.append("software3", files.software3);
      if (files.calibration3)
        formData.append("calibration3", files.calibration3);

      if (isSubmitting) return;
      if (modalMode === "edit" && selectedDemande?.id) {
        const updated = await authFetch(
          `/demandes-essai/${selectedDemande.id}`,
          {
            method: "PUT",
            body: formData,
          },
        );

        setDemandes((prev) =>
          prev.map((d) => (d.id === selectedDemande.id ? updated : d)),
        );

        toast.success("Demande modifiée avec succès");
      } else {
        const created = await authFetch("/demandes-essai", {
          method: "POST",
          body: formData,
        });
        setDemandes((prev) => [created, ...prev]);
        toast.success("Demande créée avec succès");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const validateTab = (tab: string): boolean => {
    if (!formRef.current) return false;

    const form = formRef.current;

    // récupérer uniquement les champs visibles de l'onglet
    const inputs = form.querySelectorAll(
      `[data-tab="${tab}"] input,
     [data-tab="${tab}"] select,
     [data-tab="${tab}"] textarea`,
    );

    for (const input of inputs) {
      if (!(input as HTMLInputElement).checkValidity()) {
        (input as HTMLInputElement).reportValidity();
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!selectedDemande?.id) return;

    try {
      const payload = {
        ...form,
        vehicule: form.vehiculeId ? { id: form.vehiculeId } : undefined,
        cycle: form.cycleId ? { id: form.cycleId } : undefined,
        calage: form.calageId ? { id: form.calageId } : undefined,
        loi: form.loiId ? { id: form.loiId } : undefined,
      };

      const updated = await authFetch(`/demandes-essai/${selectedDemande.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setDemandes((prev) =>
        prev.map((d) =>
          d.id === updated.id
            ? {
                ...d,
                ...updated,
                vehicule: d.vehicule,
                cycle: d.cycle,
                calage: d.calage,
                loi: d.loi,
              }
            : d,
        ),
      );

      toast.success("Demande mise à jour avec succès !");
      setShowModal(false);
      setSelectedDemande(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
        setUserClient(user.client?.nom ?? "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchTechnicienEssaiByClient = async () => {
    try {
      const data = await authFetch("/users/techniciens");
      return data;
    } catch (error) {
      console.error("Erreur chargement technicien essai client", error);
      return [];
    }
  };
  useEffect(() => {
    const loadTechniciens = async () => {
      const data = await fetchTechnicienEssaiByClient();
      setTechniciens(data);
    };

    loadTechniciens();
  }, []);

  const fetchTechniciens = async () => {
    try {
      const data = await authFetch("/users/technicien-essai/client");
      setTechniciens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement techniciens", error);
    }
  };
  useEffect(() => {
    if (showModal) {
      fetchTechniciens();
    }
  }, [showModal]);
  useEffect(() => {
    if (showModal) {
      fetchTechniciens();
    }
  }, [showModal, form.client]);
  return (
    <div className="p-3 space-y-5 bg-gray-10 min-h-screen">
      <div className="flex items-center justify-between">
        {/* Titre + description */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Gestion des demandes d'essai
          </h1>
          <p className="text-muted-foreground">Gérer vos demandes d'essai</p>
        </div>
        {canEdit && (
          <button
            onClick={() => openModal("add")}
            className="h-11 px-6 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus size={18} /> Ajouter une demande
          </button>
        )}
      </div>
      {/* --- BARRE DE FILTRES MULTIPLES AMÉLIORÉE --- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-card p-4 rounded-xl shadow-md">
        {/* Recherche par nom */}
        <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-ring transition">
          <Search size={16} className="text-muted-foreground-400" />
          <input
            placeholder="Nom de la demande..."
            className="outline-none w-full text-sm text-muted-foreground-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) => role?.includes(r)) && (
          <select
            className="bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="Tous">Client (Tous)</option>

            {allClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        )}

        {/* Filtre Demandeur */}
        <input
          placeholder="Nom du demandeur..."
          className="bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
          value={filterDemandeur}
          onChange={(e) => setFilterDemandeur(e.target.value)}
        />

        {/* Filtre Projet */}
        <input
          placeholder="N° de projet..."
          className="bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
          value={filterProjet}
          onChange={(e) => setFilterProjet(e.target.value)}
        />

        {/* Filtre Statut */}
        <select
          className="bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
          value={filterStatutGlobal}
          onChange={(e) => setFilterStatutGlobal(e.target.value)}
        >
          <option value="">Tous les statuts</option>

          <option value="EN_COURS">En cours</option>
          <option value="FAIT">Fait</option>
          <option value="PAS_FAIT">Pas fait</option>
        </select>

        {/* Filtre Validation */}
        <select
          className="bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
          value={filterValidation}
          onChange={(e) => setFilterValidation(e.target.value)}
        >
          <option value="">Validation (Tous)</option>
          <option value={StatutDemande.EN_CREATION}>En création</option>
          <option value={StatutDemande.VALIDE}>Validé</option>
        </select>

        {/* Filtre Date */}
        <div className="flex items-center bg-background border border-border rounded-lg px-3 py-3 gap-2 focus-within:ring-2 focus-within:ring-ring transition">
          <Calendar size={16} className="text-muted-foreground" />
          <input
            type="date"
            className="outline-none w-full text-sm text-muted-foreground-700"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm text-left border-collapse">
          {/* Header */}
          <thead className="bg-[#B9032C] border-b border-border">
            <tr>
              <th className="px-8 py-5 font-semibold text-white">
                Nom de demande d'essai
              </th>
              <th className="px-2 py-5 font-semibold text-white">
                N° de Projet
              </th>
              <th className="px-5 py-5 font-semibold text-white">Client</th>
              <th className="px-4 py-5 font-semibold text-white">Demandeur</th>
              <th className="px-3 py-5 font-semibold text-white">Validation</th>
              <th className="px-5 py-5 font-semibold text-white">Statut</th>
              <th className="px-3 py-5 font-semibold text-white">Date</th>
              <th className="px-5 py-5 font-semibold text-white">Shift</th>
              <th className="px-10 py-5 text-right font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
            {/* On active le mode transparent ici */}
            <DialogContent className="max-w-md" hideOverlay={true}>
              <DialogHeader>
                <DialogTitle>Confirmation de suppression</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-muted-foreground-700">
                Voulez-vous vraiment supprimer le véhicule{" "}
                <span className="font-bold">{selectedDemande?.nomAuto}</span> ?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Non
                </button>
                <button
                  onClick={() => {
                    if (selectedDemande?.id != null) {
                      deleteDemande(selectedDemande.id);
                    }
                    setShowConfirmDelete(false);
                    setSelectedDemande(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirmer suppression
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Chargement des demandes...
                </td>
              </tr>
            ) : filteredDemandes.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-muted-foreground-500 font-medium"
                >
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              filteredDemandes.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-sm text-foreground">
                    {d.nomAuto}
                  </td>

                  <td className="px-3 py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">
                      {d.numeroProjet}
                    </div>
                  </td>

                  <td className="px-2 py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">
                      {d.client?.nom}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">{d.demandeur}</div>
                  </td>

                  <td>
                    <span
                      className={`px-1 py-1 rounded-lg font-bold shadow-sm ${getStatutStyle(
                        d?.statutGlobal,
                      )}`}
                    >
                      {d.statutGlobal}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">
                      {d.statutDemande}
                    </div>
                  </td>

                  <td className="py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">
                      {d.datePlanification}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground-800">
                    <div className="flex items-center gap-2">{d.shift}</div>
                  </td>

                  {/* Actions */}
                  <td className="px-1 py-4">
                    <div className="flex items-center gap-2">
                      {/* Voir */}

                      {canEdit && (
                        <>
                          {/* Modifier */}
                          <button
                            onClick={() => openModal("edit", d)}
                            className="p-1 rounded-lg bg-green-100 hover:bg-green-200"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>

                          {/* Dupliquer */}
                          <button
                            onClick={() => d.id && duplicateDemande(d.id)}
                            className="p-1 rounded-lg bg-gray-200 hover:bg-gray-400"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground-700" />
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() => {
                              setSelectedDemande(d);
                              setShowConfirmDelete(true);
                            }}
                            className="p-1 rounded-lg bg-red-100 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openModal("view", d)}
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-[700px] max-h-[95vh] overflow-hidden rounded-xl flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b bg-card">
              <h2 className="text-xl font-bold text-foreground">
                {modalMode === "view"
                  ? "Visualiser une demande d'essai"
                  : modalMode === "edit"
                    ? "Modifier une demande d'essai"
                    : "Créer une demande d'essai"}
              </h2>
              <X
                className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
                size={30}
                onClick={() => setShowModal(false)}
              />
            </div>

            {/* Onglets */}
            <div className="flex border-b bg-card sticky top-0 z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!validateTab(activeTab)) {
                      return;
                    }

                    setActiveTab(tab.id);
                  }}
                  className={`px-6 py-3 font-semibold text-sm transition ${
                    activeTab === tab.id
                      ? "border-b-4 border-[#E30613]/50 text-foreground"
                      : "text-muted-foreground-500 "
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}

            <div className="flex-1 overflow-y-auto px-8 py-6 bg-card min-h-[70vh]">
              {" "}
              {/* --- ONGLET GÉNÉRAL (Données génériques de la demande) --- */}
              <form
                id="demandeForm"
                onSubmit={handleSubmit}
                className="space-y-6 animate-in fade-in pb-6"
              >
                {activeTab === "general" && (
                  <div className="space-y-8 animate-in fade-in pb-6">
                    {" "}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Véhicule */}

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Véhicule
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="vehiculeId"
                          disabled={isView}
                          value={form.vehiculeId ?? ""}
                          required
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner un véhicule</option>
                          {vehicules.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.nomAppliImmat ||
                                v.identificateur ||
                                `Véhicule ${v.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cycle de conduite */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Cycle
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="cycleId"
                          disabled={isView}
                          value={form.cycleId ?? ""}
                          required
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner un cycle</option>
                          {cycles.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nom || `Cycle ${c.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Calage */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Calage
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="calageId"
                          value={form.calageId ?? ""}
                          required
                          disabled={isView}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner un calage</option>
                          {calages.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nom || `Calage ${c.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Loi de route */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Loi de route
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="loiId"
                          value={form.loiId ?? ""}
                          required
                          disabled={isView}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner une loi</option>
                          {loisRoute.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.nom || `Loi de route ${l.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Type de projet
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="typeProjet"
                          value={form.typeProjet ?? ""}
                          required
                          disabled={isView}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner</option>
                          <option value="COP">COP</option>
                          <option value="ISC">ISC</option>
                        </select>
                      </div>
                      {/* Nom (auto-généré) */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Nom de la demande
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          name="requestName"
                          disabled={isView}
                          value={form.nomAuto}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          readOnly
                        />
                      </div>

                      {/* Statut (auto-défini) */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Statut
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="statutDemande"
                          required
                          disabled={isView}
                          value={form.statutDemande}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Sélectionner statut</option>
                          <option value={StatutDemande.VALIDE}>VALIDE</option>

                          <option value={StatutDemande.EN_CREATION}>
                            En création
                          </option>
                        </select>
                      </div>

                      {/* Demandeur */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Demandeur
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          type="text"
                          name="demandeur"
                          value={form.demandeur}
                          required
                          disabled={isView}
                          onChange={handleChange}
                          placeholder="Entrer le nom du demandeur"
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        />
                      </div>

                      {/* client */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Client <span className="text-red-500 ml-1">*</span>
                        </label>

                        <select
                          name="clientId"
                          value={form.clientId ?? ""}
                          required
                          onChange={handleChange}
                          disabled={modalMode === "view"}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="" disabled>
                            Sélectionner un client
                          </option>
                          {activeClients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Technicien d'essai
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="technicienId"
                          required
                          disabled={isView}
                          value={form.technicienId ?? ""}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="">Choisir technicien</option>

                          {techniciens.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nom} {t.prenom}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Banc */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground-700">
                          Banc
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="banc"
                          required
                          value={form.banc}
                          disabled={isView}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                        >
                          <option value="BANC_1">BANC_1</option>
                        </select>
                        <p className="text-xs text-muted-foreground-500">
                          Un seul banc disponible actuellement
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          N° Projet <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="number"
                          name="numeroProjet"
                          disabled={isView}
                          value={form.numeroProjet ?? ""}
                          onChange={handleChange}
                          className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          required
                        />
                      </div>
                    </div>
                    {/* Section Date et Shift (transition vers onglet suivant) */}
                    <div className="border-t pt-6 mt-4">
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-4">
                        Planification
                        <span className="text-red-500 ml-1">*</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground-700">
                            Date de l'essai
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            disabled={isView}
                            name="datePlanification"
                            value={form.datePlanification}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground-700">
                            Shift
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            name="shift"
                            disabled={isView}
                            value={form.shift}
                            required
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          >
                            <option value="">Sélectionner</option>
                            <option value="MATIN">MATIN</option>
                            <option value="APRES_MIDI">Après-midi</option>
                            <option value="NUIT">NUIT</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <section className=" p-6 rounded-xl border ">
                      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                        Conditions d'Essai
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Macération */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              name="besoinMaceration"
                              disabled={isView}
                              checked={form.besoinMaceration}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-700"
                            />
                            Besoin macération
                          </label>
                          {form.besoinMaceration && (
                            <div className="space-y-3 pl-6 animate-in zoom-in-95">
                              <div>
                                <label className="text-xs text-muted-foreground-600">
                                  Température macération (°C)
                                </label>
                                <input
                                  name="temperatureMaceration"
                                  type="number"
                                  disabled={isView}
                                  value={form.temperatureMaceration}
                                  onChange={handleChange}
                                  className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                                  placeholder="Ex: 23"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Température eau */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs">
                            Température d'eau (°C)
                          </label>
                          <input
                            name="temperatureEau"
                            type="number"
                            disabled={isView}
                            value={form.temperatureEau}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                            placeholder="Ex: 90"
                          />
                        </div>

                        {/* Température et Hygrométrie */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs">
                            Température ambiante (°C)
                          </label>
                          <input
                            name="temperatureEssai"
                            type="number"
                            disabled={isView}
                            value={form.temperatureEssai}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                            placeholder="Ex: 23"
                          />
                          <label className="flex items-center gap-2 font-bold text-xs mt-2">
                            Hygrométrie (%)
                          </label>
                          <input
                            name="hygrometrieEssai"
                            type="number"
                            disabled={isView}
                            value={form.hygrometrieEssai}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                            placeholder="Ex: 50"
                          />
                        </div>

                        {/* STT */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs cursor-pointer text-foreground-700">
                            <input
                              type="checkbox"
                              name="activationSTT"
                              disabled={isView}
                              checked={form.activationSTT}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-700"
                            />
                            Activation STT
                          </label>
                        </div>

                        {/* Gestion batterie 12V */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs">
                            Gestion batterie 12V
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            name="gestionBatterie12V"
                            required
                            disabled={isView}
                            value={form.gestionBatterie12V ?? ""}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          >
                            <option value="">Sélectionner</option>
                            <option value="CHARGEMENT_BATTERIE">
                              Chargement
                            </option>
                            <option value="BBN">BBN</option>
                          </select>

                          <label className="flex items-center gap-2 font-bold text-xs mt-2">
                            SOC départ 12V (%)
                          </label>
                          <input
                            name="socDepart12V"
                            type="number"
                            disabled={isView}
                            value={form.socDepart12V}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                            placeholder="Ex: 80"
                          />
                        </div>

                        {/* Climatisation */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              name="activationClim"
                              disabled={isView}
                              checked={form.activationClim}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-700"
                            />
                            Activation Clim
                          </label>

                          {form.activationClim && (
                            <div className="mt-2">
                              <label className="text-xs text-muted-foreground-600">
                                Température régulation (°C)
                              </label>
                              <input
                                name="temperatureRegulationClim"
                                type="number"
                                disabled={isView}
                                value={form.temperatureRegulationClim ?? ""}
                                onChange={handleChange}
                                className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                                placeholder="Ex: 80"
                              />
                            </div>
                          )}
                        </div>

                        {/* Chauffage habitacle */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              name="chauffageHabitable"
                              disabled={isView}
                              checked={form.chauffageHabitable}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-700"
                            />
                            Chauffage habitacle
                          </label>
                        </div>

                        {/* Type d'essai */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
                          <label className="flex items-center gap-2 font-bold text-xs">
                            Type d'essai
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            name="typeEssai"
                            disabled={isView}
                            value={form.typeEssai ?? ""}
                            required
                            onChange={(e) =>
                              setForm({
                                ...form,
                                typeEssai: e.target.value || undefined,
                              })
                            }
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          >
                            <option value="">Sélectionner</option>

                            <option value="TIRE_MACERATION">
                              TIRE_MACERATION
                            </option>
                            <option value="PRECON">PRECON</option>
                            <option value="CALAGE">CALAGE</option>
                            <option value="TIR_CHAUD">TIR_CHAUD</option>
                            <option value="ROULAGE">ROULAGE</option>
                          </select>
                        </div>

                        {/* Vérification Coast Down */}
                        <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm col-span-1">
                          <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              name="verificationCoastDown"
                              disabled={isView}
                              checked={form.verificationCoastDown}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-700"
                            />
                            Vérification Coast Down
                          </label>
                          {form.verificationCoastDown && (
                            <div className="mt-2">
                              <label className="text-xs text-muted-foreground-600">
                                Nombre de décélérations
                              </label>
                              <input
                                name="nombreDecelerations"
                                type="number"
                                disabled={isView}
                                value={form.nombreDecelerations ?? ""}
                                onChange={handleChange}
                                className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                                placeholder="Ex: 3"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                    {/* Commentaires */}
                    <section className="mt-6">
                      <label className="block text-sm font-bold text-muted-foreground-700 mb-2">
                        Commentaire{" "}
                        <span className="text-xs font-normal text-muted-foreground-500">
                          (Optionnel)
                        </span>
                      </label>
                      <textarea
                        name="commentaire"
                        value={form.commentaire}
                        onChange={handleChange}
                        disabled={isView}
                        rows={4}
                        className="w-full border border-border bg-background text-foreground rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        placeholder="Commentaires spécifiques pour le conducteur d'essai..."
                      ></textarea>
                    </section>
                  </div>
                )}
                {/* --- ONGLET COMPLÉMENTAIRE : CONFIGURATION BANC (Si inclus dans Mesures Aux ou dédié) --- */}
                {activeTab === "mesuresAux" && (
                  <div className="space-y-6">
                    {/* ... (Sondes Lambda déjà faites) ... */}

                    <section className="bg-card p-6 rounded-xl border border-border">
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-4 uppercase tracking-tight">
                        Configuration Physique du Banc
                      </h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground-500">
                            Capot
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            name="capot"
                            value={form.capot}
                            required
                            disabled={isView}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          >
                            <option value="">Sélectionner</option>
                            <option value="FERME">Fermé</option>
                            <option value="OUVERT">Ouvert</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground-500">
                            Soufflante
                            <span className="text-red-500 ml-1">*</span>
                          </label>

                          <select
                            name="soufflante"
                            required
                            disabled={isView}
                            value={form.soufflante ?? ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                soufflante: e.target.value || undefined,
                              })
                            }
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          >
                            <option value="">Sélectionner</option>

                            <option value="VMAX_SYNCHRO">Vmax</option>
                            <option value="FIXE">Fixe</option>
                          </select>
                        </div>

                        {/* Q_CVS */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground-500">
                            Q_CVS
                          </label>
                          <input
                            type="text"
                            name="qcvs"
                            disabled={isView}
                            value={form.qcvs}
                            placeholder="Entrer la valeur"
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                          />
                        </div>

                        {/* Carflow */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="carflow"
                            disabled={isView}
                            className="w-4 h-4 accent-red-600"
                            checked={form.carflow}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                carflow: e.target.checked,
                              })
                            }
                          />
                          <label className="text-xs font-bold text-muted-foreground-500">
                            Carflow
                          </label>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
                {/* 2ème Onglet : Gaz Dilués */}
                {activeTab === "gazDilues" && (
                  <div className="space-y-8 animate-in fade-in p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-2  ml-3">
                      {/* Section 1 : Configuration CVS & Sacs */}
                      <section>
                        <div>
                          <h4 className="text-xs font-foreground text-foreground uppercase mb-4 flex items-center gap-2">
                            <Settings size={14} /> Configuration CVS & Phases
                          </h4>

                          <div className="p-4 bg-card border border-red-100 rounded-xl shadow-sm space-y-4">
                            <div
                              className={`flex items-center gap-3 pb-2 transition-colors ${
                                form.mesureSAC
                                  ? "border-b border-red-100 mb-4"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                id="mesureSAC"
                                name="mesureSAC"
                                disabled={isView}
                                checked={form.mesureSAC}
                                onChange={handleChange}
                                className="w-5 h-5 accent-red-600"
                              />
                              <label
                                htmlFor="mesureSAC"
                                className="text-sm font-black text-foreground uppercase cursor-pointer"
                              >
                                MESURE DES SACS
                              </label>
                            </div>

                            {form.mesureSAC && (
                              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                                <p className="col-span-2 text-[10px] font-bold text-foreground uppercase tracking-tight mb-1">
                                  Débits par Phase (m^3/min)
                                </p>

                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <div
                                    key={num}
                                    className="flex flex-col gap-1"
                                  >
                                    <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                      Phase {num}
                                    </label>

                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.1"
                                        name={`debitCVsPhase${num}`}
                                        value={
                                          (form as any)[
                                            `debitCVsPhase${num}`
                                          ] || ""
                                        }
                                        onChange={handleChange}
                                        disabled={isView}
                                        placeholder="0.0"
                                        className="w-full border-2 border-border bg-background text-foreground p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-ring transition"
                                      />

                                      <span className="absolute right-2 top-2 text-[9px] text-muted-foreground-400 font-bold">
                                        CVS
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      {/* Section 2 : Particules (PM & PN) */}
                      <section className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase mb-4 flex items-center gap-2">
                          <Activity size={14} /> Mesures Particulaires (PN/PM)
                        </h4>

                        <div className="space-y-4">
                          {/* PM Masse */}
                          <div
                            className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pm
                ? "bg-card border-red-200 shadow-sm"
                : "bg-card border-red-100"
            }`}
                          >
                            <input
                              type="checkbox"
                              id="pm"
                              name="pm"
                              checked={form.pm}
                              disabled={isView}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-600"
                            />

                            <label htmlFor="pm" className="p-4">
                              Pesée PM (Masse)
                            </label>

                            {form.pm && (
                              <div className="pl-7 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-foreground uppercase">
                                  Débit Prélèvement (L/min)
                                </label>

                                <input
                                  type="number"
                                  name="debitPrelevement"
                                  value={form.debitPrelevement}
                                  disabled={isView}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-card focus:ring-2 focus:ring-red-50"
                                />
                              </div>
                            )}
                          </div>

                          {/* PN 23nm */}
                          <div
                            className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pn23Nano
                ? "bg-card border-red-200 shadow-sm"
                : "bg-card border-red-100"
            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <input
                                type="checkbox"
                                id="pn23Nano"
                                disabled={isView}
                                name="pn23Nano"
                                checked={form.pn23Nano}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />

                              <label
                                htmlFor="pn23Nano"
                                className="text-sm font-bold text-muted-foreground-800 cursor-pointer"
                              >
                                PN 23 nm
                              </label>
                            </div>

                            {form.pn23Nano && (
                              <div className="pl-7 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-foreground uppercase">
                                  Facteur Dilution (PNDF)
                                </label>

                                <input
                                  type="number"
                                  name="facteurDilutionPN23"
                                  value={form.facteurDilutionPN23}
                                  disabled={isView}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-card focus:ring-2 focus:ring-red-50"
                                />
                              </div>
                            )}
                          </div>

                          {/* PN 10nm */}
                          <div
                            className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pn10Nano
                ? "bg-card border-red-200 shadow-sm"
                : "bg-card border-red-100"
            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <input
                                type="checkbox"
                                id="pn10Nano"
                                name="pn10Nano"
                                checked={form.pn10Nano}
                                disabled={isView}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />

                              <label
                                htmlFor="pn10Nano"
                                className="text-sm font-bold text-muted-foreground-800 cursor-pointer"
                              >
                                PN 10 nm
                              </label>
                            </div>

                            {form.pn10Nano && (
                              <div className="pl-7 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-foreground uppercase">
                                  Facteur Dilution (PNDF)
                                </label>

                                <input
                                  type="number"
                                  name="facteurDilutionPN10"
                                  value={form.facteurDilutionPN10}
                                  disabled={isView}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-card focus:ring-2 focus:ring-red-50"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
                {activeTab === "vehicle" && (
                  <div className="space-y-8 animate-in fade-in">
                    {/* SECTION 1 : VÉHICULE */}
                    <section>
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-8 flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                        Caractéristiques du véhicule
                      </h3>
                      {!vehiculeDetails ? (
                        <p className="text-xs text-muted-foreground-400 italic p-4 border border-dashed rounded-lg">
                          Sélectionnez un véhicule dans l'onglet "Informations
                          générales".
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              label: "Nom du véhicule",
                              value:
                                vehiculeDetails.nomAppliImmat ||
                                vehiculeDetails.identificateur ||
                                vehiculeDetails.nomAuto,
                            },
                            {
                              label: "Boîte de vitesse",
                              value: (vehiculeDetails as any).boiteVitesse,
                            },
                            {
                              label: "Type de motorisation",
                              value: (vehiculeDetails as any).motorisation,
                            },
                            {
                              label: "Carburant",
                              value: (vehiculeDetails as any).carburant,
                            },
                          ].map((f) => (
                            <div key={f.label} className="space-y-1">
                              <label className="text-xs font-bold text-muted-foreground-600 uppercase">
                                {f.label}
                              </label>
                              <div className="w-full border border-border p-3 rounded-lg text-sm bg-muted text-foreground font-mono">
                                {" "}
                                {f.value ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* SECTION 2 : LOI DE ROUTE */}
                    <section>
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                        Caractéristiques de la loi de route
                      </h3>
                      {!loiDetails ? (
                        <p className="text-xs text-muted-foreground-400 italic p-4 border border-dashed rounded-lg">
                          Sélectionnez une loi de route dans l'onglet
                          "Informations générales".
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "Nom", value: loiDetails.nom },
                            {
                              label: "Masse d'essai (kg)",
                              value: loiDetails.masseEssaiKg,
                            },
                            { label: "F0 (N)", value: loiDetails.f0 },
                            { label: "F1 (N/km/h)", value: loiDetails.f1 },
                            { label: "F2 (N/(km/h)²)", value: loiDetails.f2 },
                            {
                              label: "Inertie (kg)",
                              value: (loiDetails as any).inertieKg,
                            },
                            {
                              label: "Inertie Rot. TNR (kg)",
                              value: (loiDetails as any).inertieRotativeTNRKg,
                            },
                            {
                              label: "Inertie Rot. 2T (kg)",
                              value: (loiDetails as any)
                                .inertieRotativeDeuxTrainsKg,
                            },
                          ].map((f) => (
                            <div key={f.label} className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted-foreground-500">
                                {f.label}
                              </label>
                              <div className="w-full border border-border p-3 rounded-lg text-sm bg-muted text-foreground font-mono">
                                {" "}
                                {f.value ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* SECTION 3 : CALAGE */}
                    <section>
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                        Caractéristiques du calage
                      </h3>
                      {!calageDetails ? (
                        <p className="text-xs text-muted-foreground-400 italic p-4 border border-dashed rounded-lg">
                          Sélectionnez un calage dans l'onglet "Informations
                          générales".
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {/* Ligne complète */}
                          <div className="col-span-2">
                            <label className="text-xs text-muted-foreground-600">
                              Nom du calage
                            </label>
                            <div className="w-full border border-border p-3 rounded-lg text-sm bg-muted text-foreground font-mono">
                              {calageDetails.nom}
                            </div>
                          </div>

                          {/* Les autres champs */}
                          {[
                            {
                              label: "Température (°C)",
                              value: calageDetails.temperature,
                            },
                            { label: "A (N)", value: (calageDetails as any).a },
                            {
                              label: "B (N/km/h)",
                              value: (calageDetails as any).b,
                            },
                            {
                              label: "C (N/(km/h)²)",
                              value: (calageDetails as any).c,
                            },
                          ].map((f) => (
                            <div key={f.label} className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted-foreground-500">
                                {f.label}
                              </label>
                              <div className="w-full border border-border p-3 rounded-lg text-sm bg-muted text-foreground font-mono">
                                {" "}
                                {f.value ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* SECTION 4 : CYCLE */}
                    <section>
                      <h3 className="text-md font-bold text-muted-foreground-700 mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                        Caractéristiques du cycle
                      </h3>
                      {!cycleDetails ? (
                        <p className="text-xs text-muted-foreground-400 italic p-4 border border-dashed rounded-lg">
                          Sélectionnez un cycle dans l'onglet "Informations
                          générales".
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "Nom du cycle", value: cycleDetails.nom },
                            {
                              label: "Famille",
                              value: cycleDetails.familleTest,
                            },
                            {
                              label: "Durée",
                              value: (cycleDetails as any).duree,
                            },
                            {
                              label: "Unité",
                              value: (cycleDetails as any).dureeUnit,
                            },
                          ].map((f) => (
                            <div key={f.label} className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted-foreground-500">
                                {f.label}
                              </label>
                              <div className="w-full border border-border p-3 rounded-lg text-sm bg-muted text-foreground font-mono">
                                {" "}
                                {f.value ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}
                {/* 3ème Onglet : Gaz Bruts */}
                {activeTab === "gazBruts" && (
                  <div className="space-y-8 animate-in fade-in p-4">
                    <h3 className="text-lg font-bold text-foreground mb-4 border-b pb-2">
                      Configuration des gaz Bruts
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4   ">
                      {/* SECTION 1 : Lignes Standard (L1, L2, L3) */}
                      <section className="space-y-6">
                        <div>
                          <h4 className="text-xs font-black text-foreground uppercase mb-4 flex items-center gap-2">
                            <Settings size={14} /> Lignes de Prélèvement
                            Standard
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Ligne 1 */}
                            <div className="p-3 bg-card border border-red-200 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="checkbox"
                                  id="ligne1"
                                  name="ligne1"
                                  disabled={isView}
                                  checked={!!form.ligne1}
                                  onChange={handleChange}
                                  className="w-4 h-4 accent-red-600"
                                />
                                <label
                                  htmlFor="ligne1"
                                  className="text-sm font-bold text-muted-foreground-700 uppercase"
                                >
                                  Ligne 1
                                </label>
                              </div>
                              {!!form.ligne1 && (
                                <div className="pl-7 animate-in slide-in-from-left-2">
                                  <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                    Point de prélèvement
                                  </label>
                                  <select
                                    name="pointPrelevementL1"
                                    value={form.pointPrelevementL1 ?? ""}
                                    disabled={isView}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                  >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="Amont CATA">
                                      Amont CATA
                                    </option>
                                    <option value="Aval CATA">Aval CATA</option>
                                    <option value="Canule">Canule</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Ligne 2 */}
                            <div className="p-3 bg-card border border-red-200 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="checkbox"
                                  id="ligne2"
                                  name="ligne2"
                                  checked={!!form.ligne2}
                                  onChange={handleChange}
                                  disabled={isView}
                                  className="w-4 h-4 accent-red-600"
                                />
                                <label
                                  htmlFor="ligne2"
                                  className="text-sm font-bold text-muted-foreground-700 uppercase"
                                >
                                  Ligne 2
                                </label>
                              </div>
                              {!!form.ligne2 && (
                                <div className="pl-7 animate-in slide-in-from-left-2">
                                  <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                    Point de prélèvement
                                  </label>
                                  <select
                                    name="pointPrelevementL2"
                                    value={form.pointPrelevementL2 ?? ""}
                                    disabled={isView}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                  >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="Amont CATA">
                                      Amont CATA
                                    </option>
                                    <option value="Aval CATA">Aval CATA</option>
                                    <option value="Canule">Canule</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Ligne 3 */}
                            <div className="p-3 bg-card border border-red-200 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="checkbox"
                                  id="ligne3"
                                  name="ligne3"
                                  checked={!!form.ligne3}
                                  onChange={handleChange}
                                  disabled={isView}
                                  className="w-4 h-4 accent-red-600"
                                />
                                <label
                                  htmlFor="ligne3"
                                  className="text-sm font-bold text-muted-foreground-700 uppercase"
                                >
                                  Ligne 3
                                </label>
                              </div>
                              {!!form.ligne3 && (
                                <div className="pl-7 animate-in slide-in-from-left-2">
                                  <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                    Point de prélèvement
                                  </label>
                                  <select
                                    name="pointPrelevementL3"
                                    value={form.pointPrelevementL3 ?? ""}
                                    disabled={isView}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                  >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="Amont CATA">
                                      Amont CATA
                                    </option>
                                    <option value="Aval CATA">Aval CATA</option>
                                    <option value="Canule">Canule</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* SECTION 2 : Lignes Spéciales (QCL & PN) */}
                      <section className="space-y-6">
                        <div>
                          <h4 className="text-xs font-black text-foreground uppercase mb-4 flex items-center gap-2">
                            <Activity size={14} /> Lignes FTIR
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            {/* FTIR — accès direct, pas de tableau inline */}
                            <div className="p-3 bg-card border border-red-200 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="checkbox"
                                  id="fitr"
                                  name="fitr"
                                  checked={!!form.fitr}
                                  onChange={handleChange}
                                  disabled={isView}
                                  className="w-4 h-4 accent-red-600"
                                />
                                <label
                                  htmlFor="fitr"
                                  className="text-sm font-bold text-muted-foreground-700 uppercase"
                                >
                                  FTIR
                                </label>
                              </div>
                              {!!form.fitr && (
                                <div className="pl-7 animate-in slide-in-from-left-2">
                                  <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                    Localisation
                                  </label>
                                  <input
                                    type="text"
                                    name="pointPrelevementFITR"
                                    value={form.pointPrelevementFITR ?? ""}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Microsoot */}
                        <div className="p-3 bg-card border border-red-200 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="checkbox"
                              id="microsot"
                              name="microsot"
                              checked={!!form.microsot}
                              onChange={handleChange}
                              disabled={isView}
                              className="w-4 h-4 accent-red-600"
                            />
                            <label
                              htmlFor="microsot"
                              className="text-sm font-bold text-muted-foreground-900 uppercase"
                            >
                              Microsoot
                            </label>
                          </div>
                          {!!form.microsot && (
                            <div className="pl-7 animate-in slide-in-from-left-2">
                              <label className="text-[10px] font-bold text-muted-foreground-400 uppercase">
                                Localisation
                              </label>
                              <input
                                type="text"
                                name="pointPrelevementMicrosot"
                                value={form.pointPrelevementMicrosot ?? ""}
                                onChange={handleChange}
                                disabled={isView}
                                className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring transition"
                              />
                            </div>
                          )}
                        </div>

                        {/* Analyses Spécifiques */}
                        <div className="p-4 border rounded-xl space-y-4 border-red-200 shadow-sm">
                          <h5 className="text-[11px] font-bold text-foreground uppercase flex items-center gap-2">
                            Analyses Spécifiques
                          </h5>
                          <div className="flex flex-col gap-3">
                            {/* egr — accès direct, pas de tableau inline */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="egr"
                                name="egr"
                                checked={!!form.egr}
                                onChange={handleChange}
                                disabled={isView}
                                className="w-4 h-4 accent-red-600"
                              />
                              <span className="text-xs font-bold text-muted-foreground-500 uppercase">
                                Mesure EGR
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}

                {/* SECTION  : donnée INCA  */}
                {activeTab === "inca" && (
                  <div className="space-y-8 animate-in fade-in p-4">
                    <h3 className="text-lg font-bold text-foreground mb-4 border-b pb-2">
                      Configuration INCA
                    </h3>
                    <div className="grid grid-cols-1 gap-8">
                      {/* XCU 1 */}
                      <div className="p-4 border border-red-200 rounded-xl bg-card shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <input
                            type="checkbox"
                            id="xcu1"
                            name="xcu1"
                            checked={!!form.xcu1}
                            onChange={handleChange}
                            disabled={isView}
                            className="w-5 h-5 accent-red-600"
                          />
                          <label
                            htmlFor="xcu1"
                            className="font-black text-muted-foreground-800 uppercase"
                          >
                            XCU 1
                          </label>
                        </div>

                        {form.xcu1 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8 animate-in slide-in-from-left-2">
                            {/* Software 1 */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
                                Software1 (.a2l, .srh)
                              </label>
                              {/* Fichier existant */}
                              {(isView || modalMode === "edit") &&
                                selectedDemande?.software1FileName && (
                                  <FileDisplay
                                    label={
                                      isView ? "Software1" : "Fichier actuel"
                                    }
                                    fileName={selectedDemande.software1FileName}
                                    filePath={selectedDemande.software1FilePath}
                                  />
                                )}
                              {/* Input seulement en edit/create */}
                              {!isView && (
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileChange(e, "software1")
                                  }
                                  className="w-full text-xs border border-border bg-background text-foreground p-2 rounded-lg outline-none focus:ring-2 focus:ring-ring transition"
                                />
                              )}
                            </div>

                            {/* Calibration 1 */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
                                Calibration1 (.hex, .s19)
                              </label>
                              {(isView || modalMode === "edit") &&
                                selectedDemande?.calibration1FileName && (
                                  <FileDisplay
                                    label={
                                      isView ? "Calibration1" : "Fichier actuel"
                                    }
                                    fileName={
                                      selectedDemande.calibration1FileName
                                    }
                                    filePath={
                                      selectedDemande.calibration1FilePath
                                    }
                                  />
                                )}
                              {!isView && (
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileChange(e, "calibration1")
                                  }
                                  className="w-full text-xs border border-border bg-background text-foreground p-2 rounded-lg outline-none focus:ring-2 focus:ring-ring transition"
                                />
                              )}
                            </div>

                            {/* Experiment 1 */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
                                Experiment1 (.exp)
                              </label>
                              {(isView || modalMode === "edit") &&
                                selectedDemande?.experiment1FileName && (
                                  <FileDisplay
                                    label={
                                      isView ? "Experiment1" : "Fichier actuel"
                                    }
                                    fileName={
                                      selectedDemande.experiment1FileName
                                    }
                                    filePath={
                                      selectedDemande.experiment1FilePath
                                    }
                                  />
                                )}
                              {!isView && (
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileChange(e, "experiment1")
                                  }
                                  className="w-full text-xs border border-border bg-background text-foreground p-2 rounded-lg outline-none focus:ring-2 focus:ring-ring transition"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* XCU 2 & 3 */}
                      {([2, 3] as const).map((num) => {
                        const xcuKey = `xcu${num}` as keyof DemandeEssai;
                        const softwareKey =
                          `software${num}` as keyof typeof files;
                        const calibKey =
                          `calibration${num}` as keyof typeof files;
                        const swFileName =
                          `software${num}FileName` as keyof DemandeEssai;
                        const swFilePath =
                          `software${num}FilePath` as keyof DemandeEssai;
                        const calFileName =
                          `calibration${num}FileName` as keyof DemandeEssai;
                        const calFilePath =
                          `calibration${num}FilePath` as keyof DemandeEssai;

                        return (
                          <div
                            key={`xcu${num}`}
                            className="p-4 border border-red-200 rounded-xl bg-card shadow-sm"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <input
                                type="checkbox"
                                id={`xcu${num}`}
                                name={`xcu${num}`}
                                checked={!!form[xcuKey]}
                                onChange={handleChange}
                                disabled={isView}
                                className="w-5 h-5 accent-red-600"
                              />
                              <label
                                htmlFor={`xcu${num}`}
                                className="font-black text-muted-foreground-800 uppercase"
                              >
                                XCU {num}
                              </label>
                            </div>

                            {!!form[xcuKey] && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-in slide-in-from-left-2">
                                {/* Software N */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
                                    Software{num}
                                  </label>
                                  {(isView || modalMode === "edit") &&
                                    selectedDemande?.[swFileName] && (
                                      <FileDisplay
                                        label={
                                          isView
                                            ? `Software${num}`
                                            : "Fichier actuel"
                                        }
                                        fileName={
                                          selectedDemande[swFileName] as string
                                        }
                                        filePath={
                                          selectedDemande[swFilePath] as string
                                        }
                                      />
                                    )}
                                  {!isView && (
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleFileChange(e, softwareKey)
                                      }
                                      className="w-full text-xs border border-border bg-background text-foreground p-2 rounded-lg outline-none focus:ring-2 focus:ring-ring transition"
                                    />
                                  )}
                                </div>

                                {/* Calibration N */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground-500 uppercase">
                                    Calibration{num}
                                  </label>
                                  {(isView || modalMode === "edit") &&
                                    selectedDemande?.[calFileName] && (
                                      <FileDisplay
                                        label={
                                          isView
                                            ? `Calibration${num}`
                                            : "Fichier actuel"
                                        }
                                        fileName={
                                          selectedDemande[calFileName] as string
                                        }
                                        filePath={
                                          selectedDemande[calFilePath] as string
                                        }
                                      />
                                    )}
                                  {!isView && (
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleFileChange(e, calibKey)
                                      }
                                      className="w-full text-xs border border-border bg-background text-foreground p-2 rounded-lg outline-none focus:ring-2 focus:ring-ring transition"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* ACQUISITION EOBD — inchangé */}
                      <div className="p-4 border border-red-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <input
                            type="checkbox"
                            id="acquisitionEOBD"
                            name="acquisitionEOBD"
                            checked={!!form.acquisitionEOBD}
                            onChange={handleChange}
                            disabled={isView}
                            className="w-5 h-5 accent-red-600"
                          />
                          <label
                            htmlFor="acquisitionEOBD"
                            className="font-black text-foreground uppercase"
                          >
                            Acquisition EOBD
                          </label>
                        </div>
                        {form.acquisitionEOBD && (
                          <div className="pl-8 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-bold text-foreground uppercase">
                              Type d'acquisition *
                            </label>
                            <select
                              name="typeAcquisition"
                              value={form.typeAcquisition ?? ""}
                              onChange={handleChange}
                              required
                              disabled={isView}
                              className="w-full md:w-1/2 border p-2 rounded-lg bg-card outline-none focus:ring-2 focus:ring-red-200"
                            >
                              <option value="">-- Sélectionner --</option>
                              <option value="DiagRa">DiagRa</option>
                              <option value="Scantool">Scantool</option>
                              <option value="DDT 2000">DDT 2000</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* 5ème Onglet Mesures auxiliaires */}
                {activeTab === "mesuresAux" && (
                  <div className="space-y-8 animate-in fade-in text-xs">
                    {/* Section 1 : Sélection des mesures */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                      {mesureItems.map(
                        (
                          item, // ✅ item.id est MesureKey
                        ) => (
                          <label
                            key={item.id}
                            className={`flex items-center justify-between p-3 border border-border
       rounded-xl cursor-pointer transition-all ${
         form[item.id]
           ? "bg-card border-red-200 shadow-sm ring-1 ring-red-100"
           : "bg-card-50 border-border"
       }`}
                          >
                            <span className="text-xs font-bold text-muted-foreground-700 uppercase">
                              {item.label}
                            </span>
                            <input
                              type="checkbox"
                              name={item.id}
                              checked={form[item.id] || false}
                              onChange={handleChange}
                              disabled={isView}
                              className="w-4 h-4 accent-red-600"
                            />
                          </label>
                        ),
                      )}
                    </section>
                    {/* Section 2 : Détails dynamiques pour CHAQUE mesure sélectionnée */}
                    {/* Section 2 : Détails dynamiques pour CHAQUE mesure sélectionnée */}
                    <section className="space-y-6">
                      <h3 className="text-sm font-bold text-muted-foreground-700 border-b pb-2 uppercase tracking-tight">
                        Configuration des mesures sélectionnées
                      </h3>

                      <div className="space-y-4">
                        {mesureItems.map(
                          (item) =>
                            form[item.id] && (
                              <div
                                key={item.id}
                                className="p-4 border border-border rounded-xl bg-card shadow-sm"
                              >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-xs font-bold text-foreground uppercase">
                                    {item.label}
                                  </span>
                                  {!isView && (
                                    <button
                                      type="button"
                                      disabled={isView}
                                      onClick={() => addRow(item.id)}
                                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                      + Ajouter
                                    </button>
                                  )}
                                </div>

                                {/* Rows */}
                                {(mesuresRows[item.id].length === 0
                                  ? [
                                      {
                                        indice: "",
                                        numero: "",
                                        type: "" as TypeMusure | "",
                                      },
                                    ]
                                  : mesuresRows[item.id]
                                ).map((row, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-3 items-stretch"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-muted-foreground-400 uppercase">
                                        Indice
                                      </label>
                                      <input
                                        value={row.indice}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "indice",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Ex: idx-01"
                                        disabled={isView}
                                        className="w-full border border-border bg-background text-foreground p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-ring transition"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-muted-foreground-400 uppercase">
                                        Numéro
                                      </label>

                                      <input
                                        type="number"
                                        value={row.numero}
                                        disabled={isView}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "numero",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Ex: 102"
                                        className="w-full border border-border bg-background text-foreground p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-ring transition"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-muted-foreground-400 uppercase">
                                        Type de mesure
                                      </label>
                                      <select
                                        value={row.type}
                                        disabled={isView}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "type",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full border border-border bg-background text-foreground p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-ring transition"
                                      >
                                        <option value="">
                                          Sélectionner...
                                        </option>
                                        <option value={TypeMusure.ANALOGIQUE}>
                                          Analogique
                                        </option>
                                        <option value={TypeMusure.CAN}>
                                          CAN
                                        </option>
                                        <option
                                          value={TypeMusure.FIBRE_OPTIQUE}
                                        >
                                          Fibre Optique
                                        </option>
                                      </select>
                                    </div>
                                    <div className="flex items-end">
                                      {!isView && (
                                        <div className="flex h-full items-end justify-center">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeRow(item.id, index)
                                            }
                                            className="text-red-500 font-bold px-3 py-2 hover:bg-red-50 rounded transition"
                                            title="Supprimer"
                                          >
                                            ✖
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ),
                        )}

                        {/* Message si rien n'est sélectionné */}
                        {!form.mesureCourant &&
                          !form.mesureTension &&
                          !form.thermocouples &&
                          !form.sondeLambdaLA4 && (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                              <p className="text-xs text-muted-foreground-400 font-medium">
                                Cochez une mesure pour configurer ses détails.
                              </p>
                            </div>
                          )}
                      </div>
                    </section>
                  </div>
                )}
              </form>
            </div>

            {/* --- FOOTER FIXE AVEC NAVIGATION --- */}
            <div className="p-4 border-t border-border bg-background flex justify-between items-center sticky bottom-0">
              {" "}
              <button
                onClick={handlePrevTab}
                disabled={activeTab === tabs[0].id}
                className={`px-6 py-2 border-2 border-border rounded-lg font-medium transition ${
                  activeTab === tabs[0].id
                    ? "text-muted-foreground-400 cursor-not-allowed"
                    : "text-muted-foreground-600 "
                }`}
              >
                Précédent
              </button>
              <div className="flex gap-3">
                {activeTab !== tabs[tabs.length - 1].id && (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="px-10 py-2 bg-[#E30613] text-white rounded-lg font-medium transition-all hover:brightness-110"
                  >
                    Suivant
                  </button>
                )}

                {!isView && activeTab === tabs[tabs.length - 1].id && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#E30613] text-white rounded-lg font-bold shadow-lg hover:brightness-110"
                  >
                    Enregistrer la demande
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  UserCog,
  Eye,
  Plus,
  Search,
  Calendar,
} from "lucide-react";
import { authFetch } from "../api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import { Cycles } from "./Cycles";

export enum DecisionValidation {
  OK = "OK",
  NOK = "NOK",
  OK_SOUS_RESERVE = "OK_SOUS_RESERVE",
}

interface Client {
  id?: number;
  nom: string;
}
interface Vehicule {
  id: number;
  nomAppliImmat?: string;
  identificateur?: string;
  nomAuto?: string;
  codeInterne?: string;
}
// AVANT le composant — avec MesureKey, Vehicule, DemandeEssai
interface Cycle {
  id: number;
  nom?: string;
  famille?: string;
}

interface Calage {
  id: number;
  nom?: string;
  temperature?: number;
}

interface LoiRoute {
  id: number;
  nom?: string;
  testMass?: number;
  f0?: number;
  f1?: number;
  f2?: number;
}
interface ValidationTechnicien {
  id: number;
  decision?: DecisionValidation;
}
interface ValidationCharge {
  id?: number;
  validation?: DecisionValidation;
}
interface DemandeEssai {
  // =====================
  // IDENTITÉ
  // =====================
  id?: number;
  nomAuto?: string;
  numeroProjet?: number;

  statutGlobal?: "EN_COURS" | "FAIT" | "REJETEE";
  statutDemande?: "EN_CREATION" | "VALIDEE";

  // =====================
  // RELATIONS (BACKEND)
  // =====================
  vehicule?: { id: number; identificateur: number };
  cycle?: { id: number };
  calage?: { id: number };
  client?: { id: number; nom: string };

  // =====================
  // PROJET
  // =====================
  typeProjet?: string;

  demandeur?: string;
  technicien?: string;

  banc?: string;
  datePlanification?: string;
  shift?: "MATIN" | "SOIR" | "NUIT";

  // =====================
  // CONDITIONS ESSAI
  // =====================
  besoinMaceration?: boolean;
  temperatureMaceration?: number;
  temperatureEau?: number;
  hygrometrieEssai?: number;
  activationSTT?: boolean;
  temperatureEssai?: number;

  // =====================
  // BATTERIE / CLIM
  // =====================
  gestionBatterie12V?: string;
  socDepart12V?: number;

  activationClim?: boolean;
  temperatureRegulationClim?: number;
  chauffageHabitable?: boolean;

  // =====================
  // TYPE ESSAI
  // =====================
  typeEssai?: string;
  verificationCoastDown?: boolean;
  nombreDecelerations?: number;
  commentaire?: string;

  // =====================
  // SAC / DÉBITS
  // =====================
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

  // =====================
  // PM / PN
  // =====================
  pm?: boolean;
  debitPrelevement?: number;

  pn10Nano?: boolean;
  facteurDilutionPN10?: number;

  pn23Nano?: boolean;
  facteurDilutionPN23?: number;

  // =====================
  // GAZ BRUTS
  // =====================
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

  FITR?: boolean;
  pointPrelevementFITR?: string;

  egr?: boolean;

  // =====================
  // XCU
  // =====================
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

  // =====================
  // MESURE COURANT
  // =====================
  mesureCourant?: boolean;
  indiceCourant?: number;
  numeroTermocoupleCourant?: number;
  typeMesureCourant?: number;

  // =====================
  // CONFIG BANC
  // =====================
  capot?: "OUVERT" | "FERME";
  soufflante?: string;
  qCvs?: number;
  carflow?: boolean;

  // =====================
  // MESURE TENSION
  // =====================
  mesureTension?: boolean;
  indiceTension?: number;
  numeroTermocoupleTension?: number;
  typeMesureTension?: string;

  // =====================
  // THERMOCOUPLES
  // =====================
  thermocouples?: boolean;
  indicethermocouples?: number;
  numeroTermocouple?: number;
  typeMesurethermocouples?: string;

  // =====================
  // SONDE LAMBDA
  // =====================
  sondeLambdaLA4?: boolean;
  indicesondeLambdaLA4?: number;
  numerosondeLambdaLA4?: number;
  typeMesuresondeLambdaLA4?: string;
  validationTechnicien: ValidationTechnicien;
  validationCharge: ValidationCharge;
}

// Données structurées pour permettre le calcul dynamique

// Fonction utilitaire pour calculer le statut global (Cahier des charges Screenshot 105702)
const getGlobalStatus = (validationTech?: any, validationCharge?: any) => {
  const techExists = !!validationTech;
  const chargeExists = !!validationCharge;

  if (techExists && chargeExists) return "FAIT";
  if (techExists || chargeExists) return "EN_COURS";
  return "PAS_FAIT";
};
// Fonction pour le style des badges
const getStatusStyle = (status?: string) => {
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
const getValidationStyle = (status?: string) => {
  switch (status) {
    case "OK":
      return "bg-[#E8F5E9] text-[#2E7D32]";
    case "OK_SOUS_RESERVE":
      return "bg-[#FFF9C4] text-[#FBC02D]";
    case "NOK":
      return "bg-[#FFEBEE] text-[#C62828]";
    default:
      return "bg-gray-100 text-muted-foreground-600";
  }
};

export function Validation() {
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const isAdmin = role?.includes("ADMIN");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterProjet, setFilterProjet] = useState("");
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [client, setClient] = useState("");
  const [userClient, setUserClient] = useState<string>("");

  const [vehicules, setVehicules] = useState<any[]>([]);
  const [filterVehicule, setFilterVehicule] = useState("Tous");
  const [filterCycle, setFilterCycle] = useState("Tous");
  const canViewDetails = role?.includes("ADMIN") || role?.includes("EXTERNE");
  const { t } = useTranslation();

  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(demandes) ? demandes : [];

    return safeData.filter((row) => {
      const matchesSearch =
        !search ||
        (row.nomAuto ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (row.technicien ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesVehicule =
        filterVehicule === "Tous" ||
        String(row.vehicule?.id ?? row.vehicule) === filterVehicule;
      const matchesCycle =
        !filterCycle || filterCycle === "Tous"
          ? true
          : row.cycle?.id?.toString() === filterCycle;

      const matchesProjet = !filterProjet
        ? true
        : (row.numeroProjet ?? row.numeroProjet)
            ?.toString()
            .includes(filterProjet);

      const matchesClient =
        clientFilter === "Tous" || row.client?.id === Number(clientFilter);
      const matchesDate = !filterDate
        ? true
        : row.datePlanification?.split("T")[0] === filterDate;

      return (
        matchesSearch &&
        matchesVehicule &&
        matchesCycle &&
        matchesProjet &&
        matchesClient &&
        matchesDate
      );
    });
  }, [
    demandes,
    search,
    filterVehicule,
    filterCycle,
    filterProjet,
    filterDate,
    clientFilter,
  ]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);

      const res = await authFetch("/demandes-essai");

      const data = res?.data ?? res?.content ?? res?._embedded?.demandes ?? res;

      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicules = async () => {
    try {
      const data = await authFetch("/vehicules");
      setVehicules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchDemandes();
    fetchVehicules();
    fetchCycles();
    fetchCurrentUser();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await authFetch("/clients/ClientDTO");
      setClients(data);
    } catch (error) {
      console.error("Erreur chargement clients", error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const user = await authFetch("/users/me");
      setCurrentUser(user);
    } catch (error) {
      console.error("Erreur récupération utilisateur", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
        setUserClient(user.client);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);
  const translateDecision = (decision?: DecisionValidation) => {
    switch (decision) {
      case DecisionValidation.OK:
        return t("validation.decision.ok");

      case DecisionValidation.NOK:
        return t("validation.decision.nok");

      case DecisionValidation.OK_SOUS_RESERVE:
        return t("validation.decision.okReservation");

      default:
        return "";
    }
  };
  return (
    <>
      <div className="p-3 space-y-5 bg-gray-10 min-h-screen">
        <div className="flex items-center justify-between">
          {/* Titre + description */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {t("validation.title")}
            </h1>
            <p className="text-muted-foreground"> {t("validation.subtitle")}</p>
          </div>
        </div>

        <div className="w-full p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-4 ">
          {" "}
          <div className="flex gap-4 items-center w-full">
            {/* Recherche */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <input
                type="text"
                placeholder={t("validation.search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-background text-foreground border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* Filtre client */}
            {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) =>
              role?.includes(r),
            ) && (
              <select
                className="
  w-full sm:w-48 h-12 px-4
  bg-background
  text-foreground
  border border-border
  rounded-lg shadow-sm text-sm
  focus:outline-none focus:ring-2 focus:ring-ring
  transition
"
                value={clientFilter}
                onChange={(e) =>
                  setClientFilter(
                    e.target.value === "Tous" ? "Tous" : Number(e.target.value),
                  )
                }
              >
                <option value="Tous">
                  {" "}
                  {t("validation.filters.client")} (
                  {t("validation.filters.allClients")})
                </option>

                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            )}
            {/* Filtre véhicule (CORRIGÉ) */}
            <select
              value={filterVehicule}
              onChange={(e) => setFilterVehicule(e.target.value)}
              className="w-full sm:w-50 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm ocus:outline-none focus:ring-2 focus:ring-ring">

              <option value="Tous">
                {" "}
                {t("validation.filters.allVehicles")}
              </option>

              {vehicules.map((v) => (
                <option key={v.id} value={v.id.toString()}>
                  {v.identificateur}
                </option>
              ))}
            </select>
            {/* Filtre N° projet */}
            <input
              type="text"
              placeholder={t("validation.filters.projectNumber")}
              value={filterProjet}
              onChange={(e) => setFilterProjet(e.target.value)}
              className="w-full sm:w-50 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {/* Filtre date */}
            {/* Filtre date */}
            <div className="relative w-full sm:w-48">
              {/* Filtre date */}
              <div className="relative w-full sm:w-48">
                <div className="flex items-center bg-background border border-border rounded-lg px-3 gap-2 h-12 focus-within:ring-2 focus-within:ring-ring transition">
                  {/* Icône personnalisée */}
                  <Calendar
                    size={17}
                    strokeWidth={2}
                    className="text-muted-foreground shrink-0"
                  />

                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="date-input w-full h-full bg-transparent text-foreground text-sm outline-none"
                  />

                  {filterDate && (
                    <button
                      type="button"
                      onClick={() => setFilterDate("")}
                      className="date-input w-full h-full bg-transparent text-foreground text-sm outline-none
             dark:[color-scheme:dark] [color-scheme:light]"
                      title={t("validation.filters.resetDate")}
                    ></button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm text-left border-collapse">
              {/* Header */}
              <thead className="bg-[#B9032C] border-b border-border">
                <tr>
                  <th className="px-5 py-5 font-semibold text-white">
                    {t("validation.table.testRequest")}
                  </th>
                  <th className="px-6 py-5 font-semibold text-white">
                    {" "}
                    {t("validation.table.date")}
                  </th>
                  <th className="px-4 py-5 font-semibold text-white">
                    {t("validation.table.projectNumber")}
                  </th>
                  <th className="px-8 py-5 font-semibold text-white">
                    {" "}
                    {t("validation.table.client")}
                  </th>
                  <th className="px-4 py-5 font-semibold text-white">
                    {t("validation.table.vehicle")}
                  </th>
                  {/* <th className="px-4 py-4 font-semibold text-white">Cycle</th>*/}
                  <th className="px-2 py-5 font-semibold text-white">
                    {t("validation.table.technicianValidation")}
                  </th>
                  <th className="px-2 py-5 font-semibold text-white">
                    {t("validation.table.chargeValidation")}
                  </th>
                  <th className="px-3 py-5 font-semibold text-white">
                    {t("validation.table.globalStatus")}
                  </th>
                  <th className="px-3 py-5 font-semibold text-white">
                    {t("validation.table.validation")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-6 text-muted-foreground-500 font-medium"
                    >
                      {t("validation.messages.noRequestFound")}{" "}
                    </td>
                  </tr>
                ) : (
                  (filteredData ?? []).map((row) => {
                    const globalStatus = getGlobalStatus(
                      row.validationTechnicien,
                      row.validationCharge,
                    );
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                      >
                        <td className="px-4 py-4 text-muted-foreground-800 font-bold ">
                          {row.nomAuto}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.datePlanification}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.numeroProjet}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.client?.nom ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.vehicule?.identificateur ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.validationTechnicien?.decision && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${getValidationStyle(
                                row.validationTechnicien.decision,
                              )}`}
                            >
                              {translateDecision(
                                row.validationTechnicien.decision,
                              )}{" "}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground-800">
                          {row.validationCharge?.validation && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getValidationStyle(
                                row.validationCharge.validation,
                              )}`}
                            >
                              {translateDecision(
                                row.validationCharge.validation,
                              )}{" "}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground-800">
                          <span
                            className={`px-1 py-1 rounded-lg font-bold shadow-sm ${getStatusStyle(globalStatus)}`}
                          >
                            {globalStatus === "FAIT"
                              ? t("validation.status.done")
                              : globalStatus === "EN_COURS"
                                ? t("validation.status.inProgress")
                                : t("validation.status.notDone")}{" "}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-muted-foreground-800">
                          {currentUser?.role === "TECHNICIEN_ESSAI" && (
                            <Link
                              to={`/app/validation/conducteur/${row.id}`}
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                            >
                              {t("validation.actions.validate")}
                            </Link>
                          )}

                          {currentUser?.role === "CHARGE_ESSAI" && (
                            <Link
                              to={`/app/validation/charge/${row.id}`}
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                            >
                              {t("validation.actions.validate")}
                            </Link>
                          )}
                          {/* ADMIN + EXTERNE → Voir détail */}
                          {canViewDetails && (
                            <Link
                              to={`/app/validation/detail/${row.id}`}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                            >
                              {t("validation.actions.view")}
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

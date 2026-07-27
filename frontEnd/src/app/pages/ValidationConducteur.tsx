import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { authFetch } from "../api";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
interface Client {
  id?: number;
  nom: string;
}
export interface ValidationTechnicien {
  id?: number;
  decision?: "OK" | "NOK" | "OK_SOUS_RESERVE";
  commentaire?: string;
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
  vehicule?: { id: number };
  cycle?: { id: number };
  calage?: { id: number };

  // =====================
  // PROJET
  // =====================
  typeProjet?: string;
  client?: { id: number; nom: string };

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
  validationTechnicien?: ValidationTechnicien;
}

export function ValidationConducteur() {
  const { id } = useParams();
  const [demande, setDemande] = useState<DemandeEssai | null>(null);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const activeStatus =
    selectedStatus ?? demande?.validationTechnicien?.decision;
  const [comment, setComment] = useState("");
  const isValidated = ["OK", "NOK", "OK_SOUS_RESERVE"].includes(
    demande?.validationTechnicien?.decision ?? "",
  );
  const isReadOnly = isValidated;
  const handleSubmit = async () => {
     if (!selectedStatus) {
      toast.warning("Veuillez sélectionner un statut avant de valider.");
      return;
    }
    try {
      if (!selectedStatus) return;
      await authFetch(`/validation_technicien/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: selectedStatus,
          commentaire: comment,
        }),
      });
      navigate("/app/validation");
      const updated = await authFetch(`/demandes-essai/${id}`);
      setDemande(updated);
    } catch (error) {
      console.error("Erreur validation", error);
    }
  };
  useEffect(() => {
    if (demande?.validationTechnicien) {
      setSelectedStatus(demande.validationTechnicien.decision ?? null);
      setComment(demande.validationTechnicien.commentaire ?? "");
    }
  }, [demande]);

  useEffect(() => {
    if (!demande) return;

    if (demande.validationTechnicien?.decision) {
      toast.success("Cet essai a déjà été validé et est en lecture seule.");
    }
  }, [demande]);
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const data = await authFetch(`/demandes-essai/${id}`);
        setDemande(data);
      } catch (error) {
        console.error("Erreur chargement demande", error);
      }
    };

    if (id) fetchDemande();
  }, [id]);
  const fetchClients = async () => {
    try {
      const data = await authFetch("/clients");
      setClients(data);
    } catch (error) {
      console.error("Erreur chargement clients", error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Validation Technicien d'essai
        </h1>
      </div>
      {/* Carte récapitulatif sous forme de tableau classique */}
      <div className="bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* THEAD */}
            <thead className="bg-[#B9032C] border-b border-gray-200">
              <tr className="text-xs uppercase tracking-wider text-white">
                <th className="px-6 py-4 font-semibold text-white">Nom</th>
                <th className="px-5 py-4 font-semibold text-white">
                  N° de Projet
                </th>
                <th className="px-2 py-4 font-semibold text-white">Client</th>
                <th className="px-4 py-4 font-semibold text-white">
                  Demandeur
                </th>
                <th className="px-3 py-4 font-semibold text-white">Statut</th>
                <th className="px-5 py-4 font-semibold text-white">
                  Validation
                </th>
                <th className="px-3 py-4 font-semibold text-white">Date</th>
                <th className="px-5 py-4 font-semibold text-white">Shift</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {demande && (
                <tr className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group">
                  <td className="p-4 font-medium text-sm text-muted-foreground-800">
                    {demande.nomAuto}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground-600">
                    {demande.numeroProjet}
                  </td>

                  <td className="px-2 py-4 text-muted-foreground-600">
                    {demande?.client?.nom}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground-600">
                    {demande.demandeur}
                  </td>

                  <td className="px-3 py-4 text-muted-foreground-600">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        demande.statutDemande === "VALIDEE"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {demande.statutDemande}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground-600">
                    {demande.statutGlobal}
                  </td>

                  <td className="px-3 py-4 text-muted-foreground-600">
                    {demande.datePlanification}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground-600">
                    {demande.shift}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Options de validation compactes */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isReadOnly}
          onClick={() => {
            if (isReadOnly) return;
            setSelectedStatus("OK");
          }}
          className={`p-3 rounded-lg border-2 transition-all ${
            activeStatus === "OK"
              ? "bg-[#E8F5E9] border-[#2E7D32]"
              : "bg-card border-[#E0E0E0] hover:border-[#2E7D32]"
          }`}
        >
          <CheckCircle className="w-6 h-6 text-[#2E7D32] mx-auto mb-1" />
          <div className="text-sm font-semibold mb-1 text-center">OK</div>
          <div className="text-xs text-gray-600 text-center">
            Essai réalisé sans problèmes
          </div>
        </button>

        <button
          disabled={isReadOnly}
          onClick={() => setSelectedStatus("NOK")}
          className={`p-3 rounded-lg border-2 transition-all ${
            activeStatus === "NOK"
              ? "bg-[#FFEBEE] border-[#C62828]"
              : "bg-card border-[#E0E0E0] hover:border-[#C62828]"
          }`}
        >
          <XCircle className="w-6 h-6 text-[#C62828] mx-auto mb-1" />
          <div className="text-sm font-semibold mb-1 text-center">NOK</div>
          <div className="text-xs text-gray-600 text-center">
            Essai interrompu ou non réalisé
          </div>
        </button>

        <button
          disabled={isReadOnly}
          onClick={() => setSelectedStatus("OK_SOUS_RESERVE")}
          className={`p-3 rounded-lg border-2 transition-all ${
            activeStatus === "OK_SOUS_RESERVE"
              ? "bg-[#FFF3E0] border-[#ED6C02]"
              : "bg-card border-[#E0E0E0] hover:border-[#ED6C02]"
          }`}
        >
          <AlertTriangle className="w-6 h-6 text-[#ED6C02] mx-auto mb-1" />
          <div className="text-sm font-semibold mb-1 text-center">
            OK sous réserve
          </div>
          <div className="text-xs text-gray-600 text-center">
            Essai réalisé mais avec complications
          </div>
        </button>
      </div>
      {/* Commentaire */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <label className="block text-lg font-semibold mb-3">
          Commentaire de technicien d'essai
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isValidated}
          rows={4}
          className="w-full px-4 py-3  text-muted-foreground-600 border border-border rounded-lg focus:outline-none focus:border-[#E30613] resize-none"
          placeholder="Décrivez le déroulement de l'essai, le comportement du véhicule, les problèmes rencontrés..."
        />
      </div>
      {/* Boutons */}
      {/* Boutons */}
      <div className="flex justify-end gap-190 mt-8">
        <button
          onClick={() => navigate("/app/validation")}
          className="px-20 py-2.5 bg-card border-2 border-gray text-[#E30613] font-semibold rounded-lg transition-all shadow-sm"
        >
          Annuler
        </button>

        {!isValidated && (
          <button
            onClick={handleSubmit}
            className="px-20 py-2.5 bg-card border-2 border-gray text-[#E30613] font-semibold rounded-lg transition-all shadow-sm"
          >
            Valider l'essai
          </button>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { authFetch } from "../api";
import { CheckCircle, XCircle, AlertTriangle, Upload } from "lucide-react";
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
interface ValidationCharge {
  id?: number;
  validation?: "OK" | "NOK" | "OK_SOUS_RESERVE";
  commentaire?: string;
  oetbRenseigne?: boolean;
  dateValidation?: string;

  fichierINCA?: string;
  fichierBaR?: string;
  fichierChecklist?: string;
  fichierINCAPath?: string;
  fichierBaRPath?: string;
  fichierChecklistPath?: string;
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
  validationCharge?: ValidationCharge;
}

const checklistData = [
  { critere: "Passage en D 20s", statut: "OK" },
  { critere: "Rec. calage temporel", statut: "OK" },
  { critere: "LDR", statut: "OK" },
  { critere: "Lien de banc", statut: "OK" },
  { critere: "CD", statut: "OK" },
  { critere: "Conduite", statut: "OK" },
  { critere: "SOC init 12V", statut: "OK" },
  { critere: "STT", statut: "OK" },
];

export function ValidationCharge() {
  const { id } = useParams<{ id: string }>();
  const [demande, setDemande] = useState<DemandeEssai | null>(null);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const isValidated = ["OK", "NOK", "OK_SOUS_RESERVE"].includes(
    demande?.validationCharge?.validation ?? "",
  );

  const isReadOnly = isValidated;

  const [oetbChecked, setOetbChecked] = useState(false);
  const [fichierINCA, setFichierINCA] = useState<File | null>(null);
  const [fichierBaR, setFichierBaR] = useState<File | null>(null);
  const [fichierChecklist, setFichierChecklist] = useState<File | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      const validationData = {
        validation: selectedStatus,
        commentaire: comment,
        oetbRenseigne: oetbChecked,
      };

      formData.append(
        "validation",
        new Blob([JSON.stringify(validationData)], {
          type: "application/json",
        }),
      );

      if (fichierINCA) {
        formData.append("fichierINCA", fichierINCA);
      }

      if (fichierBaR) {
        formData.append("fichierBaR", fichierBaR);
      }

      if (fichierChecklist) {
        formData.append("fichierChecklist", fichierChecklist);
      }

      await authFetch(`/validation_charge/valider/${id}`, {
        method: "POST",
        body: formData,
      });

      toast.success("Validation enregistrée");

      navigate("/app/validation");
    } catch (error) {
      console.error("Erreur validation :", error);
      toast.error("Erreur lors de la validation");
    }
  };

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
  useEffect(() => {
    if (isValidated) {
      toast.success("Cet essai est déjà validé .");
    }
  }, [isValidated]);

  useEffect(() => {
    if (demande?.validationCharge) {
      setSelectedStatus(demande.validationCharge.validation ?? null);
      setComment(demande.validationCharge.commentaire ?? "");
      setOetbChecked(demande.validationCharge.oetbRenseigne ?? false);
    }
  }, [demande]);
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

  
  const viewFile = async (path?: string) => {
  if (!path) return;
  try {
    const token = localStorage.getItem("token");
   const response = await fetch(
  `http://localhost:8080/api/validation_charge/view?path=${encodeURIComponent(path)}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
    if (!response.ok) throw new Error();
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  } catch {
    toast.error("Impossible d'ouvrir le fichier");
  }
};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Validation Chargé d'essai
        </h1>
      </div>

      {/* Carte récapitulative */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#B9032C] text-white">
              <tr className="text-xs uppercase tracking-wider text-white">
                <th className="px-2 py-4 font-semibold text-white">
                  Nom de demande
                </th>
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
                <tr className="border-b border-border transition-colors group">
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

                  <td>
                    <span className="px-2 py-1 text-muted-foreground-600 rounded text-xs">
                      {demande.statutGlobal}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground-600">
                    {demande.statutDemande}
                  </td>

                  <td className="py-4 text-muted-foreground-600">
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

      {/* Import fichiers */}
      {/* Import fichiers */}
      <div className="bg-card rounded-xl shadow-sm px-3 py-2">
        <h3 className="text-base font-semibold mb-3">Import des fichiers</h3>

        <div className="grid grid-cols-3 gap-3">
          {/* INCA */}
          <label className="border border-border rounded-lg p-3 text-center hover:border-[#E30613] transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs font-medium mb-1">Acquisition INCA</div>
            <div className="text-[10px] text-gray-500">.dat, .mf4</div>

            {/* Fichier déjà uploadé → bouton de visualisation */}
            {demande?.validationCharge?.fichierINCAPath && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  viewFile(demande.validationCharge!.fichierINCAPath!);
                }}
                className="text-[10px] mt-2 text-[#E30613] underline block w-full"
              >
                📄 {demande.validationCharge.fichierINCA}
              </button>
            )}
            {/* Nouveau fichier sélectionné (mode non-validé) */}
            {!isReadOnly && fichierINCA && (
              <div className="text-[10px] mt-1 text-gray-500">
                {fichierINCA.name}
              </div>
            )}
            <input
              type="file"
              disabled={isReadOnly}
              accept="*"
              hidden
              onChange={(e) => setFichierINCA(e.target.files?.[0] || null)}
            />
            {/* accept=".dat,.mf4" */}
          </label>

          {/* BaR */}
          {/* BaR */}
          <label className="border border-border rounded-lg p-3 text-center hover:border-[#E30613] transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs font-medium mb-1">Fichier BàR</div>
            <div className="text-[10px] text-gray-500">.xlsx</div>

            {demande?.validationCharge?.fichierBaRPath && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  viewFile(demande.validationCharge!.fichierBaRPath!);
                }}
                className="text-[10px] mt-2 text-[#E30613] underline block w-full"
              >
                📄 {demande.validationCharge.fichierBaR}
              </button>
            )}

            {!isReadOnly && fichierBaR && (
              <div className="text-[10px] mt-1 text-gray-500">
                {fichierBaR.name}
              </div>
            )}

            <input
              type="file"
              disabled={isReadOnly}
              accept="*"
              hidden
              onChange={(e) => setFichierBaR(e.target.files?.[0] || null)}
            />
            {/*accept=".xlsx"*/}
          </label>

          {/* Checklist */}
          {/* Checklist */}
          <label className="border border-border rounded-lg p-3 text-center hover:border-[#E30613] transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs font-medium mb-1">Checklist</div>
            <div className="text-[10px] text-gray-500">.xlsx</div>

            {demande?.validationCharge?.fichierChecklistPath && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  viewFile(demande.validationCharge!.fichierChecklistPath!);
                }}
                className="text-[10px] mt-2 text-[#E30613] underline block w-full"
              >
                📄 {demande.validationCharge.fichierChecklist}
              </button>
            )}

            {!isReadOnly && fichierChecklist && (
              <div className="text-[10px] mt-1 text-gray-500">
                {fichierChecklist.name}
              </div>
            )}

            <input
              type="file"
              disabled={isReadOnly}
              accept="*"
              hidden
              onChange={(e) => setFichierChecklist(e.target.files?.[0] || null)}
            />
            {/*accept=".xlsx"*/}
          </label>
        </div>
      </div>

      {/* Validation demandeur */}
      <div className="bg-card rounded-xl shadow-sm p-3">
        <h3 className="text-lg font-semibold mb-4">
          Validation chargé d'essai
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            disabled={isReadOnly}
            onClick={() => !isReadOnly && setSelectedStatus("OK")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStatus === "OK"
                ? "bg-[#E8F5E9] border-[#2E7D32]"
                : "bg-card border-[#E0E0E0] hover:border-[#2E7D32]"
            }`}
          >
            <CheckCircle className="w-8 h-8 text-[#2E7D32] mx-auto mb-2" />
            <div className="font-medium">OK - Essai valide</div>
          </button>

          <button
            disabled={isReadOnly}
            onClick={() => !isReadOnly && setSelectedStatus("NOK")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStatus === "NOK"
                ? "bg-[#FFEBEE] border-[#C62828]"
                : "bg-card border-[#E0E0E0] hover:border-[#C62828]"
            }`}
          >
            <XCircle className="w-8 h-8 text-[#C62828] mx-auto mb-2" />
            <div className="font-medium">NOK - Essai non valide</div>
          </button>

          <button
            disabled={isReadOnly}
            onClick={() => !isReadOnly && setSelectedStatus("OK_SOUS_RESERVE")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStatus === "OK_SOUS_RESERVE"
                ? "bg-[#FFF3E0] border-[#ED6C02]"
                : "bg-card border-[#E0E0E0] hover:border-[#ED6C02]"
            }`}
          >
            <AlertTriangle className="w-8 h-8 text-[#ED6C02] mx-auto mb-2" />
            <div className="font-medium">OK sous réserve</div>
          </button>
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-6">
          <input
            type="checkbox"
            disabled={isReadOnly}
            checked={oetbChecked}
            onChange={(e) => setOetbChecked(e.target.checked)}
            className="w-5 h-5 text-black rounded focus:[#E30613]"
          />
          <span className="text-sm">OETB</span>
        </label>
      </div>
      {/* OETB */}

      <div className="bg-card rounded-xl shadow-sm p-6">
        <label className="block text-lg font-semibold mb-3">
          Commentaire de chargé d'essai
        </label>
        <textarea
          disabled={isReadOnly}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border border-border resize-none"
          placeholder="Décrivez le déroulement de l'essai, le comportement du véhicule, les problèmes rencontrés..."
        />
      </div>
      {/* Boutons */}
      <div className="flex justify-end gap-12 mt-8">
        <button
          onClick={() => navigate("/app/validation")}
          className="px-8 py-2.5 bg-card border-2 border-border text-[#E30613] font-semibold rounded-lg transition-all shadow-sm"
        >
          Annuler
        </button>

        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus}
            className="px-10 py-2.5 bg-card border-2 border-border text-[#E30613] font-semibold rounded-lg transition-all shadow-sm"
          >
            Valider l'essai
          </button>
        )}
      </div>
    </div>
  );
}

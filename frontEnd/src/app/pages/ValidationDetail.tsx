import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { authFetch } from "../api";
import { FileText, Eye } from "lucide-react";
import { toast } from "sonner";
interface User {
  nom?: string;
  prenom?: string;
}
interface ValidationTechnicien {
  decision?: string;
  commentaire?: string;
  technicien?: User;
}
interface Client {
  id?: number;
  nom: string;
}
interface ValidationCharge {
  validation?: string;
  commentaire?: string;
  charge?: User;

  fichierINCA?: string;
  fichierINCAPath?: string;

  fichierBaR?: string;
  fichierBaRPath?: string;

  fichierChecklist?: string;
  fichierChecklistPath?: string;

  dateValidation?: string;
}

interface DemandeEssai {
  id?: number;
  nomAuto?: string;
  numeroProjet?: number;
  client: Client;
  demandeur?: string;
  technicien?: string;
  datePlanification?: string;
  shift?: string;
  statutGlobal?: string;

  validationTechnicien?: ValidationTechnicien;
  validationCharge?: ValidationCharge;
}

const getBadgeColor = (status?: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-700";

    case "NOK":
      return "bg-red-100 text-red-700";

    case "OK_SOUS_RESERVE":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function ValidationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [demande, setDemande] = useState<DemandeEssai | null>(null);
  const openFile = async (path?: string) => {
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

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const data = await authFetch(`/demandes-essai/${id}`);
        console.log("📦 Données récupérées :", data);

        setDemande(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchDemande();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Détail validation
        </h1>

        <p className="text-foreground">Consultation complète des validations</p>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#B9032C] text-white">
              <tr>
                <th className="px-4 py-4 text-left">Nom</th>
                <th className="px-4 py-4 text-left">Projet</th>
                <th className="px-4 py-4 text-left">Client</th>
                <th className="px-4 py-4 text-left">Demandeur</th>
                <th className="px-4 py-4 text-left">Date</th>
                <th className="px-4 py-4 text-left">Shift</th>
                <th className="px-4 py-4 text-left">Statut</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-4">{demande?.nomAuto}</td>
                <td className="px-4 py-4">{demande?.numeroProjet}</td>
                <td className="px-4 py-4">{demande?.client?.nom}</td>
                <td className="px-4 py-4">{demande?.demandeur}</td>
                <td className="px-4 py-4">{demande?.datePlanification}</td>
                <td className="px-4 py-4">{demande?.shift}</td>
                <td className="px-4 py-4">{demande?.statutGlobal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Validation technicien */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Validation technicien</h2>

            <p className="text-base text-muted-foreground-500">
              {demande?.validationTechnicien?.technicien
                ? `${demande.validationTechnicien.technicien.prenom} ${demande.validationTechnicien.technicien.nom}`
                : "Non renseigné"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base text-muted-foreground-500 mb-1">
                Décision
              </p>

              <span
                className={`px-3 py-1 rounded-full text-base font-medium ${getBadgeColor(
                  demande?.validationTechnicien?.decision,
                )}`}
              >
                {demande?.validationTechnicien?.decision ?? "-"}
              </span>
            </div>

            <div>
              <p className="text-base text-muted-foreground-500 mb-1">
                Commentaire
              </p>

              <div className="p-2 rounded-lg bg-muted min-h-[80px]">
                {demande?.validationTechnicien?.commentaire ||
                  "Aucun commentaire"}
              </div>
            </div>
          </div>
        </div>

        {/* Validation chargé */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Validation chargé d'essai</h2>

            <p className="text-lg text-muted-foreground-500">
              {demande?.validationCharge?.charge
                ? `${demande.validationCharge.charge.prenom ?? ""} ${demande.validationCharge.charge.nom ?? ""}`.trim()
                : "Non renseigné"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base text-muted-foreground-500 mb-1">
                Décision
              </p>

              <span
                className={`px-3 py-1 rounded-full text-base font-medium ${getBadgeColor(
                  demande?.validationCharge?.validation,
                )}`}
              >
                {demande?.validationCharge?.validation ?? "-"}
              </span>
            </div>

            <div>
              <p className="text-base text-muted-foreground-500 mb-1">
                Commentaire
              </p>

              <div className="p-3 rounded-lg bg-muted min-h-[80px]">
                {demande?.validationCharge?.commentaire || "Aucun commentaire"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fichiers */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">
          Fichiers transmis par le chargé
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* INCA */}
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-4">
              <FileText className="w-7 h-7 text-blue-600 mb-3" />
              <h3 className="font-medium">Acquisition INCA</h3>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground-500">
                {demande?.validationCharge?.fichierINCA || "Aucun fichier"}
              </p>

              {demande?.validationCharge?.fichierINCA && (
                <button
                  onClick={() =>
                    openFile(demande?.validationCharge?.fichierINCAPath)
                  }
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
              )}
            </div>
          </div>

          {/* BAR */}
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-4">
              <FileText className="w-7 h-7 text-green-600 mb-3" />

              <h3 className="font-medium mb-1">Fichier BàR</h3>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground-500">
                {demande?.validationCharge?.fichierBaR || "Aucun fichier"}
              </p>

              {demande?.validationCharge?.fichierBaR && (
                <button
                  onClick={() =>
                    openFile(demande?.validationCharge?.fichierBaRPath)
                  }
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-4">
              <FileText className="w-7 h-7 text-orange-600 mb-3" />

              <h3 className="font-medium mb-1">Checklist</h3>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground-500">
                {demande?.validationCharge?.fichierChecklist || "Aucun fichier"}
              </p>

              {demande?.validationCharge?.fichierChecklist && (
                <button
                  onClick={() =>
                    openFile(demande?.validationCharge?.fichierChecklistPath)
                  }
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/app/validation")}
          className="px-8 py-2 border border-border rounded-lg text-[#E30613] font-semibold"
        >
          Retour
        </button>
      </div>
    </div>
  );
}

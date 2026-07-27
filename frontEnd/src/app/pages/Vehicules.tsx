import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit, Copy, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { authFetch } from "../api";
import { toast } from "sonner";
// --- Types ---

export enum TypeMotorisation {
  ICE = "ICE",
  HEV = "HEV",
  BEV = "BEV",
  PHEV = "PHEV",
}
interface Client {
  id?: number;
  nom: string;
}
export enum Localisation {
  OZ001 = "OZ001",
  OZ002 = "OZ002",
  OZ003 = "OZ003",
  OZ004 = "OZ004",
}
export enum TypeCarburant {
  ESSENCE = "ESSENCE",
  DIESEL = "DIESEL",
  GNV = "GNV",
}
export enum ModeConduite {
  TRACTION = "TRACTION",
  QUATRE_X_QUATRE = "QUATRE_X_QUATRE",
  AUTRE = "AUTRE",
}

interface Vehicle {
  id: number;
  nomAppliImmat: string;
  identificateur: string;
  marque: string;
  immatriculation: string;
  vin: string;
  site: string;
  responsable: string;
  moteur: string;
  boiteVitesse: string;
  couleur: string;
  dimensionsPneus: string;
  puissance: number;
  empattement: Number;
  localisation: Localisation;
  clientId: number;
  client?: Client;
  motorisation: TypeMotorisation;
  carburant: TypeCarburant;
  modeConduite: ModeConduite;
  commentaire: string;
  plateformeVehicule: string;
  architectureElectrique: string;
}

const motorisationStyles: Record<string, string> = {
  ICE: "bg-red-100 text-red-700",
  HEV: "bg-orange-100 text-orange-700",
  BEV: "bg-green-100 text-green-700",
  PHEV: "bg-blue-100 text-blue-700",
};
const numberFields = ["puissance", "empattement"];
export function Vehicules() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [role, setRole] = useState<string>("");
  // États pour les filtres
  const isAdmin = role?.includes("ADMIN");
  const [filterMotorisation, setFilterMotorisation] = useState("Tous");
  const [clientFilter, setClientFilter] = useState("Tous");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [filterLocalisation, setFilterLocalisation] = useState("Tous");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userClient, setUserClient] = useState<string>("");
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await authFetch("/vehicules");
        setVehicles(data ?? []);
      } catch (err) {
        console.error("Erreur fetch véhicules :", err);
        setVehicles([]);
      }
    };
    fetchVehicles();
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);
  const handleAddVehicle = async (vehicle: any) => {
    try {
      const data = await authFetch("/vehicules", {
        method: "POST",
        body: JSON.stringify(vehicle),
      });

      setVehicles((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  // Logique de filtrage
  const filteredVehicles = vehicles.filter((v) => {
    const search = searchTerm.toLowerCase();

    const matchSearch =
      (v.immatriculation ?? "").toLowerCase().includes(search) ||
      (v.vin ?? "").toLowerCase().includes(search) ||
      (v.nomAppliImmat ?? "").toLowerCase().includes(search) ||
      (v.identificateur ?? "").toLowerCase().includes(search) ||
      (v.marque ?? "").toLowerCase().includes(search);

    const matchesClient =
      clientFilter === "Tous" || v.client?.id === Number(clientFilter);

    const matchLoc =
      filterLocalisation === "Tous" || v.localisation === filterLocalisation;

    return matchSearch && matchesClient && matchLoc;
  });

  // Initial fetch

  const addVehicle = async (newVehicle: Vehicle) => {
    try {
      const created = await authFetch("/vehicules", {
        method: "POST",
        body: JSON.stringify(newVehicle),
      });
      setVehicles((prev) => [...prev, created]);
      setShowModal(false);
      toast.success("Véhicule créé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du véhicule !");
    }
  };
  const deleteVehicle = async (id: number) => {
    try {
      await authFetch(`/vehicules/${id}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Véhicule supprimé avec succès !");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key")
          ? "Suppression impossible : ce véhicule est utilisé dans d'autres données."
          : "Erreur lors de la suppression du véhicule.";

      toast.error(message);
    }
  };

  const duplicateVehicle = async (id: number) => {
    try {
      const duplicated = await authFetch(`/vehicules/duplicate/${id}`, {
        method: "POST",
      });
      setVehicles((prev) => [...prev, duplicated]);
      toast.success("Véhicule dupliqué  avec succès!");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la duplication !");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as any;

    const vehicleData = {
      ...data,
      clientId: Number(data.clientId),
      puissance: Number(data.puissance) || 0,
      empattement: Number(data.empattement) || 0,
      dimensionsPneus: Number(data.dimensionsPneus) || 0,
    };

    try {
      if (modalMode === "edit" && selectedVehicle) {
        const updated = await authFetch(`/vehicules/${selectedVehicle.id}`, {
          method: "PUT",
          body: JSON.stringify(vehicleData),
        });

        setVehicles((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        );

        toast.success("Véhicule modifié avec succès !");
      } else {
        await addVehicle(vehicleData);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur !");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 p-3">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2 text-left">
            Gestion des véhicules
          </h1>
          <p className="text-muted-foreground">Gérer vos véhicules</p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setSelectedVehicle(null);
              setModalMode("add");
              setShowModal(true);
            }}
            className="ml-auto h-11 px-6 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter un véhicule
          </button>
        )}
      </div>

      {/* Barre de Recherche et Filtres améliorée */}
      <div className="w-full p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-8">
        <div className="flex flex-wrap items-center gap-4 w-full">
          {/* Barre de recherche */}
          <div className="relative flex-1 w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-600 transition-colors group-focus-within:text-[#E30613]" />
            <input
              type="text"
              placeholder="Recherche par nom, identificateur, immatriculation, marque"
              className="w-full h-11 pl-10 pr-8 bg-background text-foreground border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) => role?.includes(r)) && (
            <select
              className="
  w-full sm:w-60 h-12 px-4
  bg-background
  text-foreground
  border border-border
  rounded-lg shadow-sm text-sm
  focus:outline-none focus:ring-2 focus:ring-ring
  transition
"
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

          {/* Filtre localisation */}
          <select
            className="
  w-full sm:w-60 h-12 px-4
  bg-background
  text-foreground
  border border-border
  rounded-lg shadow-sm text-sm
  focus:outline-none focus:ring-2 focus:ring-ring
  transition
"
            onChange={(e) => setFilterLocalisation(e.target.value)}
          >
            <option value="Tous">Localisation (Toutes)</option>
            <option value="PARK_FEV_CA">Park FEV CA</option>
            <option value="BAR">BAR</option>
            <option value="HORS_FEV">Hors FEV</option>
          </select>
        </div>
      </div>
      {/* Tableau des résultats */}
      {/* Tableau véhicules */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className="bg-[#B9032C] border-b border-border">
              <tr>
                <th className="px-6 py-5 font-semibold text-white">Véhicule</th>
                <th className="px-6 py-5  font-semibold text-white">
                  Identificateur
                </th>
                <th className="px-6 py-5  font-semibold text-white">Client</th>

                <th className="px-4 py-5 font-semibold text-white">
                  Immatriculation
                </th>
                <th className="px-6 py-5 font-semibold text-white">Marque</th>

                <th className="px-6 py-5 font-semibold text-white">
                  Localisation
                </th>

                <th className="px-6 py-5 font-semibold text-white">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredVehicles.map((v) => {
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    motorisationStyles[v.motorisation] ||
                    "bg-card-100 text-muted-foreground-700"
                  }`}
                >
                  {v.motorisation}
                </span>;

                return (
                  <tr
                    key={v.id}
                    className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                  >
                    {/* Véhicule */}
                    <td className="px-4 py-4 font-bold text-muted-foreground-800">
                      {v.nomAppliImmat}
                    </td>

                    {/* Identificateur  */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {v.identificateur}
                    </td>
                    {/* Client  */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {v.client?.nom}
                    </td>

                    {/* Immatriculation */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {v.immatriculation}
                    </td>
                    {/* Marque  */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {v.marque}
                    </td>

                    {/* Localisation */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {v.localisation}
                    </td>

                    {/* Catalyseur */}

                    {/* Actions */}
                    <td className="px-1 py-4">
                      <div className="flex items-center gap-2">
                        {/* Actions réservées */}
                        {canEdit && (
                          <>
                            {/* Modifier */}
                            <button
                              onClick={() => {
                                setSelectedVehicle(v);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              className="p-1 rounded-lg bg-green-100 hover:bg-green-300"
                            >
                              <Edit className="w-4 h-4 text-green-700" />
                            </button>
                            {/* Dupliquer */}
                            <button
                              onClick={() => duplicateVehicle(v.id)}
                              className="p-1 rounded-lg bg-gray-200 hover:bg-gray-400"
                            >
                              <Copy className="w-4 h-4 text-gray-700" />
                            </button>
                            {/* Supprimer */}
                            <button
                              onClick={() => {
                                setSelectedVehicle(v); // IMPORTANT
                                setShowConfirmDelete(true); // OUVRIR DIALOG
                              }}
                              className="p-1 rounded-lg bg-red-100 hover:bg-red-300"
                            >
                              <Trash2 className="w-4 h-4 text-red-700" />
                            </button>
                          </>
                        )}
                        {/* Voir détails : tout le monde */}
                        <button
                          onClick={() => {
                            setSelectedVehicle(v);
                            setModalMode("view");
                            setShowModal(true);
                          }}
                          className="p-1 rounded-lg bg-blue-100 hover:bg-blue-300"
                        >
                          <Eye className="w-4 h-4 text-blue-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Aucun résultat */}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground-400"
                  >
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selectedVehicle?.nomAppliImmat}</span>{" "}
            ?
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
                if (selectedVehicle) {
                  deleteVehicle(selectedVehicle.id);
                }
                setShowConfirmDelete(false);
                setSelectedVehicle(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL D'AJOUT (CAHIER DES CHARGES COMPLET) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card w-[95vw] h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground">
              <div className="flex justify-between items-center p-2 border-b bg-card border-b border-border">
                {modalMode === "add" && "Ajouter un véhicule"}
                {modalMode === "edit" && "Modifier un véhicule"}
                {modalMode === "view" && "Détails du véhicule"}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 bg-card min-h-[70vh]">
            <form className="space-y-6 mt-2" onSubmit={handleSubmit}>
              {" "}
              {/* SECTION IDENTIFICATION */}
              <p className="text-sm text-muted-foreground-500"></p>
              <div>
                <h3 className="text-sm font-semibold text-[#E30613] mb-2 uppercase tracking-wide">
                  Identification du véhicule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[
                    {
                      label: "Nom (Appli_Immat)",
                      key: "nomAppliImmat",
                      required: true,
                    },
                    {
                      label: "Identificateur",
                      key: "identificateur",
                      placeholder: "Automatique",
                      required: true,
                    },
                    {
                      label: "Immatriculation",
                      key: "immatriculation",
                      required: true,
                    },
                    {
                      label: "Marque",
                      key: "marque",
                      required: true,
                    },
                    { label: "VIN", key: "vin", required: true },
                    {
                      label: "Site",
                      key: "site",
                      required: true,
                    },
                    {
                      label: "Responsable",
                      key: "responsable",
                    },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground-500">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      <input
                        name={field.key}
                        required={field.required}
                        defaultValue={
                          selectedVehicle?.[
                            field.key as keyof Vehicle
                          ]?.toString() ?? ""
                        }
                        disabled={
                          modalMode === "view" || field.key === "identificateur"
                        }
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>
                  ))}

                  {/* Client */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground-500">
                      Client <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="clientId"
                      defaultValue={selectedVehicle?.client?.id ?? ""}
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring transition"
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

                  {/* Localisation */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Localisation
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="localisation"
                      defaultValue={selectedVehicle?.localisation ?? ""}
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="" disabled>
                        Sélectionner
                      </option>

                      {["HORS_FEV", "BAR", " PARC_FEV_CA"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* MOTORISATION */}
              <div>
                <h3 className="text-sm font-semibold text-[#E30613] mb-2 uppercase tracking-wide">
                  Motorisation
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground-500">
                      Type moteur
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      name="motorisation"
                      defaultValue={selectedVehicle?.motorisation ?? ""}
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="" disabled>
                        Sélectionner
                      </option>

                      {["ICE", "HEV", "PHEV", "BEV"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground-500">
                      Carburant
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      name="carburant"
                      defaultValue={selectedVehicle?.carburant ?? ""}
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="" disabled>
                        Sélectionner
                      </option>

                      {["ESSENCE", "DIESEL", "GNV"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {[
                    {
                      label: "Code moteur",
                      key: "moteur",
                      required: true,
                    },
                    {
                      label: "Boite vitesse",
                      key: "boiteVitesse",
                      required: true,
                    },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground-500">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <input
                        name={field.key}
                        required={field.required}
                        defaultValue={
                          selectedVehicle?.[
                            field.key as keyof Vehicle
                          ]?.toString() ?? ""
                        }
                        disabled={modalMode === "view"}
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* CARACTERISTIQUES */}
              {/* CARACTERISTIQUES */}
              <div>
                <h3 className="text-sm font-semibold text-[#E30613] mb-2 uppercase tracking-wide">
                  Caractéristiques
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    {
                      label: "dimensions de pneus (mm)",
                      key: "dimensionsPneus",
                    },

                    {
                      
                      label: "Puissance (kW)",
                      key: "puissance",
                    },
                    {
                      label: "Empattement (mm)",
                      key: "empattement",
                      required: true,
                    },
                    { label: "Couleur", key: "couleur" },
                    {
                      label: "Plateforme véhicule",
                      key: "plateformeVehicule",
                    },
                    {
                      label: "Architecture électrique",
                      key: "architectureElectrique",
                    },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                      <label className="text-sm text-muted-foreground-500">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.key === "typeCatalyseur" ? (
                        <select
                          defaultValue={
                            selectedVehicle?.[
                              field.key as keyof Vehicle
                            ]?.toString() ?? ""
                          }
                          name="typeCatalyseur"
                          required
                          disabled={modalMode === "view"}
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
 focus:outline-none focus:ring-2 focus:ring-ring transition"
                        ></select>
                      ) : (
                        <input
                          name={field.key}
                          type={
                            numberFields.includes(field.key) ? "number" : "text"
                          }
                          required={field.required}
                          defaultValue={
                            selectedVehicle?.[
                              field.key as keyof Vehicle
                            ]?.toString() ?? ""
                          }
                          disabled={modalMode === "view"}
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-muted-foreground-500">
                  Commentaire
                </label>

                <textarea
                  name="commentaire"
                  rows={4}
                  defaultValue={selectedVehicle?.commentaire ?? ""}
                  disabled={modalMode === "view"}
                  className="w-full px-3 py-3 rounded-lg border border-border bg-background text-foreground
    focus:outline-none focus:ring-2 focus:ring-ring transition resize-y"
                  placeholder="Saisir un commentaire..."
                />
              </div>
              {/* FOOTER */}
              {modalMode !== "view" && (
                <div className="flex justify-end gap-3 ">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVehicle(null);
                      setModalMode("add");
                      setShowModal(false);
                    }}
                    className="px-8 py-2 border rounded-lg hover:bg-muted"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-2 bg-[#E30613] text-white rounded-lg
            hover:brightness-110 transition shadow"
                  >
                    Enregistrer
                  </button>
                </div>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

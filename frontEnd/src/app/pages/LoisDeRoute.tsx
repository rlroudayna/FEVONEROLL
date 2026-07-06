import { useState, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { authFetch } from "../api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

export enum Norme {
  WLTP = "WLTP",
  NEDC = "NEDC",
  RDE = "RDE",
}
interface Client {
  id?: number;
  nom: string;
}

interface Lois {
  id?: number;
  nom: string;
  temperature: number | null;

  client?: Client;
  clientId: number;
  norme: Norme | "";
  inertieKg: number | null;
  masseEssaiKg: number | null;
  inertieRotativeTNRKg: number | null;
  inertieRotativeDeuxTrainsKg: number | null;
  f0: number | null;
  f1: number | null;
  f2: number | null;
  description: string;
}
const INITIAL_LOIS: Lois = {
  nom: "",
  temperature: null,
  clientId: 0,
  norme: "",
  inertieKg: null,
  masseEssaiKg: null,
  inertieRotativeTNRKg: null,
  inertieRotativeDeuxTrainsKg: null,
  f0: null,
  f1: null,
  f2: null,
  description: "",
};
export function LoisDeRoute() {
  const [lois, setLois] = useState<any[]>([]);
  const [LoisToDelete, setVehicleToDelete] = useState<Lois | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [selectedLois, setSelectedLois] = useState<Lois | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loisToDelete, setLoisToDelete] = useState<Lois | null>(null);
  const isReadOnly = modalMode === "view";
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInertie, setSearchInertie] = useState("");
  const [clientFilter, setClientFilter] = useState("Tous");
  const [normeFilter, setNormeFilter] = useState("Tous");
   const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );

  const [role, setRole] = useState<string>("");
  const isAdmin = role?.includes("ADMIN");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [userClient, setUserClient] = useState<Client | null>(null);
  const filteredLois = lois.filter((loi) => {
    const matchNom =
      searchTerm === "" ||
      loi.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClient =
      clientFilter === "Tous" || loi.client?.id === Number(clientFilter);

    const matchInertie =
      searchInertie === "" || loi.inertieKg?.toString().includes(searchInertie);

    const matchNorme = normeFilter === "Tous" || loi.norme === normeFilter;

    return matchNom && matchesClient && matchInertie && matchNorme;
  });

  useEffect(() => {
    // Récupération des véhicules
    const fetchVehicles = async () => {
      try {
        const data = await authFetch("/lois-route");
        setLois(data ?? []); // ⚡ Si data est null, on met un tableau vide
      } catch (err) {
        console.error("Erreur fetch véhicules :", err);
        setLois([]);
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
  const handleAddLois = async (vehicle: any) => {
    try {
      const data = await authFetch("/lois-route", {
        method: "POST",
        body: JSON.stringify(vehicle),
      });

      setLois((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
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

  const addLois = async (newLois: Lois) => {
    try {
      const created = await authFetch("/lois-route", {
        method: "POST",
        body: JSON.stringify(newLois),
      });
      setLois((prev) => [...prev, created]);
      setShowModal(false);
      toast.success("Lois de route créé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du lois !");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loisToSave: Lois = {
      ...newLois,
      clientId: newLois.client?.id ?? 0,
    };

    try {
      if (modalMode === "edit" && selectedLois?.id) {
        const updated = await authFetch(`/lois-route/${selectedLois.id}`, {
          method: "PUT",
          body: JSON.stringify(loisToSave),
        });

        setLois((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

        toast.success("Loi modifiée avec succès !");
      } else {
        const created = await authFetch("/lois-route", {
          method: "POST",
          body: JSON.stringify(loisToSave),
        });

        setLois((prev) => [...prev, created]);

        toast.success("Loi ajoutée avec succès !");
      }

      // reset propre du formulaire
      setShowModal(false);
      setNewLois(INITIAL_LOIS);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement !");
    }
  };
  const deleteLois = async (id: number) => {
    try {
      await authFetch(`/lois-route/${id}`, { method: "DELETE" });
      setLois((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lois de route supprimé !");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key")
          ? "Suppression impossible : cette loi de route est utilisée dans d'autres données."
          : "Erreur lors de la suppression de la loi de route.";

      toast.error(message);
    }
  };
  const [newLois, setNewLois] = useState<Lois>({
    nom: "",
    temperature: 0,
    clientId: 0,
    norme: Norme.WLTP,
    inertieKg: 0,
    masseEssaiKg: 0,
    inertieRotativeTNRKg: 0,
    inertieRotativeDeuxTrainsKg: 0,
    f0: 0,
    f1: 0,
    f2: 0,
    description: "",
  });

  const handleChange = (field: keyof Lois, value: any) => {
    setNewLois((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    if (modalMode === "view") return; 
    if (!newLois.client || !newLois.norme) return;

    const prefix = `Loi_${newLois.client.nom}_${newLois.norme}`;
    const regex = new RegExp(`^${prefix}_(\\d{4})$`);
    const numbers = lois
      .map((l) => {
        const match = l.nom?.match(regex);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null);
    const next = (Math.max(0, ...numbers) + 1).toString().padStart(4, "0");

    setNewLois((prev) => ({ ...prev, nom: `${prefix}_${next}` }));
  }, [newLois.client, newLois.norme, modalMode, lois]);

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

  return (
    <div className="space-y-5  p-3">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Gestion de lois de route
          </h1>
          <p className="text-muted-foreground">
            Paramétrer les lois de simulation des efforts routiers
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setModalMode("add");
              setSelectedLois(null);
              setNewLois({
                ...INITIAL_LOIS,
              });
              setShowModal(true);
            }}
            className="ml-auto h-11 px-6 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter une loi de route
          </button>
        )}
      </div>

      <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-4">
        {/* Recherche nom */}
        <div className="flex-1 relative ">
          <Search className="absolute  bg-card left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400" />

          <input
            type="text"
            placeholder="Rechercher par nom"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) => role?.includes(r)) && (
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
        <select
          className="w-full sm:w-48 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
          value={normeFilter}
          onChange={(e) => setNormeFilter(e.target.value)}
        >
          <option value="Tous">Norme (Toutes)</option>
          <option value={Norme.WLTP}>WLTP</option>
          <option value={Norme.NEDC}>NEDC</option>
          <option value={Norme.RDE}>RDE</option>
        </select>
        {/* Recherche inertie */}
        <div className="w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400" />

          <input
            type="number"
            placeholder="Rechercher par inertie"
            value={searchInertie}
            onChange={(e) => setSearchInertie(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {/* Bouton */}
        {/* Bouton Ajouter */}
      </div>
      {/* Tableau des lois */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            {/* Header */}
            <thead className="bg-[#B9032C] border-b border-border">
              <tr>
                <th className="px-8 py-3 font-semibold text-white whitespace-nowrap">
                  Nom du loi
                </th>

                <th className="px-10 py-3 font-semibold text-white whitespace-nowrap">
                  Client
                </th>

                <th className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                  Norme
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>Température</span>
                    <span className="text-xs font-normal opacity-80">(°C)</span>
                  </div>
                </th>

                <th className="px-1 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>Inertie</span>
                    <span className="text-xs font-normal opacity-80">(kg)</span>
                  </div>
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>Masse d’essai</span>
                    <span className="text-xs font-normal opacity-80">(kg)</span>
                  </div>
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>Inertie TNR</span>
                    <span className="text-xs font-normal opacity-80">(kg)</span>
                  </div>
                </th>

                <th className="px-1 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>Inertie 2T</span>
                    <span className="text-xs font-normal opacity-80">(kg)</span>
                  </div>
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>F0</span>
                    <span className="text-xs font-normal opacity-80">(N)</span>
                  </div>
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>F1</span>
                    <span className="text-xs font-normal opacity-80">
                      (N/km/h)
                    </span>
                  </div>
                </th>

                <th className="px-2 py-3 font-semibold text-white text-center">
                  <div className="flex flex-col leading-tight">
                    <span>F2</span>
                    <span className="text-xs font-normal opacity-80">
                      (N/(km/h)²)
                    </span>
                  </div>
                </th>

                <th className="px-6 py-3 font-semibold text-white whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {filteredLois.map((loi) => (
                <tr
                  key={loi.id}
                  className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                >
                  {/* Nom - truncate pour éviter de casser la ligne si le nom est trop long */}
                  <td className="px-5 py-3 text-muted-foreground-800 font-bold ">
                    {loi.nom}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground-800">
                    {loi.client?.nom}
                  </td>

                  <td className="px-4 py-3S">
                    <span className="px-2 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {loi.norme}
                    </span>
                  </td>

                  <td className="px-9 py-3 text-muted-foreground-800">
                    {loi.temperature}
                  </td>

                  {/* Valeurs numériques - réduction des paddings pour gagner de la place */}
                  <td className="px-10 py-3 text-muted-foreground-800">
                    {loi.inertieKg}
                  </td>
                  <td className="px-12 py-3 text-muted-foreground-800">
                    {loi.masseEssaiKg}
                  </td>
                  <td className="px-12 py-3 text-muted-foreground-800">
                    {loi.inertieRotativeTNRKg}
                  </td>
                  <td className="px-8 py-3 text-muted-foreground-800">
                    {loi.inertieRotativeDeuxTrainsKg}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground-800">
                    {loi.f0}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground-800">
                    {loi.f1}
                  </td>
                  <td className="px-8 py-3 text-muted-foreground-800">
                    {loi.f2}
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      {/* Voir : tout le monde */}

                      {/* Actions seulement ADMIN ou CHARGE_ESSAI */}
                      
                      {canEdit && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedLois(loi);
                              setNewLois(loi);
                              setModalMode("edit");
                              setShowModal(true);
                            }}
                            className="p-1 rounded-lg bg-green-100 hover:bg-green-200"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>

                          <button
                            onClick={() => {
                              setLoisToDelete(loi);
                              setShowConfirmDelete(true);
                            }}
                            className="p-1 rounded-lg bg-red-100 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLois(loi);
                          setNewLois(loi);
                          setModalMode("view");
                          setShowModal(true);
                        }}
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                </tr>
              ))}
              {/* Aucun résultat */}
              {filteredLois.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-muted-foreground-400"
                  >
                    Aucune loi trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* On active le mode transparent ici */}
        <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
          {/* On active le mode transparent ici */}
          <DialogContent className="max-w-md" hideOverlay={true}>
            <DialogHeader>
              <DialogTitle>Confirmation de suppression</DialogTitle>
            </DialogHeader>
            <p className="py-4 text-muted-foreground-700">
              Voulez-vous vraiment supprimer le véhicule{" "}
              <span className="font-bold">{selectedLois?.nom}</span> ?
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
                  if (loisToDelete?.id != null) {
                    deleteLois(loisToDelete.id);
                  }
                  setShowConfirmDelete(false);
                  setLoisToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirmer suppression
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {showModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card w-full max-w-[500px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
              {/* HEADER */}
              <div className="px-6 py-3.5 border-b border-slate-300 flex justify-between items-center bg-card">
                <h2 className="text-xl font-semibold text-muted-foreground-800">
                  {modalMode === "add" && "Ajouter une loi de route"}
                  {modalMode === "edit" && "Modifier la loi de route"}
                  {modalMode === "view" && "Détails de la loi de route"}
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* BODY */}

              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto p-6 space-y-6 bg-card"
              >
                {" "}
                {/* SECTION 1: Identification */}
                <section className="">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      {" "}
                      Identification
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Nom de la loi",
                        type: "text",
                        required: true,
                        placeholder: "Loi_Client_Norme (auto)",
                        disabled: true,
                        field: "nom",
                      },
                      {
                        label: "Température (°C)",
                        type: "number",
                        required: true,

                        field: "temperature",
                      },
                    ].map((field, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground-530">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled={field.field === "nom" || isReadOnly}
                          required={field.required} // ✅ IMPORTANT
                          value={(newLois as any)[field.field]}
                          onChange={(e) =>
                            handleChange(
                              field.field as keyof Lois,
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                            )
                          }
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                        />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground-900">
                        Client <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="client"
                        value={newLois.client?.id ?? newLois.clientId ?? 0}
                        required
                        disabled={modalMode === "view"}
                        onChange={(e) => {
                          const selectedClient = clients.find(
                            (c) => c.id === Number(e.target.value),
                          );

                          handleChange("client", selectedClient || null);
                        }}
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring transition"
                      >
                        <option value={0} disabled>
                          Sélectionner un client
                        </option>

                        {activeClients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground-900">
                        Norme
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <select
                        value={newLois.norme}
                        disabled={isReadOnly}
                        required
                        onChange={(e) =>
                          handleChange("norme", e.target.value as Norme)
                        }
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                      >
                        <option value="">Sélectionner</option>
                        <option>WLTP</option>
                        <option>NEDC</option>
                        <option>RDE</option>
                      </select>
                    </div>
                  </div>
                </section>
                {/* SECTION 2: Paramètres d'inertie */}
                <section className="">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      Paramètres d'inertie
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Inertie (kg)", field: "inertieKg" },
                      { label: "Masse d'essai (kg)", field: "masseEssaiKg" },
                      {
                        label: "Inertie Rot. (1 train)",
                        field: "inertieRotativeTNRKg",
                      },
                      {
                        label: "Inertie Rot. (2 trains)",
                        field: "inertieRotativeDeuxTrainsKg",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground-530">
                          {item.label}
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          type="number"
                          disabled={isReadOnly}
                          required
                          value={(newLois as any)[item.field]}
                          onChange={(e) =>
                            handleChange(
                              item.field as keyof Lois,
                              Number(e.target.value),
                            )
                          }
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                {/* SECTION 3: Coefficients */}
                <section className="">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      Coefficients de résistance
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "F0 (N)", field: "f0" },
                      { label: "F1 (N/km/h)", field: "f1" },
                      { label: "F2 (N/(km/h)²)", field: "f2" },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground-530">
                          {item.label}
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          type="number"
                          disabled={isReadOnly}
                          required
                          value={(newLois as any)[item.field]}
                          onChange={(e) =>
                            handleChange(
                              item.field as keyof Lois,
                              Number(e.target.value),
                            )
                          }
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                {/* SECTION 4: Commentaires */}
                <section className="">
                  <label className="text-xs font-medium text-muted-foreground-900 block mb-2">
                    Commentaires
                  </label>

                  <textarea
                    value={newLois.description}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full h-28 p-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    placeholder="Informations additionnelles..."
                  />
                </section>
                {modalMode !== "view" && (
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2 border rounded-lg"
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#E30613] text-white rounded-lg"
                    >
                      {modalMode === "edit" ? "Modifier" : "Enregistrer"}
                    </button>
                  </div>
                )}
              </form>
              {/* BOUTONS */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

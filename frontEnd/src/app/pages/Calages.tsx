import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { authFetch } from "../api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

export interface LoiRoute {
  id: number;
  nom: string;
}
export interface Vehicule {
  id: number;
  identificateur: string;
}
interface Client {
  id?: number;
  nom: string;
}
export interface Calage {
  id?: number;
  nom: string;
  client?: Client;
  clientId: number;
  temperature: number;
  vehiculeId?: number;
  loiRouteId?: number;
  vehiculeAssocie?: Vehicule;
  loiRouteAssocie?: LoiRoute;
  a: number;
  b: number;
  c: number;
  description: string;
}

export function Calages() {
  const [calages, setCalages] = useState<Calage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVehicule, setFilterVehicule] = useState("Tous");
  const [filterLoi, setFilterLoi] = useState("Tous");
  const [filterMode, setFilterMode] = useState("Tous");
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [role, setRole] = useState<string>("");
  const isAdmin = role?.includes("ADMIN");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [selectedCalage, setSelectedCalage] = useState<Calage | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const [vehicules, setVehicules] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [loisRoutes, setLoisRoutes] = useState<any[]>([]);
  const [userClient, setUserClient] = useState<string>("");
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );
  const filteredCalages = calages.filter((c) => {
    const matchSearch =
      c.nom?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.vehiculeAssocie?.identificateur
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      c.loiRouteAssocie?.nom?.toLowerCase().includes(searchText.toLowerCase());
    const matchesClient =
      clientFilter === "Tous" || c.client?.id === clientFilter;

    const matchVehicule =
      filterVehicule === "Tous" ||
      c.vehiculeAssocie?.id === Number(filterVehicule);

    const matchLoi =
      filterLoi === "Tous" || c.loiRouteAssocie?.id === Number(filterLoi);

    return matchSearch && matchesClient && matchVehicule && matchLoi;
  });
  const INITIAL_CALAGE: Calage = {
    nom: "",
    clientId: 0,
    temperature: 0,
    vehiculeAssocie: undefined,
    loiRouteAssocie: undefined,
    a: 0,
    b: 0,
    c: 0,
    description: "",
  };

  const [newCalage, setNewCalage] = useState<Calage>({
    nom: "",
    clientId: 0,
    temperature: 0,
    vehiculeAssocie: undefined,
    loiRouteAssocie: undefined,
    a: 0,
    b: 0,
    c: 0,
    description: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiculesData = await authFetch("/vehicules");
        const loisData = await authFetch("/lois-route");

        await fetchCalages();

        setVehicules(vehiculesData ?? []);
        setLoisRoutes(loisData ?? []);
      } catch (err) {
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();
    fetchAllClients();
    fetchActiveClients();
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
  const fetchCalages = async () => {
    try {
      const calagesData = await authFetch("/calages");
      setCalages(calagesData ?? []);
    } catch (err) {
      toast.error("Erreur lors du chargement des calages");
    }
  };
  const fillForm = (calage: Calage) => {
    setIsInitializing(true);
    setNewCalage({
      ...INITIAL_CALAGE,
      ...calage,
      clientId: calage.client?.id ?? calage.clientId ?? 0,
      vehiculeAssocie: calage.vehiculeAssocie ?? undefined,
      loiRouteAssocie: calage.loiRouteAssocie ?? undefined,
    });
  };

  const handleChange = (field: keyof Calage, value: any) => {
    setNewCalage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nom: newCalage.nom,
        clientId: newCalage.clientId,
        temperature: newCalage.temperature,
        a: newCalage.a,
        b: newCalage.b,
        c: newCalage.c,
        description: newCalage.description,

        //  IMPORTANT : mapping correct vers backend
        vehiculeId: newCalage.vehiculeAssocie?.id,
        loiRouteId: newCalage.loiRouteAssocie?.id,
      };

      if (modalMode === "edit" && selectedCalage?.id) {
        const updated = await authFetch(`/calages/${selectedCalage.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setCalages((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );

        toast.success("Calage modifié !");
      } else {
        const created = await authFetch("/calages", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setCalages((prev) => [...prev, created]);

        toast.success("Calage ajouté !");
      }

      await fetchCalages();
      setShowModal(false);
      setNewCalage(INITIAL_CALAGE);
    } catch (err) {
      console.error(err);
      toast.error("Erreur !");
    }
  };

  const deleteCalage = async (id: number) => {
    try {
      await authFetch(`/calages/${id}`, { method: "DELETE" });
      setCalages((prev) => prev.filter((c) => c.id !== id));
      toast.success("Calage supprimé !");
      await fetchCalages();
    } catch (err: any) {
      console.error(err);

      const isConstraint =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key");

      const message = isConstraint
        ? "Suppression impossible : ce calage est utilisé dans d'autres données."
        : "Erreur lors de la suppression du calage.";

      toast.error(message);
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
  const generateCalageName = (
    vehicule?: Vehicule,
    loi?: LoiRoute,
    existing: Calage[] = [],
  ) => {
    if (!vehicule || !loi) return "";

    const base = `calage_${vehicule.identificateur}_${loi.nom}`;

    // filtre les noms déjà existants
    const similar = existing.filter((c) => c.nom?.startsWith(base));

    // extraire les numéros existants
    const numbers = similar
      .map((c) => {
        const match = c.nom.match(/_(\d+)$/);
        return match ? Number(match[1]) : 0;
      })
      .sort((a, b) => a - b);

    // trouver prochain numéro
    let next = 1;
    for (const n of numbers) {
      if (n === next) next++;
    }

    const suffix = String(next).padStart(3, "0");

    return `${base}_${suffix}`;
  };
  useEffect(() => {
    if (modalMode === "view") return; // ← bloquer seulement view

    const name = generateCalageName(
      vehicules.find((v) => v.id === newCalage.vehiculeAssocie?.id),
      loisRoutes.find((l) => l.id === newCalage.loiRouteAssocie?.id),
      calages,
    );

    if (name) {
      setNewCalage((prev) => ({ ...prev, nom: name }));
    }
  }, [
    newCalage.vehiculeAssocie?.id,
    newCalage.loiRouteAssocie?.id,
    modalMode,
    calages,
  ]);

  return (
    <div className="space-y-5  p-3">
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <h1 className="text-2xl font-semibold text-muted-foreground-600 text-left mb-2">
            Gestion des calages
          </h1>
          <p className="text-muted-foreground ">
            Gérer les configurations de calage pour les essais
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setModalMode("add");
              setNewCalage({
                ...INITIAL_CALAGE,
                clientId: 0,
              });
              setSelectedCalage(null);
              setShowModal(true);
            }}
            className="h-11 px-6 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter un calage
          </button>
        )}
      </div>

      <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-4">
        {/* Recherche */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400 transition-colors group-focus-within:text-[#E30613]" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-12 pl-10 pr-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

       
        {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) => role?.includes(r)) && (
          <select
            className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground"
            value={clientFilter}
            onChange={(e) =>
              setClientFilter(
                e.target.value === "Tous" ? "Tous" : Number(e.target.value),
              )
            }
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
          value={filterVehicule}
          onChange={(e) => setFilterVehicule(e.target.value)}
          className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <option value="Tous">Tous les véhicules</option>

          {vehicules.map((v) => (
            <option key={v.id} value={v.id}>
              {v.identificateur}
            </option>
          ))}
        </select>

        {/* Filtre loi de route */}
        <select
          value={filterLoi}
          onChange={(e) => setFilterLoi(e.target.value)}
          className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <option value="Tous">Lois de route (Tous)</option>

          {loisRoutes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nom}
            </option>
          ))}
        </select>
        {/* Bouton ajouter */}
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selectedCalage?.nom}</span> ?
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
                if (selectedCalage?.id != null) {
                  deleteCalage(selectedCalage.id);
                }
                setShowConfirmDelete(false);
                setSelectedCalage(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Tableau des calages */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            {/* Header */}
            <thead className="bg-[#B9032C] border-b border-border">
              <tr>
                <th className="px-8 py-5 font-semibold text-white">
                  Nom du calage
                </th>
                <th className="px-8 py-5 text-left font-semibold text-white">
                  Client
                </th>
                <th className="px-3 py-5 font-semibold text-white">Véhicule</th>
                <th className="px-8 py-5 text-left font-semibold text-white">
                  Loi de route
                </th>
                <th className="px-1 py-5 font-semibold text-white">
                  Température
                  <span className="text-xs font-normal opacity-80">(°C)</span>
                </th>
                <th className="px-4 py-5 font-semibold text-white">
                  A<span className="text-xs font-normal opacity-80">(N)</span>
                </th>
                <th className="px-4 py5 font-semibold text-white">
                  B
                  <span className="text-xs font-normal opacity-80">
                    (N/km/h)
                  </span>
                </th>
                <th className="px-5 py-5 font-semibold text-white">
                  C
                  <span className="text-xs font-normal opacity-80">
                    (N/(km/h)²)
                  </span>
                </th>
                <th className="px-4 py-5 font-semibold text-white">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredCalages.map((calages) => (
                <tr
                  key={calages.id}
                  className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                >
                  {/* Nom */}
                  <td className="px-4 py-4 font-bold text-muted-foreground-800">
                    {calages.nom}
                  </td>
                  {/* client */}
                  <td className="px-4 py-4 text-muted-foreground-800">
                    {calages.client?.nom || ""}{" "}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground-800">
                    {calages.vehiculeAssocie?.identificateur}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground-800">
                    {calages.loiRouteAssocie?.nom}{" "}
                  </td>

                  {/* Mode */}
                  <td className="px-6 py-4 text-muted-foreground-800">
                    {calages.temperature}
                  </td>

                  {/* A */}
                  <td className="px-6 py-4 text-muted-foreground-800">
                    {calages.a}
                  </td>

                  {/* B */}
                  <td className="px-6 py-4 text-muted-foreground-800">
                    {calages.b}
                  </td>

                  {/* C */}
                  <td className="px-6 py-4 text-muted-foreground-800">
                    {calages.c}
                  </td>

                  {/* Actions */}
                  {/* Actions */}
                  <td className="px-1 py-3 text-right">
                    <div className="flex items-center gap-2">
                      {/* Voir : tout le monde */}

                      {/* Actions seulement ADMIN ou CHARGE_ESSAI */}
                      {canEdit && (
                        <>
                          {/* Modifier */}
                          <button
                            onClick={() => {
                              setSelectedCalage(calages);
                              fillForm(calages);
                              setModalMode("edit");
                              setShowModal(true);
                            }}
                            className="p-1 rounded-lg bg-green-100 hover:bg-green-200"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() => {
                              setSelectedCalage(calages);
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
                          setSelectedCalage(calages);
                          fillForm(calages);
                          setModalMode("view");
                          setShowModal(true);
                        }}
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Aucun résultat */}
              {filteredCalages.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground-400"
                  >
                    Aucun calage trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-[750px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center py-3.5 px-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">
                {modalMode === "add" && "Ajouter un calage"}
                {modalMode === "edit" && "Modifier le calage"}
                {modalMode === "view" && "Détails du calage"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* BODY */}
            <form
              onSubmit={handleSubmit}
              noValidate={false}
              className="overflow-y-auto px-6 py-4 space-y-4"
            >
              {/* SECTION 1 : Identification */}
              <section>
                <h3 className="font-semibold text-[#B9032C] uppercase text-sm tracking-wider mb-2">
                  Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nom du calage */}
                  <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nom du calage
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="ClioV_WLTP_01"
                      value={newCalage.nom}
                      required
                      onChange={(e) => handleChange("nom", e.target.value)}
                      disabled={true}
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>
                  {/* Client */}
                  <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-xs font-medium text-muted-foreground-530">
                      Client <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      name="client"
                      value={newCalage.clientId}
                      required
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        handleChange("clientId", Number(e.target.value))
                      }
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
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
                  {/* Température */}
                  <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Température (°C)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.temperature}
                      required
                      onChange={(e) =>
                        handleChange("temperature", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2 : Associations */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider  mb-2">
                  Associations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Véhicule */}
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Véhicule
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={newCalage.vehiculeAssocie?.id || ""}
                      onChange={(e) =>
                        handleChange("vehiculeAssocie", {
                          id: Number(e.target.value),
                        })
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="">Sélectionner véhicule</option>

                      {vehicules.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.identificateur}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Loi de route */}
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Loi de route
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={newCalage.loiRouteAssocie?.id || ""}
                      onChange={(e) =>
                        handleChange("loiRouteAssocie", {
                          id: Number(e.target.value),
                        })
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="">Sélectionner loi</option>

                      {loisRoutes.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION 3 : Coefficients */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-2 ">
                  Coefficients provisoires
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      A (N)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.a}
                      onChange={(e) =>
                        handleChange("a", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      B (N/km/h)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.b}
                      onChange={(e) =>
                        handleChange("b", Number(e.target.value))
                      }
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      C (N/(km/h)²)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.c}
                      onChange={(e) =>
                        handleChange("c", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 4 : Description */}
              <section>
                <label className="text-xs font-medium text-muted-foreground-900 block mb-2">
                  Commentaire
                </label>

                <textarea
                  placeholder="Informations supplémentaires..."
                  value={newCalage.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={modalMode === "view"}
                  className="w-full h-28 p-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
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
                    className="px-5 py-2 bg-[#E30613] text-white rounded-lg"
                  >
                    {modalMode === "edit" ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { authFetch } from "../api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { toast } from "sonner";
import countries from "i18n-iso-countries";
import fr from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(fr);

interface Client {
  id?: number;
  nom: string;
  pays: string;
  ville: string;
  actif: boolean;
  contactEmail?: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [filterActif, setFilterActif] = useState<"TOUS" | "ACTIF" | "INACTIF">(
    "TOUS",
  );

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<Client | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [formData, setFormData] = useState<Client>({
    nom: "",
    pays: "",
    ville: "",
    actif: true,
    contactEmail: "",
  });
  const countryList = Object.entries(
    countries.getNames("fr", { select: "official" }),
  ).map(([code, name]) => ({
    code,
    name,
  }));

  /* ================= FETCH ================= */
  const fetchClients = async () => {
    try {
      const data = await authFetch("/clients");
      setClients(data);
    } catch {}
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ================= RESET ================= */
  const reset = () => {
    setFormData({
      nom: "",
      pays: "",
      ville: "",
      actif: true,
      contactEmail: "",
    });
    setSelected(null);
  };

  /* ================= FILTER ================= */
  const filtered = clients.filter((c) => {
    const matchesText = c.nom.toLowerCase().includes(search.toLowerCase());
    const matchesActif =
      filterActif === "TOUS"
        ? true
        : filterActif === "ACTIF"
          ? c.actif
          : !c.actif;

    return matchesText && matchesActif;
  });

  /* ================= SAVE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "add") {
        await authFetch("/clients", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Client ajouté");
      } else if (modalMode === "edit" && selected?.id) {
        const updated = await authFetch(`/clients/${selected.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        setClients((prev) =>
          prev.map((c) => (c.id === selected.id ? updated : c)),
        );

        toast.success("Client modifié");
      }

      setShowModal(false);
      reset();
      fetchClients();
    } catch {
      toast.error("Erreur opération client");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await authFetch(`/clients/${id}`, {
        method: "DELETE",
      });

      setClients((prev) => prev.filter((c) => c.id !== id));

      toast.success("Client supprimé avec succès !");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key")
          ? "Suppression impossible : ce client est utilisé dans d'autres données."
          : "Erreur lors de la suppression du client.";

      toast.error(message);
    }
  };
  return (
    <div className="space-y-5 p-3">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Gestion des clients</h1>
          <p className="text-muted-foreground">
            Administration des clients et informations associées
          </p>
        </div>

        <button
          onClick={() => {
            reset();
            setModalMode("add");
            setShowModal(true);
          }}
          className="h-11 px-10 bg-[#B9032C] text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-4">
        {/* SEARCH */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400  transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche par nom"
            className="w-full h-11 pl-10 pr-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {/* FILTER */}
        <select
          value={filterActif}
          onChange={(e) => setFilterActif(e.target.value as any)}
          className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground"
        >
          <option value="TOUS">Statut (Tous)</option>
          <option value="ACTIF">Actifs</option>
          <option value="INACTIF">Inactifs</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#B9032C] text-white">
            <tr>
              <th className="p-4 text-left">Nom</th>
              <th className="p-2 text-left">Pays</th>
              <th className="p-4 text-left">Ville</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-boreder hover:bg-[#E30613]/3 transition-colors"
              >
                <td className="p-4 font-semibold">{c.nom}</td>
                <td>{c.pays}</td>
                <td>{c.ville}</td>
                <td>{c.contactEmail || "-"}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                      c.actif
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.actif ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {c.actif ? "Actif" : "Inactif"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelected(c);
                        setFormData(c);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                      className="p-1 bg-blue-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setFormData(c);
                        setModalMode("edit");
                        setShowModal(true);
                      }}
                      className="p-1 bg-green-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setShowConfirmDelete(true);
                      }}
                      className="p-1 bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucun client trouvé
          </div>
        )}
      </div>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selected?.nom}</span> ?
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
                if (selected) {
                  handleDelete(selected.id);
                }
                setShowConfirmDelete(false);
                setSelected(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card w-[90vw] h-[90vh] px-4 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground border-b border-border pb-2 px-2">
              {modalMode === "add" && "Ajouter client"}
              {modalMode === "edit" && "Modifier client"}
              {modalMode === "view" && "Détails client"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="mt-6 mx-auto w-full max-w-8xl space-y-6 px-8"
          >
            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-3 gap-6">
              {/* NOM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Nom <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.nom}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="h-11 px-2 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                  required
                />
              </div>

              {/* PAYS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Pays <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.pays}
                  onChange={(e) =>
                    setFormData({ ...formData, pays: e.target.value })
                  }
                  className="h-11 px-2 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                >
                  <option value=""> Sélectionner un pays</option>

                  {countryList.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VILLE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Ville <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.ville}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, ville: e.target.value })
                  }
                  className="h-11 px-2 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="h-11 px-2 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                  required
                />
              </div>
            </div>

            {/* ACTIVE */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.actif}
                disabled={modalMode === "view"}
                onChange={(e) =>
                  setFormData({ ...formData, actif: e.target.checked })
                }
                className="accent-red-600 w-4 h-4"
              />
              <span className="text-sm font-medium">Actif</span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-2 border rounded-lg"
              >
                Annuler
              </button>

              {modalMode !== "view" && (
                <button
                  type="submit"
                  className="px-8 py-2 bg-red-600 text-white rounded-lg"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

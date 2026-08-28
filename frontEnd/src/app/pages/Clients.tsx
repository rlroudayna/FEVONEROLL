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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        toast.success(t("clients.createdSuccess"));
      } else if (modalMode === "edit" && selected?.id) {
        const updated = await authFetch(`/clients/${selected.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        setClients((prev) =>
          prev.map((c) => (c.id === selected.id ? updated : c)),
        );

        toast.success(t("clients.updatedSuccess"));
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

      toast.success(t("clients.deletedSuccess"));
    } catch (err: any) {
      console.error(err);

      const message =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key")
          ? t("clients.deleteConstraintError")
          : t("clients.deleteError");

      toast.error(message);
    }
  };
  return (
    <div className="space-y-5 p-3">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2"> {t("clients.title")}</h1>
          <p className="text-muted-foreground">{t("clients.subtitle")}</p>
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
          {t("clients.add")}
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
            placeholder={t("clients.searchPlaceholder")}
            className="w-full h-11 pl-10 pr-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {/* FILTER */}
        <select
          value={filterActif}
          onChange={(e) => setFilterActif(e.target.value as any)}
          className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground"
        >
          <option value="TOUS">{t("clients.statusAll")}</option>
          <option value="ACTIF">{t("clients.active")}</option>
          <option value="INACTIF">{t("clients.inactive")}</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full min-w-[1000px] text-sm text-left border-collapse">
          <thead className="bg-[#B9032C] text-white">
            <tr>
              <th className="w-[25%] px-6 py-5 font-semibold">
                {t("clients.name")}
              </th>

              <th className="w-[18%] px-6 py-5 font-semibold">
                {t("clients.country")}
              </th>

              <th className="w-[18%] px-6 py-5 font-semibold">
                {t("clients.city")}
              </th>

              <th className="w-[18%] px-6 py-5 font-semibold">
                {t("clients.email")}
              </th>

              <th className="w-[12%] px-10 py-5 font-semibold">
                {t("clients.status")}
              </th>

              <th className="w-[16%] px-16 py-5 text-right font-semibold">
                {t("clients.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-card">
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-boreder hover:bg-[#E30613]/3 transition-colors"
              >
                {/* Nom */}
                <td className="px-6 py-4 font-semibold text-muted-foreground-900">
                  {c.nom}
                </td>

                {/* Pays */}
                <td className="px-6 py-4 text-muted-foreground-700">
                  {c.pays}
                </td>

                {/* Ville */}
                <td className="px-6 py-4 text-muted-foreground--700">
                  {c.ville}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-muted-foreground--700">
                  <span className="truncate block">
                    {c.contactEmail || "—"}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-10 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
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
                    {c.actif ? t("clients.active") : t("clients.inactive")}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-9 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelected(c);
                        setFormData(c);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                      className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-700" />
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setFormData(c);
                        setModalMode("edit");
                        setShowModal(true);
                      }}
                      className="p-1 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-green-700" />
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setShowConfirmDelete(true);
                      }}
                      className="p-1 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className=" bg-card p-10 text-center text-sm text-muted-foreground-500">
            {t("clients.noClient")}
          </div>
        )}
      </div>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>{t("clients.deleteConfirmation")}</DialogTitle>{" "}
          </DialogHeader>
          <p className="py-4 text-muted-foreground-700">
            {t("clients.deleteQuestion")}{" "}
            <span className="font-bold">{selected?.nom}</span> ?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
            >
              {t("common.no")}
            </button>
            <button
              onClick={() => {
                if (selected?.id !== undefined) {
                  handleDelete(selected.id);
                }

                setShowConfirmDelete(false);
                setSelected(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {t("common.confirm")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card w-[90vw] h-[90vh] px-4 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground border-b border-border pb-2 px-2">
              {modalMode === "add" && t("clients.add")}
              {modalMode === "edit" && t("clients.edit")}
              {modalMode === "view" && t("clients.details")}
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
                  {t("clients.name")}{" "}
                  <span className="text-red-500 ml-1">*</span>
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
                  {t("clients.country")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.pays}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, pays: e.target.value })
                  }
                  className="h-11 px-2 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                >
                  <option value=""> {t("common.select")}</option>

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
                  {t("clients.city")}{" "}
                  <span className="text-red-500 ml-1">*</span>
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
                  {t("clients.email")}{" "}
                  <span className="text-red-500 ml-1">*</span>
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
              <span className="text-sm font-medium">
                {" "}
                {t("clients.active")}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-2 border rounded-lg"
              >
                {t("common.cancel")}
              </button>

              {modalMode !== "view" && (
                <button
                  type="submit"
                  className="px-8 py-2 bg-red-600 text-white rounded-lg"
                >
                  {t("common.save")}
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

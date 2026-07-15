import { useEffect, useState } from "react";
import { authFetch } from "../api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { toast } from "sonner";

export enum FamilleTest {
  CYCLE_NORMEE = "CYCLE_NORMEE",
  RDE = "RDE",
  CONCEPTION_SPECIFIQUE = "CONCEPTION_SPECIFIQUE",
}
interface Client {
  id?: number;
  nom: string;
}
interface cycle {
  id?: number;
  nom: string;
  familleTest: FamilleTest;
  clientId: number;
  client?: Client;
  duree: number | null;
  nombrePhase: number | null;
  nombreStabilises: number | null;
  traceFilePath: string;
  commentaire: string;
}

const familleColors: { [key: string]: string } = {
  CONCEPTION_SPECIFIQUE: "bg-[#E3F2FD] text-[#1565C0]",
  RDE: "bg-[#E8F5E9] text-[#2E7D32]",
CYCLE_NORMEE: "bg-[#FFF3E0] text-[#EF6C00]",
};

export function Cycles() {
  const [cycles, setCycles] = useState<cycle[]>([]);
  const [searchText, setSearchText] = useState("");

  const [familleFilter, setFamilleFilter] = useState("Tous");
  const [userClient, setUserClient] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [role, setRole] = useState<string>("");
  const isAdmin = role?.includes("ADMIN");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [selectedCycle, setSelectedCycle] = useState<cycle | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [existingTraceFilePath, setExistingTraceFilePath] = useState<
    string | null
  >(null);
  const [traceFile, setTraceFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );

  type CycleForm = {
    nom: string;
    clientId: number | null;
    commentaire: string;
    famille: FamilleTest | null;
    duree: string;
    nombrePhase: string;
    nombreStabilite: string;
    traceFilePath: string;
  };
  const [form, setForm] = useState<CycleForm>({
    nom: "",
    clientId: null as number | null,
    famille: null as FamilleTest | null,
    duree: "",
    nombrePhase: "",
    nombreStabilite: "",
    commentaire: "",
    traceFilePath: "",
  });
  const resetForm = () => {
    setSelectedCycle(null);
    setTraceFile(null);
    setExistingTraceFilePath(null);

    setForm({
      nom: "",
      clientId: null as number | null,
      famille: familleFilter as FamilleTest,
      duree: "",
      nombrePhase: "",
      nombreStabilite: "",
      traceFilePath: "",
      commentaire: "",
    });
  };
  // ================= LOAD =================
  const loadCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCycles();
    fetchAllClients();
    fetchActiveClients();
  }, []);

  const fetchAllClients = async () => {
    try {
      const data = await authFetch("/clients/ClientDTO");
      setAllClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement tous clients", error);
    }
  };
  const fetchActiveClients = async () => {
    try {
      const data = await authFetch("/clients/actifs/dto");
      setActiveClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement clients actifs", error);
    }
  };
  // ================= OPEN MODAL =================
  const openModal = (mode: "add" | "edit" | "view", cycle?: cycle) => {
    // 1. RESET complet d'abor
    if (mode === "add") {
      setSelectedCycle(null);

      setTraceFile(null);
      setExistingTraceFilePath(null);

      setForm({
        nom: "",
        clientId: null as number | null,
        famille: familleFilter as FamilleTest,
        duree: "",
        nombrePhase: "",
        nombreStabilite: "",
        traceFilePath: "",
        commentaire: "",
      });
    }
    // 2. ensuite seulement edit/view

    if (cycle && mode !== "add") {
      setSelectedCycle(cycle);

      setForm({
        nom: cycle.nom ?? "",
        clientId: cycle.client?.id ?? null,
        famille: cycle.familleTest ?? FamilleTest.RDE,
        duree: cycle.duree?.toString() ?? "",
        nombrePhase: cycle.nombrePhase?.toString() ?? "",
        nombreStabilite: cycle.nombreStabilises?.toString() ?? "",
        traceFilePath: cycle.traceFilePath?.toString() ?? "",
        commentaire: cycle.commentaire ?? "",
      });

      setExistingTraceFilePath(cycle.traceFilePath ?? null);
      setTraceFile(null);
    }

    setModalMode(mode);
    setShowModal(true);
  };
  // ================= ADD =================
  const handleAddCycle = async () => {
    if (!traceFile) {
      setFileError(true);
      return;
    }

    const formData = new FormData();

    const cycle = {
      nom: form.nom,
      clientId: form.clientId,
      familleTest: form.famille,
      duree: Number(form.duree),
      nombrePhase: Number(form.nombrePhase),
      nombreStabilises: Number(form.nombreStabilite),
      commentaire: form.commentaire,
    };

    formData.append(
      "cycle",
      new Blob([JSON.stringify(cycle)], {
        type: "application/json",
      }),
    );

    formData.append("file", traceFile);

    const created = await authFetch("/cycles", {
      method: "POST",
      body: formData,
    });

    setCycles([...cycles, created]);
    setShowModal(false);
    toast.success("Cycle ajouté avec succès");
    resetForm();
  };

  // ================= UPDATE =================

  const updateCycle = async () => {
    if (!selectedCycle?.id) return;

    const formData = new FormData();

    const cycle = {
      nom: form.nom,
      clientId: form.clientId,
      familleTest: form.famille,
      duree: Number(form.duree),
      nombrePhase: Number(form.nombrePhase),
      nombreStabilises: Number(form.nombreStabilite),
      traceFile: String(form.traceFilePath),
      commentaire: form.commentaire,
    };

    formData.append(
      "cycle",
      new Blob([JSON.stringify(cycle)], {
        type: "application/json",
      }),
    );

    if (traceFile) {
      formData.append("file", traceFile);
    }

    const updated = await authFetch(`/cycles/${selectedCycle.id}`, {
      method: "PUT",
      body: formData,
    });

    setCycles((prev) =>
      prev.map((c) => (c.id === selectedCycle.id ? updated : c)),
    );

    setShowModal(false);
    toast.success("Cycle modifié avec succès");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "edit") {
      await updateCycle();
    } else {
      await handleAddCycle();
    }
  };
  // ================= DELETE =================
  const deleteCycle = async (id: number) => {
    try {
      await authFetch(`/cycles/${id}`, { method: "DELETE" });
      setCycles((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cycle supprimé avec succès");
    } catch (err: any) {
      const message =
        err?.message?.includes("constraint") ||
        err?.message?.includes("foreign key")
          ? "Suppression impossible : ce cycle est utilisé dans d'autres données."
          : "Erreur lors de la suppression du cycle.";

      toast.error(message);
    }
  };

  // ================= FILTER =================
  const filteredCycles = cycles.filter((c) => {
    const matchText =
      c.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      c.familleTest.toLowerCase().includes(searchText.toLowerCase());

    const matchFamille =
      familleFilter === "Tous" || c.familleTest === familleFilter;
    const matchesClient =
      clientFilter === "Tous" || c.client?.id === Number(clientFilter);

    return matchText && matchesClient && matchFamille;
  });

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
  return (
    <div className="space-y-5 p-3">
      <div className="flex justify-between items-end">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Gestion des cycles
          </h1>
          <p className="text-muted-foreground">
            Gérer les cycles de roulage pour les essais
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => openModal("add")}
            className="ml-auto h-11 px-8 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un cycle</span>
          </button>
        )}
      </div>
      <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex items-center gap-4">
        {/* Recherche - On lui donne plus de poids visuel */}
        <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
          {" "}
          {/* Recherche par nom */}
          <div className="relative w-full flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400  transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-11 pl-19 pr-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div className="relative w-60">
            {["ADMIN", "CHARGE", "TECHNICIEN"].some((r) =>
              role?.includes(r),
            ) && (
              <select
                className="w-full sm:w-60 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground"
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
          </div>
          {/* Filtre famille */}
          <div className="relative w-60">
            <select
              value={familleFilter}
              onChange={(e) => setFamilleFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring appearance-none transition"
            >
              <option value="Tous">Toutes les familles</option>

              {Object.values(FamilleTest).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* flèche */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* On active le mode transparent ici */}
        {showConfirmDelete && (
          <Dialog open={showConfirmDelete}>
            {" "}
            <DialogContent className="max-w-md" hideOverlay={true}>
              <DialogHeader>
                <DialogTitle>Confirmation de suppression</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-muted-foreground-700">
                Voulez-vous vraiment supprimer le cycle{" "}
                <span className="font-bold">{selectedCycle?.nom}</span> ?
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
                    if (selectedCycle?.id != null) {
                      deleteCycle(selectedCycle.id);
                    }
                    setShowConfirmDelete(false);
                    setSelectedCycle(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirmer suppression
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}{" "}
        {/* Bouton - Plus d'impact avec une ombre portée */}
      </div>
      {/* Tableau des cycles */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            {/* Header */}
            <thead className="bg-[#B9032C] border-b border-border">
              <tr>
                <th className="px-6 py-5 text-left font-semibold text-white">
                  Nom du cycle
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Client
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Famille
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Durée (s)
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Nombre de phases
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Trace
                </th>

                <th className="px-6 py-5 text-left font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {filteredCycles.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground-500 font-medium"
                  >
                    Aucun cycle trouvé
                  </td>
                </tr>
              ) : (
                filteredCycles.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-boreder hover:bg-[#E30613]/3 transition-colors"
                  >
                    {/* Nom */}
                    <td className="px-4 py-4 font-bold text-muted-foreground-800">
                      {c.nom}
                    </td>

                    {/* Client */}
                    <td className="px-4 py-4 text-muted-foreground-800">
                      {c.client?.nom}
                    </td>

                    {/* Famille */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                          familleColors[c.familleTest]
                        }`}
                      >
                        {c.familleTest}
                      </span>
                    </td>

                    {/* Durée */}
                    <td className="px-6 py-4 text-muted-foreground-800">
                      {c.duree}
                    </td>

                    {/* nombrePhase */}
                    <td className="px-16 py-4 text-muted-foreground-800">
                      {c.nombrePhase}
                    </td>

                    {/* traceFilePath */}
                    <td className="px-6 py-4">
                      {c.traceFilePath ? (
                        <div className="flex items-center gap-2 text-muted-foreground-800 max-w-[200px]">
                          <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />

                          <a
                            href={`http://localhost:8080/uploads/${c.traceFilePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline truncate"
                          >
                            Voir le fichier
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Voir */}

                        {/* ADMIN ou CHARGE_ESSAI */}
                        {canEdit && (
                          <>
                            <button
                              onClick={() => {
                                openModal("edit", c);
                                setSelectedCycle(c);
                                setShowModal(true);
                              }}
                              className="p-1 rounded-lg bg-green-100 hover:bg-green-200"
                            >
                              <Edit className="w-4 h-4 text-green-700" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedCycle(c);
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
                            openModal("view", c);
                            setSelectedCycle(c);
                            setShowModal(true);
                          }}
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
      </div>
      {/* MODAL OPTIMISÉ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-[750px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="px-6 py-3.5 border-b border-slate-300 flex justify-between items-center bg-card">
              <h2 className="text-xl font-semibold text-muted-foreground-800">
                {modalMode === "add" && "Ajouter un cycle"}
                {modalMode === "edit" && "Modifier un cycle"}
                {modalMode === "view" && "Détails d'un cycle"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            {/* BODY */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Section 1: Identification */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E30613] uppercase tracking-wider mb-1">
                  Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nom du cycle
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      value={form.nom}
                      disabled={modalMode === "view"}
                      required
                      placeholder="Nom du cycle"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nom: e.target.value,
                        })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-muted-foreground-530">
                      Client <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={form.clientId ?? ""}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          clientId: e.target.value
                            ? Number(e.target.value)
                            : null,
                        });
                      }}
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option value="">Sélectionner un client</option>

                      {activeClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Famille
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={form.famille ?? ""}
                      required
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          famille: e.target.value as FamilleTest,
                        })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
    focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="">Sélectionner une famille</option>

                      {Object.values(FamilleTest).map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Section: Caractéristiques */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E30613] uppercase tracking-wider mb-1">
                  Caractéristiques
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Durée */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Durée(s) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.duree}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, duree: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {/* Nombre de phases */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nombre Phase <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.nombrePhase}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, nombrePhase: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {/* Nombre de stabilités */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nombre stabilités
                    </label>
                    <input
                      type="number"
                      value={form.nombreStabilite}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, nombreStabilite: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <h4 className="text-xs font-medium text-muted-foreground-900 mb-2">
                      Données de trace{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </h4>

                    {existingTraceFilePath && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        <a
                          href={`http://localhost:8080/uploads/${existingTraceFilePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline mt-2"
                        >
                          Voir le fichier actuel
                        </a>
                      </div>
                    )}

                    {modalMode !== "view" && (
                      <>
                        <div
                          className={`border border-dashed rounded-lg min-h-24 flex flex-col items-center justify-center cursor-pointer transition-all
        ${
          fileError
            ? "border-red-500 bg-red-50"
            : traceFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-border hover:border-border hover:bg-gray-50"
        }`}
                        >
                          <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept=".xls,.xlsx,.csv"
                            onChange={(e) => {
                              setTraceFile(e.target.files?.[0] || null);
                              setFileError(false);
                            }}
                          />

                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {traceFile ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                                <span className="text-emerald-700 text-sm font-semibold">
                                  {traceFile.name}
                                </span>
                                <span className="text-emerald-500 text-[10px] mt-0.5">
                                  Fichier prêt à l'import
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <span className="text-muted-foreground text-xs font-medium text-center mt-2">
                                  Téléverser un fichier
                                </span>
                              </>
                            )}
                          </label>
                        </div>

                        {/* ✅ MESSAGE ERREUR ICI (PAS DANS LE LABEL) */}
                        {fileError && !traceFile && (
                          <p className="text-red-500 text-xs mt-2 font-medium">
                            ⚠️ Veuillez téléverser un fichier de trace
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E30613] uppercase tracking-wider mb-2">
                  Commentaire
                </h3>

                <textarea
                  value={form.commentaire}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      commentaire: e.target.value,
                    })
                  }
                  placeholder="Informations complémentaires..."
                  className="w-full h-28 p-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                />
              </section>

              <div className="flex justify-end gap-38 mt-2">
                {modalMode !== "view" && (
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
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
              </div>
            </form>

            {/* FOOTER */}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Download,
  Search,
  Calendar,
  Trash2,
  Edit,
  FileText,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { authFetch } from "../api";
import { toast } from "sonner";

interface Client {
  id: number;
  nom: string;
}
type Report = {
  id: number;
  title: string;
  demandeId: number;
  demandeNomAuto: string;
  client: string;
  dateCreation: string;
  chargeEssai: string;
  commentaire: string;
  FileText: string;
};

interface DemandeEssai {
  id?: number;
  nomAuto?: string;
  numeroProjet?: number;
  client?: Client;
  demandeur?: string;
  technicien?: string;
  datePlanification?: string;
}
export function Reporting() {
  const [searchText, setSearchText] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [demandeId, setDemandeId] = useState<number | "">("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );
  const [role, setRole] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mode, setMode] = useState<"create" | "view" | "edit">("create");
  const isAdmin = role?.includes("ADMIN");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [dateCreation, setDateCreation] = useState("");
  const [chargeEssai, setChargeEssai] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<number | "">("");
  const [client, setClient] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<string | "Tous">("Tous");
  const drivers = Array.from(
    new Set(reports.map((r) => r.chargeEssai).filter(Boolean)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExport = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("demandeId", String(demandeId));
      formData.append("clientId", String(clientId));
      formData.append("dateCreation", dateCreation);
      formData.append("chargeEssai", chargeEssai);
      formData.append("commentaire", commentaire);

      if (file) {
        formData.append("file", file);
      }

      await authFetch("/Rapport/upload", {
        method: "POST",
        body: formData,
      });

      toast.success("Rapport enregistré");

      await fetchReports();

      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("demandeId", demandeId.toString());
    formData.append("clientId", clientId.toString());
    formData.append("dateCreation", dateCreation);
    formData.append("chargeEssai", chargeEssai);
    formData.append("commentaire", commentaire);

    if (file) formData.append("file", file);

    try {
      await authFetch(`/Rapport/update/${selectedReport.id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Rapport modifié avec succès");

      const data = await authFetch("/Rapport");
      setReports(data);

      setModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authFetch(`/Rapport/${id}`, {
        method: "DELETE",
      });

      toast.success("Rapport supprimé avec succès");

      const data = await authFetch("/Rapport");
      setReports(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchSearch = r.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesClient =
      clientFilter === "Tous" ? true : r.client === clientFilter;

    const matchDate = !filterDate || r.dateCreation === filterDate;

    const matchDriver = !selectedDriver || r.chargeEssai === selectedDriver;

    return matchSearch && matchesClient && matchDate && matchDriver;
  });

  const fetchReports = async () => {
    try {
      const data = await authFetch("/Rapport");
      setReports(data);
    } catch (error) {
      console.error(error);
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
  const fetchAllClients = async () => {
    try {
      const data = await authFetch("/clients/ClientDTO");
      setAllClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement tous clients", error);
    }
  };

  useEffect(() => {
    if (selectedReport) {
      setTitle(selectedReport.title);
      setDemandeId(selectedReport.demandeId);
      setDateCreation(selectedReport.dateCreation);
      setChargeEssai(selectedReport.chargeEssai);
      setCommentaire(selectedReport.commentaire);

      // ✅ Trouver l'id du client à partir de son nom
      const matchedClient = client.find((c) => c.nom === selectedReport.client);
      if (matchedClient) {
        setClientId(matchedClient.id);
      }
    }
  }, [selectedReport, client]);

  const resetForm = () => {
    setTitle("");
    setDemandeId("");
    setDateCreation("");
    setChargeEssai("");
    setCommentaire("");
    setFile(null);
    setSelectedReport(null);
    setMode("create");
  };
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await authFetch("/demandes-essai");
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
        setChargeEssai(`${user.prenom ?? ""} ${user.nom ?? ""}`.trim());

        // IMPORTANT : si user.client existe
        if (user.client?.id) {
          setClientId(user.client.id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!demandeId) return;

    const selectedDemande = demandes.find((d) => d.id === Number(demandeId));

    if (selectedDemande?.datePlanification) {
      // format compatible input type="date"
      const formattedDate = selectedDemande.datePlanification.split("T")[0];

      setDateCreation(formattedDate);
    }
  }, [demandeId, demandes]);

  useEffect(() => {
    fetchAllClients();
    fetchActiveClients();
    fetchReports();
  }, []);

  useEffect(() => {
    if (!demandeId) {
      setSelectedClientId(null);
      setClientId("");
      return;
    }

    const demande = demandes.find((d) => d.id === Number(demandeId));

    if (demande?.client?.id) {
      setSelectedClientId(demande.client.id);
      setClientId(demande.client.id);
    }
  }, [demandeId, demandes]);

  return (
    <div className="space-y-5 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reporting</h1>
          <p className="text-muted-foreground">
            Analyse et rapports d'activité
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="h-11 px-6 bg-[#B9032C] text-white rounded-lg flex items-center gap-2 hover:brightness-110 shadow-md"
        >
          <Download className="w-5 h-5" />
          Exporter rapport
        </button>
      </div>

      {/* Barre filtres */}
      <div className="p-5 bg-card rounded-xl border shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Recherche par titre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background text-foreground border border-border rounded-lg  text-foreground outline-none focus:ring-2 focus:ring-ring appearance-none transition"
          />
        </div>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-full sm:w-70 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground placeholder:text-muted"
        >
          <option value="Tous">Tous les clients</option>

          {allClients.map((c) => (
            <option key={c.id} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>

        <div
          className="w-70 h-11 px-3 border border-border rounded-lg flex items-center gap-2 bg-background
                 text-foreground outline-none focus:ring-2 focus:ring-ring appearance-none transition"
        >
          {" "}
          <Calendar
            size={16}
            className="text-muted-foreground-400 flex-shrink-0"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full h-full outline-none text-sm bg-transparent text-foreground appearance-none bg-background"
          />
        </div>
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>

          <p className="py-4 text-muted-foreground">
            Voulez-vous vraiment supprimer le rapport{" "}
            <span className="font-bold">{reportToDelete?.title}</span> ?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                setReportToDelete(null);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Non
            </button>

            <button
              onClick={async () => {
                if (reportToDelete?.id) {
                  await handleDelete(reportToDelete.id);
                }

                setShowConfirmDelete(false);
                setReportToDelete(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Confirmer
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Tableau */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            {/* Header */}
            <thead className="bg-[#B9032C] border-b border-border">
              <tr>
                <th className="px-4 py-5 font-semibold text-white">
                  Titre de rapport
                </th>
                <th className="px-4 py-5 font-semibold text-white">
                  Nom de demande
                </th>
                <th className="px-4 py-5 font-semibold text-white">Client</th>
                <th className="px-4 py-5 font-semibold text-white">
                  Date d'essai
                </th>
                <th className="px-4 py-5 font-semibold text-white">déposant</th>

                <th className="px-10 py-5 font-semibold text-white">Fichier</th>
                <th className="px-8 py-5 font-semibold text-white">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    Aucun rapport trouvé
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
                  >
                    <td className="px-4 py-4 font-bold text-muted-foreground-800">
                      {report.title}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground-800">
                      {report.demandeNomAuto}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground-800">
                      {report.client}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground-800">
                      {report.dateCreation}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground-800">
                      {report.chargeEssai}
                    </td>

                    {/* Nouvelle cellule rapport */}
                    <td className="px-10 py-4 text-muted-foreground-800">
                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:8080/api/Rapport/download/${report?.id}`,
                          )
                        }
                        className="flex items-center gap-1 text-[#E30613] hover:underline"
                      >
                        {" "}
                        <FileText className="w-4 h-4" />
                        Voir
                      </button>
                    </td>

                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Eye
                          className="cursor-pointer w-4 h-4 text-blue-600"
                          onClick={() => {
                            setSelectedReport(report);
                            setMode("view");

                            setModalOpen(true);
                          }}
                        />
                        <Edit
                          className="cursor-pointer text-green-600 w-4 h-4"
                          onClick={() => {
                            setSelectedReport(report);
                            setMode("edit");
                            setModalOpen(true);
                          }}
                        />
                        {isAdmin && (
                          <Trash2
                            className="cursor-pointer text-red-600 w-4 h-4"
                            onClick={() => {
                              setReportToDelete(report);
                              setShowConfirmDelete(true);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal export */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "view") return;

          if (mode === "edit") {
            handleUpdate();
          } else {
            handleExport();
          }
        }}
      >
        {modalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card w-[95vw] h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
              {/* HEADER */}
              <div className="flex justify-between items-center py-3.5 px-6 border-b border-border bg-card">
                <h2 className="text-xl font-bold text-foreground">
                  {mode === "create" && "Ajouter un rapport"}
                  {mode === "view" && "Visualiser un rapport"}
                  {mode === "edit" && "Modifier un rapport"}
                </h2>

                <button
                  onClick={() => {
                    resetForm();
                    setModalOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition"
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
              <div className="overflow-y-auto px-8 py-6 space-y-6">
                {/* SECTION IDENTIFICATION */}
                <section>
                  <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-4">
                    Identification du rapport
                  </h3>

                  {/* GRID PRINCIPALE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Titre */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground-900">
                        Titre du rapport{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={mode === "view"}
                        placeholder="Titre du rapport"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>

                    {/* Numéro demande */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground-900">
                        Nom demande d'essai{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={demandeId}
                        required
                        disabled={mode === "view"}
                        onChange={(e) => setDemandeId(Number(e.target.value))}
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                      >
                        <option value="">Sélectionner une demande</option>

                        {demandes.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nomAuto}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Client */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground-530">
                        Client <span className="text-red-500 ml-1">*</span>
                      </label>

                      <select
                        value={selectedClientId || ""}
                        disabled
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

                    {/* Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground-900">
                        Date d'essai{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        disabled={mode === "view"}
                        required
                        value={dateCreation}
                        onChange={(e) => setDateCreation(e.target.value)}
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>

                    {/* Chargé d'essai */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground-900">
                        déposant <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        readOnly
                        value={chargeEssai}
                        placeholder="Nom du déposant"
                        className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>

                    {/* Rapport */}
                    {/* Rapport */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground-900">
                        Rapport <span className="text-red-500 ml-1">*</span>
                      </label>

                      {mode === "view" ? (
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `http://localhost:8080/api/Rapport/download/${selectedReport?.id}`,
                            )
                          }
                          className="h-11 px-3 rounded-lg border border-border bg-background text-[#E30613] flex items-center gap-2 hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          Voir le fichier
                        </button>
                      ) : (
                        <input
                          type="file"
                          required={mode === "create"}
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="h-11 px-3 rounded-lg border border-border bg-background text-foreground"
                        />
                      )}
                    </div>
                  </div>
                </section>

                {/* SECTION DESCRIPTION */}
                <section>
                  <h3 className="text-sm font-medium text-muted-foreground-900 mb-3">
                    Commentaire
                  </h3>

                  <textarea
                    placeholder="Informations sur le rapport..."
                    value={commentaire}
                    disabled={mode === "view"}
                    onChange={(e) => setCommentaire(e.target.value)}
                    className="w-full h-28 p-4 border border-border rounded-lg
            bg-background text-foreground"
                  />
                </section>

                {/* SECTION FICHIER */}

                {/* BOUTONS */}
                <div className="flex justify-end gap-3 mt-10">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      resetForm();
                    }}
                    className="px-12 py-3 bg-card border border-border text-foreground font-semibold rounded-lg transition shadow-sm"
                  >
                    Annuler
                  </button>
                  {mode !== "view" && (
                    <button
                      type="submit"
                      className="px-12 py-3 bg-red-600 text-white rounded-lg"
                    >
                      Enregistrer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

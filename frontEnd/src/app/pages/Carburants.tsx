import React, { useEffect, useState, useCallback } from "react";
import { authFetch } from "../api";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ================= ENUMS ================= */

export enum Composition {
  MassRatio = "MassRatio",
}

export enum FuelStatus {
  Published = "Published",
}

/* ================= INTERFACES ================= */

interface Carburant {
  id?: number;
  nom: string;
  density: number | null;
  referenceTemperature: number | null;
  composition: Composition;
  carbonNumber: number | null;
  hydrogenNumber: number | null;
  oxygenNumber: number | null;
  nitrogenNumber: number | null;
  sulfurNumber: number | null;
  h2oContent: number | null;
  co2Content: number | null;
  ethanolContent: number | null;
  nhv: number | null;
  status: FuelStatus;
  commentaire: string;
}

type CarburantForm = {
  density: string;
  nom: string;
  referenceTemperature: string;
  composition: Composition;
  carbonNumber: string;
  hydrogenNumber: string;
  oxygenNumber: string;
  nitrogenNumber: string;
  sulfurNumber: string;
  h2oContent: string;
  co2Content: string;
  ethanolContent: string;
  nhv: string;
  status: FuelStatus;
  commentaire: string;
};

const INITIAL_FORM_STATE: CarburantForm = {
  nom: "",
  density: "",
  referenceTemperature: "",
  composition: Composition.MassRatio,
  carbonNumber: "",
  hydrogenNumber: "",
  oxygenNumber: "",
  nitrogenNumber: "",
  sulfurNumber: "",
  h2oContent: "",
  co2Content: "",
  ethanolContent: "",
  nhv: "",
  status: FuelStatus.Published,
  commentaire: "",
};

/* ================= COMPONENT ================= */

export function Carburants() {
  const [carburants, setCarburants] = useState<Carburant[]>([]);
  const [searchText, setSearchText] = useState("");
  const [compositionFilter, setCompositionFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedCarburant, setSelectedCarburant] = useState<Carburant | null>(
    null,
  );
  const { t } = useTranslation();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [role, setRole] = useState("");
  const [form, setForm] = useState<CarburantForm>(INITIAL_FORM_STATE);

  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [selected, setSelected] = useState<Carburant | null>(null);

  /* ================= HANDLERS & ACTIONS ================= */
  const labels = {
    carbonNumber: t("carburants.carbon"),
    hydrogenNumber: t("carburants.hydrogen"),
    oxygenNumber: t("carburants.oxygen"),
    nitrogenNumber: t("carburants.nitrogen"),
    sulfurNumber: t("carburants.sulfur"),
  };
  const resetForm = () => {
    setSelectedCarburant(null);
    setForm(INITIAL_FORM_STATE);
  };

  const loadCarburants = useCallback(async () => {
    try {
      const data = await authFetch("/carburants");
      setCarburants(data);
    } catch (err) {
      console.error("Erreur lors du chargement des carburants :", err);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    };

    fetchUser();
    loadCarburants();
  }, [loadCarburants]);

  const openModal = (mode: "add" | "edit" | "view", carburant?: Carburant) => {
    if (mode === "add") {
      resetForm();
    } else if (carburant) {
      setSelectedCarburant(carburant);
      setForm({
        nom: String(carburant.nom ?? ""),
        density: String(carburant.density ?? ""),
        referenceTemperature: String(carburant.referenceTemperature ?? ""),
        composition: carburant.composition,
        carbonNumber: String(carburant.carbonNumber ?? ""),
        hydrogenNumber: String(carburant.hydrogenNumber ?? ""),
        oxygenNumber: String(carburant.oxygenNumber ?? ""),
        nitrogenNumber: String(carburant.nitrogenNumber ?? ""),
        sulfurNumber: String(carburant.sulfurNumber ?? ""),
        h2oContent: String(carburant.h2oContent ?? ""),
        co2Content: String(carburant.co2Content ?? ""),
        ethanolContent: String(carburant.ethanolContent ?? ""),
        nhv: String(carburant.nhv ?? ""),
        status: carburant.status,
        commentaire: carburant.commentaire ?? "",
      });
    }
    setModalMode(mode);
    setShowModal(true);
  };

  const handleInputChange = (field: keyof CarburantForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    try {
      const created = await authFetch("/carburants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          density: Number(form.density),
          referenceTemperature: Number(form.referenceTemperature),
          composition: form.composition,
          carbonNumber: Number(form.carbonNumber),
          hydrogenNumber: Number(form.hydrogenNumber),
          oxygenNumber: Number(form.oxygenNumber),
          nitrogenNumber: Number(form.nitrogenNumber),
          sulfurNumber: Number(form.sulfurNumber),
          h2oContent: Number(form.h2oContent),
          co2Content: Number(form.co2Content),
          ethanolContent: Number(form.ethanolContent),
          nhv: Number(form.nhv),
          status: form.status,
          commentaire: form.commentaire,
        }),
      });

      setCarburants((prev) => [...prev, created]);
      toast.success(t("carburants.createdSuccess"));
      setShowModal(false);
      resetForm();
    } catch {
      toast.error(t("carburants.createError"));
    }
  };

  const updateCarburant = async () => {
    if (!selectedCarburant?.id) return;
    try {
      const updated = await authFetch(`/carburants/${selectedCarburant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: String(form.nom),
          density: Number(form.density),
          referenceTemperature: Number(form.referenceTemperature),
          composition: form.composition,
          carbonNumber: Number(form.carbonNumber),
          hydrogenNumber: Number(form.hydrogenNumber),
          oxygenNumber: Number(form.oxygenNumber),
          nitrogenNumber: Number(form.nitrogenNumber),
          sulfurNumber: Number(form.sulfurNumber),
          h2oContent: Number(form.h2oContent),
          co2Content: Number(form.co2Content),
          ethanolContent: Number(form.ethanolContent),
          nhv: Number(form.nhv),
          status: form.status,
          commentaire: form.commentaire,
        }),
      });

      setCarburants((prev) =>
        prev.map((c) => (c.id === selectedCarburant.id ? updated : c)),
      );
      toast.success(t("carburants.updatedSuccess"));
      setShowModal(false);
    } catch {
      toast.error(t("carburants.updateError"));
    }
  };

  const deleteCarburant = async (id: number) => {
    try {
      await authFetch(`/carburants/${id}`, { method: "DELETE" });
      setCarburants((prev) => prev.filter((c) => c.id !== id));
      toast.success(t("carburants.deletedSuccess"));
    } catch {
      toast.error(t("carburants.deleteError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "edit") {
      await updateCarburant();
    } else {
      await handleAdd();
    }
  };

  /* ================= FILTER ================= */

  const filteredCarburants = carburants.filter((c) => {
    const searchLower = searchText.toLowerCase();

    const matchText =
      c.nom.toLowerCase().includes(searchLower) ||
      String(c.density).includes(searchText);

    const matchComposition =
      compositionFilter === "Tous" || c.composition === compositionFilter;

    const matchStatus = statusFilter === "Tous" || c.status === statusFilter;

    return matchText && matchComposition && matchStatus;
  });

  return (
    <div className="space-y-5 p-3">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {t("carburants.title")}
          </h1>
          <p className="text-muted-foreground">{t("carburants.subtitle")}</p>
        </div>

        {canEdit && (
          <button
            onClick={() => openModal("add")}
            className="ml-auto h-11 px-8 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>{t("carburants.add")}</span>{" "}
          </button>
        )}
      </div>

      {/* ================= RECHERCHE ================= */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 w-full">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              type="text"
              placeholder={t("carburants.searchPlaceholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-11 pl-11 pr-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filtre Composition */}
          <div className="relative w-full md:w-60">
            <select
              value={compositionFilter}
              onChange={(e) => setCompositionFilter(e.target.value)}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Tous"> {t("carburants.allCompositions")}</option>
              {Object.values(Composition).map((composition) => (
                <option key={composition} value={composition}>
                  {composition}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre Statut */}
          <div className="relative w-full md:w-60">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Tous"> {t("carburants.allStatuses")}</option>
              {Object.values(FuelStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= CONFIRM DELETE ================= */}
      {showConfirmDelete && (
        <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
          <DialogContent className="max-w-md" hideOverlay={true}>
            <DialogHeader>
              <DialogTitle> {t("carburants.deleteConfirmation")}</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              {t("carburants.deleteQuestion")}{" "}
              <span className="font-bold">{selectedCarburant?.nom}</span> ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
              >
                {t("common.no")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => {
                  if (selectedCarburant?.id) {
                    deleteCarburant(selectedCarburant.id);
                  }
                  setShowConfirmDelete(false);
                }}
              >
                {t("common.confirm")}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-[#B9032C]">
            <tr>
              <th className="px-6 py-5 text-left font-semibold text-white">
                {t("carburants.name")}
              </th>
              <th className="px-6 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.density")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.refTemperature")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.composition")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.h2o")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.co2")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.ethanol")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.nhv")}
              </th>

              <th className="px-2 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.status")}
              </th>

              <th className="px-3 py-5 text-center font-semibold text-white whitespace-nowrap">
                {t("carburants.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCarburants.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-10 text-muted-foreground-500 font-medium"
                >
                  {t("carburants.noFuel")}
                </td>
              </tr>
            ) : (
              filteredCarburants.map((c, index) => (
                <tr key={c.id} className="border-b hover:bg-[#E30613]/5">
                  {/* Nom */}
                  <td className="px-6 py-4 font-semibold text-muted-foreground-800">
                    <div className="max-w-[400px] break-words" title={c.nom}>
                      {c.nom}
                    </div>
                  </td>

                  {/* Density */}
                  <td className="px-6 py-4 text-center text-muted-foreground-800">
                    {c.density}
                  </td>

                  {/* Reference Temperature */}
                  <td className="px-4 py-4 text-center text-muted-foreground-800">
                    {c.referenceTemperature}
                  </td>

                  {/* Composition */}
                  <td className="px-6 py-4 text-center text-muted-foreground-800">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      {c.composition}
                    </span>
                  </td>

                  {/* H2O */}
                  <td className="px-2 py-4 text-center text-muted-foreground-800">
                    {c.h2oContent}
                  </td>

                  {/* CO2 */}
                  <td className="px-2 py-4 text-center text-muted-foreground-800">
                    {c.co2Content}
                  </td>

                  {/* Ethanol */}
                  <td className="px-2 py-4 text-center text-muted-foreground-800">
                    {c.ethanolContent}
                  </td>

                  {/* NHV */}
                  <td className="px-2 py-4 text-center text-muted-foreground-800">
                    {c.nhv}
                  </td>

                  {/* Status */}
                  <td className="px-12 py-4 text-muted-foreground-800r">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => openModal("view", c)}
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            onClick={() => openModal("edit", c)}
                            className="p-1 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCarburant(c);
                              setShowConfirmDelete(true);
                            }}
                            className="p-1 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-[95vw] h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                <h2 className="text-xl font-semibold">
                  {modalMode === "add" && t("carburants.add")}
                  {modalMode === "edit" && t("carburants.edit")}
                  {modalMode === "view" && t("carburants.details")}
                </h2>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-4 overflow-y-auto max-h-[85vh]"
            >
              {/* ================= PROPRIETES ================= */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-4">
                  {t("carburants.physicalProperties")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("carburants.name")}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      value={form.nom}
                      disabled={modalMode === "view"}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("carburants.density")}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.density}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        handleInputChange("density", e.target.value)
                      }
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("carburants.referenceTemperature")}

                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.referenceTemperature}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        handleInputChange(
                          "referenceTemperature",
                          e.target.value,
                        )
                      }
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("carburants.composition")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.composition}
                      required
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        handleInputChange("composition", e.target.value)
                      }
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                    >
                      {Object.values(Composition).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* ================= ATOMS ================= */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-2 mt-2">
                  {t("carburants.atomicComposition")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                    [
                      "carbonNumber",
                      "hydrogenNumber",
                      "oxygenNumber",
                      "nitrogenNumber",
                      "sulfurNumber",
                    ] as const
                  ).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {labels[field]}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={form[field]}
                        disabled={modalMode === "view"}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className="w-full h-11 border rounded-lg px-3 bg-background"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= CONTENU ================= */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-4">
                  {t("carburants.content")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                    [
                      "h2oContent",
                      "co2Content",
                      "ethanolContent",
                      "nhv",
                    ] as const
                  ).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1">
                        {field === "h2oContent" && t("carburants.h2o")}
                        {field === "co2Content" && t("carburants.co2")}
                        {field === "ethanolContent" && t("carburants.ethanol")}
                        {field === "nhv" && t("carburants.nhv")}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={form[field]}
                        disabled={modalMode === "view"}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className="w-full h-11 border rounded-lg px-3 bg-background"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= STATUS ================= */}
              <section>
                <h3 className="block text-sm font-medium mb-1">
                  {t("carburants.state")}
                  <span className="text-red-500 ml-1">*</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <select
                      value={form.status}
                      required
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                    >
                      {Object.values(FuelStatus).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
              {/* ================= COMMENTAIRE ================= */}
              <section>
                <h3 className="block text-sm font-medium mb-1">
                  {" "}
                  {t("carburants.comment")}
                </h3>

                <textarea
                  value={form.commentaire}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    handleInputChange("commentaire", e.target.value)
                  }
                  className="w-full min-h-[120px] border rounded-lg px-3 py-2 bg-background resize-none"
                  placeholder={t("carburants.commentPlaceholder")}
                />
              </section>

              {/* ================= FOOTER ================= */}
              {modalMode !== "view" && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-8 py-2 border rounded-lg  transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-[#E30613] text-white rounded-lg"
                  >
                    {modalMode === "edit"
                      ? t("common.edit")
                      : t("common.save")}{" "}
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

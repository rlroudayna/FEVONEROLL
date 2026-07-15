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

/* ================= ENUMS ================= */

export enum Composition {
  MassRatio = "MassRatio",
  MoleFraction = "MoleFraction",
}

export enum FuelStatus {
  Draft = "Draft",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
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
  status: FuelStatus.Draft,
};

/* ================= COMPONENT ================= */

export function Carburants() {
  const [carburants, setCarburants] = useState<Carburant[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedCarburant, setSelectedCarburant] = useState<Carburant | null>(
    null,
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [role, setRole] = useState("");
  const [form, setForm] = useState<CarburantForm>(INITIAL_FORM_STATE);

  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [selected, setSelected] = useState<Carburant | null>(null);

  /* ================= HANDLERS & ACTIONS ================= */

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
        }),
      });

      setCarburants((prev) => [...prev, created]);
      toast.success("Carburant ajouté avec succès");
      setShowModal(false);
      resetForm();
    } catch {
      toast.error("Erreur lors de l'ajout du carburant");
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
        }),
      });

      setCarburants((prev) =>
        prev.map((c) => (c.id === selectedCarburant.id ? updated : c)),
      );
      toast.success("Carburant modifié avec succès");
      setShowModal(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const deleteCarburant = async (id: number) => {
    try {
      await authFetch(`/carburants/${id}`, { method: "DELETE" });
      setCarburants((prev) => prev.filter((c) => c.id !== id));
      toast.success("Carburant supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
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
    return (
      String(c.density).includes(searchText) ||
      c.composition.toLowerCase().includes(searchLower) ||
      c.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-5 p-3">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Gestion des carburants
          </h1>
          <p className="text-muted-foreground">
            Gérer les carburants disponibles
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => openModal("add")}
            className="ml-auto h-11 px-8 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un carburant</span>
          </button>
        )}
      </div>

      {/* ================= RECHERCHE ================= */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-11 pr-3 rounded-lg border border-border bg-background"
          />
        </div>
      </div>

      {/* ================= CONFIRM DELETE ================= */}
      {showConfirmDelete && (
        <Dialog open={showConfirmDelete}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmation de suppression</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Voulez-vous supprimer ce carburant{" "}
              <span className="font-bold">{selected?.nom}</span> ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Annuler
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
                Supprimer
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#B9032C]">
            <tr>
              <th className="px-5 py-4 text-white text-left">Nom</th>
              <th className="px-5 py-4 text-white text-left">
                Densité (kg/m³){" "}
              </th>
              <th className="px-5 py-4 text-white text-left">Composition</th>
              <th className="px-5 py-4 text-white text-left">Carbon</th>
              <th className="px-5 py-4 text-white text-left">H₂O</th>
              <th className="px-5 py-4 text-white text-left">NHV</th>
              <th className="px-5 py-4 text-white text-left">Status</th>
              <th className="px-5 py-4 text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarburants.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-muted-foreground"
                >
                  Aucun carburant trouvé
                </td>
              </tr>
            ) : (
              filteredCarburants.map((c) => (
                <tr key={c.id} className="border-b hover:bg-[#E30613]/5">
                  <td className="px-5 py-4">{c.nom}</td>
                  <td className="px-5 py-4">{c.density}</td>
                  <td className="px-5 py-4">{c.composition}</td>
                  <td className="px-5 py-4">{c.carbonNumber}</td>
                  <td className="px-5 py-4">{c.h2oContent}</td>
                  <td className="px-5 py-4">{c.nhv}</td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => openModal("edit", c)}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCarburant(c);
                              setShowConfirmDelete(true);
                            }}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openModal("view", c)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
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

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-border">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {modalMode === "add" && "Ajouter un carburant"}
                {modalMode === "edit" && "Modifier un carburant"}
                {modalMode === "view" && "Détails du carburant"}
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
              className="p-6 space-y-8 overflow-y-auto max-h-[85vh]"
            >
              {/* ================= PROPRIETES ================= */}
              <section>
                <h3 className="text-[#B9032C] font-semibold uppercase mb-4 text-sm tracking-wider">
                  Propriétés physiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      value={form.nom}
                      disabled={modalMode === "view"}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="w-full h-11 border rounded-lg px-3 bg-background"
                      placeholder="Ex : Diesel B7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Density (kg/m³)
                    </label>
                    <input
                      type="number"
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
                     Température de référence (°C)
                    </label>
                    <input
                      type="number"
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
                      Composition
                    </label>
                    <select
                      value={form.composition}
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
                <h3 className="text-[#B9032C] font-semibold uppercase mb-4 text-sm tracking-wider">
                  Composition atomique
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        {field.replace("Number", "")}
                      </label>
                      <input
                        type="number"
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
                <h3 className="text-[#B9032C] font-semibold uppercase mb-4 text-sm tracking-wider">
                  Contenu
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
                        {field === "h2oContent" && "H₂O (%)"}
                        {field === "co2Content" && "CO₂ (%)"}
                        {field === "ethanolContent" && "Ethanol (%)"}
                        {field === "nhv" && "NHV (J/kg)"}
                      </label>
                      <input
                        type="number"
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
                <h3 className="text-[#B9032C] font-semibold uppercase mb-4 text-sm tracking-wider">
                  État
                </h3>
                <select
                  value={form.status}
                  disabled={modalMode === "view"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full md:w-72 h-11 border rounded-lg px-3 bg-background"
                >
                  {Object.values(FuelStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                    className="px-6 py-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#B9032C] text-white rounded-lg hover:brightness-110 transition-all"
                  >
                    {modalMode === "edit" ? "Modifier" : "Enregistrer"}
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

import { useEffect, useState } from "react";
import { authFetch } from "../api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

import { toast } from "sonner";
import { Button } from "@headlessui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  CHARGE_ESSAI: "bg-blue-100 text-blue-700",
  TECHNICIEN_ESSAI: "bg-green-100 text-green-700",
  EXTERNE: "bg-red-100 text-red-700",
};
const ALL_ROLES = "ALL";
const roles = [
  { label: "ADMIN", value: "ADMIN" },
  { label: "CHARGE_ESSAI", value: "CHARGE_ESSAI" },
  { label: "TECHNICIEN_ESSAI", value: "TECHNICIEN_ESSAI" },
  { label: "EXTERNE", value: "EXTERNE" },
];

export enum Role {
  ADMIN = "ADMIN",
  CHARGE_ESSAI = "CHARGE_ESSAI",
  TECHNICIEN_ESSAI = "TECHNICIEN_ESSAI",
  EXTERNE = "EXTERNE",
}
interface Client {
  id?: number;
  nom: string;
}

interface User {
  id?: number;
  nom: string;
  prenom: string;
  clientId?: number;
  client: Client;
  email: string;
  role: Role;
  numeroTelephone?: string;
  motDePasse?: string;
  image?: string;
}
export function Users() {
  const [searchText, setSearchText] = useState("");
  const [clientFilter, setClientFilter] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const INTERNAL_ROLES = [Role.ADMIN, Role.CHARGE_ESSAI, Role.TECHNICIEN_ESSAI];
  const FEV_CLIENT_NAME = "FEV";
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeClients, setActiveClients] = useState<
    { id: number; nom: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [allClients, setAllClients] = useState<{ id: number; nom: string }[]>(
    [],
  );
  const { t } = useTranslation();
  const [passwordError, setPasswordError] = useState("");
  const isStrongPassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    clientId: "",
    numeroTelephone: "",
    motDePasse: "",
  });

  const isViewMode = modalMode === "view";
  const isEditMode = modalMode === "edit";
  const isAddMode = modalMode === "add";
  const isAdmin = currentUser?.role === "ADMIN";
  const [countryCode, setCountryCode] = useState("+212");

  /* ---------------- FILTER ---------------- */
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase();

    const matchesText =
      fullName.includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      roleFilter === "Tous" || roleFilter === "Tous les roles"
        ? true
        : u.role === roleFilter;

    const matchesClient =
      clientFilter === "Tous" ? true : u.client?.nom === clientFilter;

    return matchesText && matchesRole && matchesClient;
  });
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      role: "",
      clientId: "",
      numeroTelephone: "",
      motDePasse: "",
    });

    setSelectedUser(null);
  };

  useEffect(() => {
    if (clients.length === 0) return;

    const isInternal = INTERNAL_ROLES.includes(formData.role as Role);
    if (!isInternal) return;
    const fevClient = clients.find((c) => c.nom.trim().toLowerCase() === "fev");
    if (fevClient) {
      setFormData((prev) => ({ ...prev, clientId: String(fevClient.id) }));
    }
  }, [clients, formData.role]);
  const fetchUsers = async () => {
    try {
      const data: User[] = await authFetch("/users");
      setUsers(data);
    } catch (error) {
      console.error("Erreur chargement users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isInternalRole = (role: string) =>
    [Role.ADMIN, Role.CHARGE_ESSAI, Role.TECHNICIEN_ESSAI].includes(
      role as Role,
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      role: formData.role,
      numeroTelephone: formData.numeroTelephone,
      motDePasse: formData.motDePasse,
      clientId: Number(formData.clientId),
    };

    // validation custom
    if (!formData.nom || !formData.prenom || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (modalMode === "add" && !isStrongPassword(formData.motDePasse)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      return;
    }

    setPasswordError("");

    try {
      if (modalMode === "add") {
        await authFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        toast.success(t("users.createdSuccess"));
      } else if (modalMode === "edit" && selectedUser?.id) {
        const updated = await authFetch(`/users/${selectedUser.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updated : u)),
        );

        toast.success(t("users.updatedSuccess"));
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      const message = err?.message || "Erreur opération utilisateur";

      toast.error(message);
    }
  };
  const handleDeleteUser = async (id: number) => {
    try {
      await authFetch(`/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(t("users.deletedSuccess"));
    } catch (err: any) {
      toast.error(
        err?.message?.includes("constraint") ||
          err?.message?.includes("foreign key")
          ? t("users.deleteConstraintError")
          : t("users.deleteError"),
      );
    }
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setCurrentUser(user);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCurrentUser();
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
    fetchActiveClients();
    fetchAllClients();
  }, []);
  return (
    <div className="space-y-5 p-3">
      <div className="flex items-center justify-between">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-semibold text-foreground
 mb-2 text-left mb-2"
          >
            {t("users.title")}
          </h1>
          <p className="text-muted-foreground text-left">
            {t("users.subtitle")}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              resetForm();
              resetForm();
              setModalMode("add");
              setShowModal(true);
            }}
            className="h-11 px-6 bg-[#B9032C] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            {t("users.add")}
          </button>
        )}
      </div>
      {/* Barre de recherche et filtres */}
      <div
        className="p-5 bg-card rounded-xl   border border-border
 shadow-sm flex items-center gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400" />
          <input
            type="text"
            placeholder={t("users.searchPlaceholder")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-10 pr-3 bg-background border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-full sm:w-60 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground placeholder:text-muted"
        >
          <option value="Tous">{t("users.allClients")}</option>

          {allClients.map((c) => (
            <option key={c.id} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>

        <select
          className="w-full sm:w-60 h-12 px-4 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="Tous">{t("users.allRoles")}</option>
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      {/* Tableau des utilisateurs */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm text-left border-collapse">
          {/* Header */}
          <thead className="bg-[#B9032C]">
            <tr>
              <th className="w-[22%] px-6 py-5 font-semibold text-white">
                {t("users.user")}
              </th>

              <th className="w-[15%] px-8 py-5 font-semibold text-white">
                {t("users.role")}
              </th>

              <th className="w-[15%] px-6 py-5 font-semibold text-white">
                {t("users.client")}
              </th>

              <th className="w-[21%] px-8 py-5 font-semibold text-white">
                {t("users.email")}
              </th>

              <th className="w-[20%] px-8 py-5 font-semibold text-white">
                {t("users.phone")}
              </th>

              <th className="w-[12%] px-14 py-5 text-right font-semibold text-white">
                {t("users.actions")}
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-card">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-[#E30613]/3 transition-colors"
              >
                {/* Utilisateur */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold text-muted-foreground-900">
                        {user.prenom} {user.nom}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role] ||
                      "bg-gray-100 text-muted-foreground-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Client */}
                <td className="px-6 py-4 text-muted-foreground-500">
                  {user.client?.nom || "—"}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-muted-foreground-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </td>

                {/* Téléphone */}
                <td className="px-6 py-4 text-muted-foreground-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                    {user.numeroTelephone
                      ? user.numeroTelephone.replace(
                          /(\+\d{1,3})(\d+)/,
                          "$1 $2",
                        )
                      : "—"}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-4">
                  <div className="flex items-center justify-end gap-3">
                    {isAdmin && (
                      <Button
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            nom: user.nom,
                            prenom: user.prenom,
                            email: user.email,
                            role: user.role,
                            clientId: user.client?.id
                              ? String(user.client.id)
                              : "",
                            numeroTelephone: user.numeroTelephone ?? "",
                            motDePasse: "",
                          });
                          setModalMode("view");
                          setShowModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </Button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            nom: user.nom,
                            prenom: user.prenom,
                            email: user.email,
                            role: user.role,
                            clientId: user.client?.id
                              ? String(user.client.id)
                              : "",
                            numeroTelephone: user.numeroTelephone ?? "",
                            motDePasse: "",
                          });
                          setModalMode("edit");
                          setShowModal(true);
                        }}
                        className="p-1 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-green-700" />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowConfirmDelete(true);
                        }}
                        className="p-1 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-700" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Message si aucun résultat */}
        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground-500">
            {t("users.noUser")}
          </div>
        )}
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle> {t("users.deleteConfirmation")}</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground-700">
            {t("users.deleteQuestion")}{" "}
            <span className="font-bold">
              {selectedUser?.nom} {selectedUser?.prenom}
            </span>{" "}
            ?
          </p>
          <div className="flex justify-end gap-4 mt-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 border rounded-lg 
           hover:bg-gray-100 dark:hover:bg-gray-500 
           transition-colors shadow-sm"
            >
              {t("common.no")}
            </button>
            <button
              onClick={() => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser.id!);
                }
                setShowConfirmDelete(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {t("common.confirm")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal d'ajout */}
      {/* ================= USER FORM MODAL ================= */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card w-[90vw] h-[90vh] px-10 py-6 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
          {" "}
          {/* HEADER */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground border-b border-border pb-2">
              {" "}
              {modalMode === "add" && t("users.add")}
              {modalMode === "edit" && t("users.edit")}
              {modalMode === "view" && t("users.details")}
            </DialogTitle>
          </DialogHeader>
          {/* FORMULAIRE UNIQUE */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 mx-auto w-full max-w-8xl space-y-6"
          >
            {" "}
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
              {/* PRENOM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  {t("users.firstName")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.prenom}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
      focus:outline-none focus:ring-2 focus:ring-ring transition"
                  required
                />
              </div>

              {/* NOM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  {t("users.lastName")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.nom}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
      focus:outline-none focus:ring-2 focus:ring-ring transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 ">
                <label className="text-sm font-medium">
                  {t("users.email")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  required
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
      focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {/* EMAIL */}

              {/* TELEPHONE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  {t("users.phone")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="flex gap-6">
                  <PhoneInput
                    country={"ma"}
                    disabled={modalMode === "view"}
                    value={formData.numeroTelephone}
                    onChange={(phone) =>
                      setFormData({ ...formData, numeroTelephone: "+" + phone })
                    }
                    inputClass="!w-full !h-11 !pl-14 !rounded-lg !border !border-border !bg-background"
                    containerClass="w-full"
                  />
                </div>
              </div>
              {/* ROLE + CLIENT */}
              {/* ROLE */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium">
                  {t("users.role")} <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.role}
                  disabled={modalMode === "view"}
                  required
                  onChange={(e) => {
                    const role = e.target.value as Role;
                    const isInternal = INTERNAL_ROLES.includes(role);

                    const fevClient = activeClients.find(
                      (c) =>
                        c.nom.trim().toLowerCase() ===
                        FEV_CLIENT_NAME.toLowerCase(),
                    );

                    setFormData((prev) => ({
                      ...prev,
                      role,
                      clientId:
                        isInternal && fevClient ? String(fevClient.id) : "",
                    }));
                  }}
                  className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
      focus:outline-none focus:ring-2 focus:ring-ring transition"
                >
                  <option value="">{t("common.select")}</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CLIENT */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium">
                  {t("users.client")} <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.clientId}
                  disabled={
                    modalMode === "view" ||
                    INTERNAL_ROLES.includes(formData.role as Role)
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">{t("users.selectClient")}</option>

                  {activeClients.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {" "}
                      {/* ← String() ici */}
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* PASSWORD */}
            {modalMode === "add" && (
              <div className="grid grid-cols-3 gap-8 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    {t("users.password")}{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.motDePasse}
                      onChange={(e) => {
                        const password = e.target.value;

                        setFormData({
                          ...formData,
                          motDePasse: password,
                        });

                        if (isStrongPassword(password)) {
                          setPasswordError("");
                        }
                      }}
                      className={`w-full h-11 px-3 pr-11 rounded-lg border bg-background text-foreground
      focus:outline-none focus:ring-2 focus:ring-ring transition
      ${
        passwordError ? "border-red-500 focus:border-red-500" : "border-border"
      }`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
      text-muted-foreground hover:text-foreground
      transition-colors"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
              </div>
            )}
            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-3 border rounded-lg"
              >
                {t("common.cancel")}
              </button>

              {modalMode !== "view" && (
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white rounded-lg"
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

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  Eye,
  EyeOff,
  Building,
  Shield,
  Edit,
  Check,
} from "lucide-react";
import { authFetch } from "../api";
import { toast } from "sonner";

export function Profile() {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [imageError, setImageError] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  interface Client {
    id?: number;
    nom: string;
  }
  const [profileData, setProfileData] = useState({
    id: "",
    nom: "",
    prenom: "",
    numeroTelephone: "",
    email: "",
    role: "",
    client: "",
    image: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await authFetch("/users/me");

        setProfileData({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          numeroTelephone: user.numeroTelephone,
          email: user.email,
          role: user.role,
          client: user.client?.nom,
          image: user.image
            ? "http://localhost:8080" + user.image
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        });

        setPhone(user.numeroTelephone);
      } catch (err) {
        console.error("Erreur chargement profil", err);
      }
    }

    loadProfile();
  }, []);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const handleSavePhoto = async () => {
    if (!newImageFile) return;

    // ❌ 1. Vérifier taille (2 Mo)
    if (newImageFile.size > 2 * 1024 * 1024) {
      setImageError("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    // ❌ 2. Vérifier type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(newImageFile.type)) {
      setImageError("Format invalide (jpg ou png uniquement)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", newImageFile);

      const res = await fetch(
        `http://localhost:8080/api/users/${profileData.id}/image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      // ❌ si backend renvoie erreur
      if (!res.ok) {
        const errorText = await res.text();
        toast.error(errorText || "Erreur upload image");
        return;
      }

      const updatedUser = await res.json();

      setProfileData({
        ...profileData,
        image: "http://localhost:8080" + updatedUser.image,
      });

      toast.success("Image mise à jour avec succès");

      setIsEditingPhoto(false);
    } catch (err) {
      console.error("Erreur update photo", err);
      toast.error("Erreur serveur lors de l'upload");
    }
  };

  const handleChangePassword = async () => {
    setOldPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Minimum 8 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoadingPwd(true);

      await authFetch(`/users/me/change-password`, {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      toast.success("Mot de passe modifié avec succès");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOldPasswordError("");
      setIsChangingPassword(false);
    } catch (err: any) {
      console.error("Password error:", err);

      const message =
        err.message || "Erreur lors du changement de mot de passe";

      if (message.includes("Ancien mot de passe")) {
        setOldPasswordError(message);
      } else {
        toast.error(message);
      }
    } finally {
      setLoadingPwd(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground-500 text-sm">
          Gestion de vos informations personnelles
        </p>
      </div>

      {/* CARD */}
      <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
        {/* HEADER PROFILE */}
        <div className="bg-[#B9032C] p-4 flex items-center gap-5 text-white">
          <div className="relative">
            <img
              src={profileData.image}
              className="w-18 h-18 rounded-full border-4 border-white object-cover"
            />

            <button
              onClick={() => setIsEditingPhoto(true)}
              className="absolute bottom-0 right-0 bg-black p-2 rounded-full hover:scale-105"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {profileData.nom} {profileData.prenom}
            </h2>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-8">
          {/* INFOS */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations personnelles
            </h3>

            <div className="grid md:grid-cols-3 gap-6 text-foreground">
              {" "}
              <Info label="Prénom" value={profileData.prenom} icon={User} />
              <Info label="Nom" value={profileData.nom} icon={User} />
              {/* PHONE */}
              <div className="border border-border rounded-lg p-3 flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground-500" />

                  <div>
                    <p className="text-xs text-muted-foreground-500">
                      Téléphone
                    </p>

                    {isEditingPhone ? (
                      <input
                        className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditingPhone ? (
                    <Check
                      className="cursor-pointer text-green-600"
                      onClick={async () => {
                        try {
                          const updatedUser = await authFetch(
                            `/users/${profileData.id}/phone`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "text/plain",
                              },
                              body: phone,
                            },
                          );

                          setProfileData((prev) => ({
                            ...prev,
                            numeroTelephone: updatedUser.numeroTelephone,
                          }));

                          setPhone(updatedUser.numeroTelephone);
                          setIsEditingPhone(false);

                          toast.success("Téléphone mis à jour !");
                        } catch (err) {
                          console.error("Erreur update téléphone", err);
                          toast.error("Erreur lors de la mise à jour");
                        }
                      }}
                    />
                  ) : (
                    <Edit
                      className="cursor-pointer text-muted-foreground-500 hover:text-red-600"
                      onClick={() => setIsEditingPhone(true)}
                    />
                  )}
                </div>
              </div>
              <Info label="Email" value={profileData.email} icon={Mail} />
              <Info label="Role" value={profileData.role} icon={Shield} />
              <Info
                label="Société"
                value={profileData.client}
                icon={Building}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg"></h3>

              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[#E30613] text-sm font-medium hover:underline"
                >
                  Modifier le mot de passe
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card p-5 rounded-xl w-[400px] space-y-3">
            <h2 className="font-bold text-lg">Changer mot de passe</h2>

            {/* ancien mot de passe */}
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Ancien mot de passe"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 pr-10 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground-500"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {oldPasswordError && (
              <p className="text-red-500 text-sm">{oldPasswordError}</p>
            )}

            {/* nouveau mot de passe */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 pr-10 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* confirmation */}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 pr-10 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* erreurs */}
            {newPassword && newPassword.length < 8 && (
              <p className="text-red-500 text-sm">
                Minimum 8 caractères requis
              </p>
            )}

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm">
                Les mots de passe ne correspondent pas
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-3 py-1 border rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleChangePassword}
                disabled={
                  loadingPwd ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 8
                }
                className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {loadingPwd ? "..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO MODAL */}
      {isEditingPhoto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-4 rounded-xl border space-y-3 w-[400px]">
            <h2 className="font-bold text-lg">Changer photo de profil</h2>

            <label className="cursor-pointer flex items-center justify-center w-full border p-2 rounded bg-gray-50 hover:bg-gray-100">
              {newImageFile ? newImageFile.name : "Sélectionner une image"}

              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewImageFile(file);
                  setImageError("");
                }}
              />
            </label>

            {/* 👇 MESSAGE ERREUR */}
            {imageError && (
              <p className="text-red-500 text-sm mt-1 w-full text-center">
                {imageError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingPhoto(false)}
                className="px-3 py-1 border rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleSavePhoto}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Info({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string;
  icon: any;
  className?: string;
}) {
  return (
    <div className={`p-2 bg-card border border-border rounded-lg ${className}`}>
      {" "}
      <div className="flex items-center gap-2 text-xs text-muted-foreground-500 mb-1">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
      <p className="font-medium text-foreground">{value}</p>{" "}
    </div>
  );
}

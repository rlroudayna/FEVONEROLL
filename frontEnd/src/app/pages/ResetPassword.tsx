import { useState } from "react";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  const [error, setError] = useState<string | null>(null);
  const isStrongPassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      );
      return;
    }

    if (!token) {
      toast.error("Token invalide");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/users/reset-password?token=${token}&password=${password}`,
        {
          method: "POST",
        },
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la réinitialisation");
      }

      toast.success("Mot de passe modifié !");

      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {t("resetPassword.title")}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {t("resetPassword.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nouveau mot de passe */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("resetPassword.newPassword")}
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-1 focus:ring-red-100 focus:border-red-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-[#E30613]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirmation */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("resetPassword.confirmPassword")}
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-1 focus:ring-red-100 focus:border-red-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-[#E30613]"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400
                       text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "Chargement..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}

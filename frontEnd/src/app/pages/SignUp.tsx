import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Gauge } from "lucide-react";

export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A2647] rounded-full mb-4">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-black">
            SmartTest
          </h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prénom{" "}
                  <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prenom: e.target.value,
                    })
                  }
                  required
                  className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nom: e.target.value,
                    })
                  }
                  required
                  className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Rôle <span className="text-[#C62828]">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                required
                className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
              >
                <option value="">
                  Sélectionner votre rôle
                </option>
                <option value="conducteur">Conducteur</option>
                <option value="chargeEssais">
                  Chargé d'essais
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
                className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe{" "}
                <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
                className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmation mot de passe{" "}
                <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                className="flex-1 h-12 px-6 border border-[#E0E0E0] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="flex-1 h-12 bg-[#0288D1] text-white rounded-lg hover:bg-[#0277BD] transition-colors font-medium"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-black"
          >
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
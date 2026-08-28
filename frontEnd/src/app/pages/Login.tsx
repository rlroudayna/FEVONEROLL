import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { images } from "../../assets/images";
import { useTranslation } from "react-i18next";

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          motDePasse,
        }),
      });

      let data;

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (!res.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Email ou mot de passe incorrect",
        );
      }

      localStorage.setItem("token", data.token);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="flex items-center justify-center min-h-screen gap-2">
        {/* Partie Logo (50%) */}
        <div
          className={`
          w-1/2 flex justify-center items-center
          transition-all duration-[1500ms] ease-in-out
          ${startAnimation ? "opacity-100" : "opacity-0"}
        `}
        >
          <img
            src={images.logo3}
            alt="Logo"
            className="w-[450px] max-w-[80%] h-auto"
          />
        </div>

        {/* Partie Formulaire (50%) */}
        <div
          className={`
          w-1/2 flex justify-center items-center px-6
          transition-all duration-[1500ms] ease-in-out
          ${
            startAnimation
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-20"
          }
        `}
        >
          <div className="w-full max-w-md">
            <div className="bg-card shadow-2xl rounded-3xl p-80 md:p-10 border border-border">
              <h1 className="text-3xl font-extrabold text-[#E30613] text-center mb-8">
                {t("login.title")}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t("login.professionalEmail")}{" "}
                    <span className="text-[#E30613]"> *</span>
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("login.emailPlaceholder")}
                    className="w-full h-12 px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">
                      {t("login.password")}
                      <span className="text-[#E30613]"> *</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      required
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full h-12 px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-xs hover:text-[#E30613]"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                {/* Erreur */}
                <div className="min-h-[20px]">
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                </div>

                {/* Bouton */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#c40510] text-white rounded-xl font-bold text-lg hover:bg-[#E30613] transition-all"
                >
                  {t("login.submit")}
                </button>
              </form>
            </div>

            <div className="text-center mt-4">
              <Link
                to="/"
                className="text-sm text-foreground-600 hover:text-black"
              >
                {t("login.backHome")}
              </Link>
            </div>
          </div>
        </div>

        {/* Logo au centre pendant 2 secondes */}
        {!startAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-background">
            <img
              src={images.logo3}
              alt="Logo"
              className="w-[450px] max-w-[80%] h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

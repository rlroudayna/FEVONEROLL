import { Link } from "react-router";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:8080/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-card rounded-xl shadow-sm p-8">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("forgotPassword.title")}
              </h2>
              <p className="text-muted-foreground-600 mb-6 text-sm">
                {t("forgotPassword.description")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("forgotPassword.email")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-4 border border-border bg-background text-foreground rounded-lg
focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t("forgotPassword.emailPlaceholder")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#E30613] text-white rounded-lg  hover:bg-[#E30613] active:scale-[0.98] transition-all shadow-lg mt-1 transition-colors font-medium"
                >
                  {t("forgotPassword.sendLink")}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {t("forgotPassword.successTitle")}
              </h2>
              <p className="text-muted-foreground-600 mb-6 text-sm">
               
                {t("forgotPassword.successMessage", { email })}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground-600 hover:text-[#E30613] transition-colors"
              >
                {t("forgotPassword.resend")}
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground-600 hover:text-[#E30613] transition-colors"
            >
              <ArrowLeft size={16} /> {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

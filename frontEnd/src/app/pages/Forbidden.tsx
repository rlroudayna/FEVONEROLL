import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export function Forbidden() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldAlert className="w-16 h-16 text-[#ED6C02] mx-auto mb-4" />

        <h1 className="text-6xl font-semibold text-black mb-4">403</h1>

        <p className="text-xl text-gray-600 mb-8">
          Accès refusé
        </p>

        <p className="text-gray-500 mb-8">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        </p>

        <Link
          to="/app"
          className="px-8 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/80 transition-colors inline-block"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
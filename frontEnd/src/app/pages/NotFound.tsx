import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-[#ED6C02] mx-auto mb-4" />
        <h1 className="text-6xl font-semibold text-black mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
        <Link
          to="/"
          className="px-8 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/80 transition-colors inline-block"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

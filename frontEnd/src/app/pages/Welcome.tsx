import { Link } from "react-router";
import bg from "../../assets/images/image1.png";
import { useTranslation } from "react-i18next";

export function Welcome() {
  const { t } = useTranslation();
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center  relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/*Overlay pour lisibilité */}
      <div className="absolute inset-0 bg-cover bg-center blur-md"></div>

      {/* Contenu */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Titre */}
        <h1 className="text-5xl font-semibold text-white mb-4 drop-shadow-lg">
          {t("welcome.title")}{" "}
        </h1>

        {/* Sous-titre */}
        <p className="text-xl text-white/90 mb-10 drop-shadow-sm">
          {t("welcome.subtitle")}{" "}
        </p>

        {/* Bouton */}
        <Link
          to="/login"
          className="inline-block px-20 py-4 text-[#E30613] rounded-lg bg-white  transition-all duration-300 shadow-md hover:shadow-xl font-medium"
        >
          {t("welcome.accessPlatform")}{" "}
        </Link>
      </div>
    </div>
  );
}

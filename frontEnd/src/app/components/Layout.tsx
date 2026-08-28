import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  Home,
  Car,
  BarChart3,
  Settings,
  Repeat,
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  Bell,
  User,
  Users,
  LogOut,
  ChevronLeft,
  MenuIcon,
  ChevronRight,
  Power,
  Building2,
  Fuel,
} from "lucide-react";
import { toggleTheme } from "../../styles/theme";
import { Moon, Sun } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { authFetch } from "../api";
import { DoorOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { images } from "../../assets/images";
export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
export enum Role {
  ADMIN = "ADMIN",
  CHARGE_ESSAI = "CHARGE_ESSAI",
  TECHNICIEN_ESSAI = "TECHNICIEN_ESSAI",
  EXTERNE = "EXTERNE",
}
interface User {
  id?: number;
  nom: string;
  prenom: string;
  client: Client;
  email: string;
  role: Role;
  numeroTelephone?: string;
  motDePasse?: string;
  image?: string;
}
const navigation = [
  {
    name: "navigation.dashboard",
    path: "/app",
    icon: Home,
    end: true,
  },
  {
    name: "navigation.users",
    path: "/app/users",
    icon: Users,
    roles: [Role.ADMIN],
  },
  {
    name: "navigation.clients",
    path: "/app/clients",
    icon: Building2,
    roles: [Role.ADMIN],
  },
  {
    name: "navigation.vehicules",
    path: "/app/vehicules",
    icon: Car,
  },
  {
    name: "navigation.loisDeRoute",
    path: "/app/lois-de-route",
    icon: BarChart3,
  },
  {
    name: "navigation.calages",
    path: "/app/calages",
    icon: Settings,
  },
  {
    name: "navigation.cycles",
    path: "/app/cycles",
    icon: Repeat,
  },
  {
    name: "navigation.carburants",
    path: "/app/carburants",
    icon: Fuel,
    roles: [Role.ADMIN, Role.CHARGE_ESSAI],
  },
  {
    name: "navigation.demandes",
    path: "/app/demandes",
    icon: FileText,
  },
  {
    name: "navigation.planning",
    path: "/app/planning",
    icon: Calendar,
  },
  {
    name: "navigation.validation",
    path: "/app/validation",
    icon: CheckCircle,
  },
];

export function Layout() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // État pour gérer si la barre est réduite ou non
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.clear(); // supprime tout (simple et efficace)
    navigate("/login");
  };

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      authFetch("/users/me")
        .then((data) => {
          console.log("USER:", data);
          setUser(data);
        })
        .catch((err) => console.error(err));
    }
  }, []);
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;

    if (!user) return false; // important

    return item.roles.includes(user.role);
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar avec largeur dynamique */}
      <aside
        className={`${
          isCollapsed ? "w-24" : "w-60"
        } bg-[#B3002B] text-white flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header de la Sidebar avec le bouton Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-[#E30613]/30 rounded-lg ml-auto px-4"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={22} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive ? "bg-white text-[#B3002B]" : "text-white"
                  } ${isCollapsed ? "justify-center px-0" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-[#B3002B]" : "text-white"
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="whitespace-nowrap overflow-hidden">
                        {t(item.name)}{" "}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14  border-b bg-header border-header-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={images.logo3}
              alt="FevOneRoll Logo"
              className="h-18 w-23 object-contain"
            />
            <span className="font-semibold text-lg text-foreground">
              FevOneRoll
            </span>
          </div>{" "}
          <div className="flex items-center gap-3">
            {/* Langue */}
            <select
              value={i18n.language}
              onChange={(e) => {
                const language = e.target.value as "fr" | "en";
                i18n.changeLanguage(language);
                localStorage.setItem("language", language);
              }}
              className="h-9 px-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none cursor-pointer"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>

            {/* Thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg 
      hover:bg-black/5 dark:hover:bg-white/10 
      transition-colors"
            >
              <Sun className="hidden dark:block w-5 h-5 text-foreground" />
              <Moon className="block dark:hidden w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* Bouton Profil */}
            <button
              onClick={() => navigate("/app/profile")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
             hover:bg-black/5 dark:hover:bg-white/10 
             transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                <img
                  src={
                    user?.image
                      ? "http://localhost:8080" + user.image
                      : "https://ui-avatars.com/api/?name=" +
                        (user?.nom || "U") +
                        "+" +
                        (user?.prenom || "")
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-sm text-muted-foreground-700">
                {user ? `${user.nom} ${user.prenom}` : "Chargement..."}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
             hover:bg-black/5 dark:hover:bg-white/10 
             transition-colors"
            >
              <Power className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">
                {" "}
                {t("common.logout")}
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

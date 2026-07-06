import { useEffect, useState } from "react";
import {
  Car,
  BarChart3,
  Settings,
  Repeat,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { authFetch } from "../api";

const technicienValidationData = {};
const pieDataByClient = {};
const groupedValidationData = [
  {
    month: "Jan",
    OK: 10,
    NOK: 4,
    SousReserve: 1,
    type: "charge",
  },
];
const chargeValidationData = {
  "Tous les chargés d'essai": [
    { name: "OK", value: 8, color: "#2E7D32" },
    { name: "NOK", value: 24, color: "#C62828" },
    { name: "Sous réserve", value: 6, color: "#ED6C02" },
  ],
};
interface Client {
  id?: number;
  nom: string;
}
export function Dashboard() {
  const [selectedTechnicienId, setSelectedTechnicienId] = useState<
    number | null
  >(null);
  const [selectedCharge, setSelectedCharge] = useState(
    "Tous les chargés d'essai",
  );
  const [vehiculeCount, setVehiculeCount] = useState(0);
  const [loiRouteCount, setLoiRouteCount] = useState(0);
  const [calageCount, setCalageCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalEssais, setTotalEssais] = useState(0);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [barData, setBarData] = useState([]);
  const [chargeData, setChargeData] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [charges, setCharges] = useState<
    { label: string; value: number | null }[]
  >([]);

  const [selectedChargeId, setSelectedChargeId] = useState<number | null>(null);
  const [techniciens, setTechniciens] = useState<
    { label: string; value: number | null }[]
  >([]);
  const [role, setRole] = useState("");
  const canSeeTechValidationCards =
    role === "ADMIN" || role === "TECHNICIEN_ESSAI";

  const canSeeChargeValidationCards =
    role === "ADMIN" || role === "CHARGE_ESSAI";
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [technicienData, setTechnicienData] = useState<TechnicienStat[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedChargeTechId, setSelectedChargeTechId] = useState<
    number | null
  >(null);
  const months = [
    { label: "Janvier", value: 1 },
    { label: "Février", value: 2 },
    { label: "Mars", value: 3 },
    { label: "Avril", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Juin", value: 6 },
    { label: "Juillet", value: 7 },
    { label: "Août", value: 8 },
    { label: "Septembre", value: 9 },
    { label: "Octobre", value: 10 },
    { label: "Novembre", value: 11 },
    { label: "Décembre", value: 12 },
  ];
  const [weeklyData, setWeeklyData] = useState([]);

  const isAdmin = role === "ADMIN";
  type WeeklyDataByClientType = {
    [client: string]: {
      [month: string]: any;
    };
  };
  const weeklyDataByClient: WeeklyDataByClientType = {};

  type PieDataItem = {
    name: string;
    value: number;
    color: string;
  };
  type TechnicienStat = {
    technicienId: number;
    nom: string;
    prenom: string;
    totalDemandes: number;
  };

  type Technicien = {
    id: number;
    nom: string;
    prenom: string;
  };
  const [pieData, setPieData] = useState<PieDataItem[]>([]);

  const getClientParam = () =>
    selectedClientId !== null ? `?clientId=${selectedClientId}` : "";

  const filteredTechniciens =
    selectedTechnicienId === null
      ? technicienData
      : technicienData.filter(
          (t: any) => t.technicienId === selectedTechnicienId,
        );
  const technicienAggregated = filteredTechniciens.reduce(
    (acc: any, t: any) => {
      acc.ok += t.ok ?? 0; // ✅ "ok"
      acc.nok += t.nok ?? 0; // ✅ "nok" (pas "NOK")
      acc.sousReserve += t.okSousReserve ?? 0; // ✅ "okSousReserve"
      return acc;
    },
    { ok: 0, nok: 0, sousReserve: 0 },
  );

  const pieTeschnicienData = [
    { name: "OK", value: technicienAggregated.ok, color: "#2E7D32" },
    { name: "NOK", value: technicienAggregated.nok, color: "#C62828" },
    {
      name: "Sous réserve",
      value: technicienAggregated.sousReserve,
      color: "#ED6C02",
    },
  ];
  const filteredCharges =
    selectedChargeId === null
      ? chargeData
      : chargeData.filter((c: any) => c.chargeId === selectedChargeId);

  const chargeAggregated = filteredCharges.reduce(
    (acc: any, c: any) => {
      acc.ok += c.ok ?? 0;
      acc.nok += c.nok ?? 0;
      acc.sousReserve += c.okSousReserve ?? 0;
      return acc;
    },
    { ok: 0, nok: 0, sousReserve: 0 },
  );

  const pieChargeData = [
    {
      name: "OK",
      value: chargeAggregated.ok,
      color: "#2E7D32",
    },
    {
      name: "NOK",
      value: chargeAggregated.nok,
      color: "#C62828",
    },
    {
      name: "Sous réserve",
      value: chargeAggregated.sousReserve,
      color: "#ED6C02",
    },
  ];
  useEffect(() => {
    const fetchVehicules = async () => {
      const data = await authFetch(`/vehicules/count${getClientParam()}`);
      setVehiculeCount(data);
    };

    fetchVehicules();
  }, [selectedClientId]);

  useEffect(() => {
    const fetchLoiCount = async () => {
      try {
        const client = selectedClientId ? `?clientId=${selectedClientId}` : "";

        const data = await authFetch(`/lois-route/count${client}`);

        setLoiRouteCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de loi :", err);
      }
    };

    fetchLoiCount();
  }, [selectedClientId]);

  useEffect(() => {
    const fetchCalageCount = async () => {
      try {
        const client = selectedClientId ? `?clientId=${selectedClientId}` : "";

        const data = await authFetch(`/calages/count${client}`);

        setCalageCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de calage :", err);
      }
    };

    fetchCalageCount();
  }, [selectedClientId]);

  useEffect(() => {
    const fetchCycleCount = async () => {
      try {
        const client = selectedClientId ? `?clientId=${selectedClientId}` : "";

        const data = await authFetch(`/cycles/count${client}`);

        setCycleCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de cycle :", err);
      }
    };

    fetchCycleCount();
  }, [selectedClientId]);

  // ✅ 1. useEffect UNIQUEMENT pour construire la liste du select
  // Dépend seulement de selectedClientId
  useEffect(() => {
    const fetchTechniciensList = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClientId !== null)
          params.append("clientId", String(selectedClientId));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await authFetch(
          `/demandes-essai/stats/technicien-client${query}`,
        );

        // Construire la liste — pas de filtre technicien ici
        const unique = Array.from(
          new Map(
            (data as any[]).map((t: any) => [
              t.technicienId,
              { value: t.technicienId, label: `${t.nom} ${t.prenom}` },
            ]),
          ).values(),
        ) as { label: string; value: number | null }[];

        setTechniciens(unique);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTechniciensList();
  }, [selectedClientId]);

  useEffect(() => {
    const fetchTechnicienStats = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClientId !== null)
          params.append("clientId", String(selectedClientId));
        if (selectedTechnicienId !== null)
          params.append("technicienId", String(selectedTechnicienId));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await authFetch(
          `/demandes-essai/stats/technicien-client${query}`,
        );

        setTechnicienData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTechnicienStats();
  }, [selectedClientId, selectedTechnicienId]); // ✅ les deux filtres pour les stats // ✅ réagit aussi au filtre technicien

  useEffect(() => {
    const fetchWeekly = async () => {
      const params = new URLSearchParams();

      params.append("month", String(selectedMonth));

      if (selectedClientId !== null) {
        params.append("clientId", String(selectedClientId));
      }

      const url = `/demandes-essai/evolution-semaine?${params.toString()}`;

      const data = await authFetch(url);
      setWeeklyData(data);
    };

    fetchWeekly();
  }, [selectedClientId, selectedMonth]);
  useEffect(() => {
    const fetchTotalEssais = async () => {
      try {
        const client = selectedClientId ? `?clientId=${selectedClientId}` : "";

        const data = await authFetch(`/demandes-essai/countTotal${client}`);

        setTotalEssais(data);
      } catch (err) {
        console.error("Erreur fetch total essais :", err);
      }
    };

    fetchTotalEssais();
  }, [selectedClientId]);

  const inventoryCards = [
    {
      icon: Car,
      bgColor: "#E3F2FD",
      title: "Véhicules",
      value: vehiculeCount,
      subtitle: "Nombre de véhicules ",
      color: "#0288D1",
    },
    {
      icon: BarChart3,
      title: "Lois de route",
      bgColor: "#FFF3E0",
      value: loiRouteCount,
      subtitle: "Nombre de lois de route ",
      color: "#FB8C00",
    },
    {
      icon: Settings,
      title: "Calages",
      bgColor: "#E8F5E9",
      value: calageCount,
      subtitle: "Nombre de calages",
      color: "#2E7D32",
    },
    {
      icon: Repeat,
      title: "Cycles conduite",
      bgColor: "#FFEBEE",
      value: cycleCount,
      subtitle: "Nombre de Cycles ",
      color: "#C62828",
    },
    {
      icon: ClipboardCheck,
      title: "Essais",
      bgColor: "#F3E5F5",
      value: totalEssais,
      subtitle: "Nombre des essais",
      color: "#8E24AA",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams();

        if (selectedClientId !== null) {
          params.append("client", selectedClientId);
        }
        if (selectedClientId !== null) {
          params.append("clientId", String(selectedClientId));
        }

        if (selectedTechnicienId !== null) {
          params.append("technicienId", String(selectedTechnicienId));
        }

        if (selectedChargeId !== null) {
          params.append("chargeId", String(selectedChargeId));
        }

        const url =
          params.toString().length > 0
            ? `/demandes-essai/RépartitionEssais?${params.toString()}`
            : `/demandes-essai/RépartitionEssais`;

        const data = await authFetch(url);

        setPieData([
          { name: "Fait", value: data?.fait ?? 0, color: "#2E7D32" },
          { name: "Pas fait", value: data?.pasFait ?? 0, color: "#C62828" },
          { name: "En cours", value: data?.encours ?? 0, color: "#ED6C02" },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [selectedClientId, selectedTechnicienId, selectedChargeId]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);
  useEffect(() => {
    const fetchEvolution12Mois = async () => {
      try {
        const clientParam =
          selectedClientId !== null ? `?clientId=${selectedClientId}` : "";
        console.log(clientParam);

        const data = await authFetch(
          `/demandes-essai/evolution-12-mois${clientParam}`,
        );

        setBarData(data);
      } catch (err) {
        console.error("Erreur evolution 12 mois :", err);
      }
    };

    fetchEvolution12Mois();
  }, [selectedClientId]);

  // ✅ 1. Liste du select — dépend seulement de selectedClientId
  useEffect(() => {
    const fetchChargesList = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClientId !== null)
          params.append("clientId", String(selectedClientId));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await authFetch(
          `/demandes-essai/stats/charge-client${query}`,
        );

        const unique = Array.from(
          new Map(
            (data as any[]).map((c: any) => [
              c.chargeId,
              { value: c.chargeId, label: `${c.nom} ${c.prenom}` },
            ]),
          ).values(),
        ) as { label: string; value: number | null }[];

        setCharges(unique);
      } catch (err) {
        console.error("Erreur fetch charges list:", err);
      }
    };
    fetchChargesList();
  }, [selectedClientId]);

  // ✅ 2. Stats pour le pie — dépend des deux filtres
  useEffect(() => {
    const fetchChargeStats = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClientId !== null)
          params.append("clientId", String(selectedClientId));
        if (selectedChargeId !== null)
          params.append("chargeId", String(selectedChargeId));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await authFetch(
          `/demandes-essai/stats/charge-client${query}`,
        );

        setChargeData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur fetch charge stats:", err);
      }
    };
    fetchChargeStats();
  }, [selectedClientId, selectedChargeId]); // ✅ les deux filtres pour les stats

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authFetch("/users/me");

        setRole(user.role);
        setCurrentUser(user);

        // si charge -> on prend automatiquement son id
        if (user.role === "CHARGE") {
          setSelectedChargeTechId(user.id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await authFetch("/clients");
      setClients(data ?? []);
    } catch (error) {
      console.error("Erreur chargement clients", error);
    }
  };

  // ✅ UN SEUL useEffect — réagit aux deux filtres
  useEffect(() => {
    const fetchTechnicienStats = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClientId !== null)
          params.append("clientId", String(selectedClientId));
        if (selectedTechnicienId !== null)
          params.append("technicienId", String(selectedTechnicienId));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await authFetch(
          `/demandes-essai/stats/technicien-client${query}`,
        );

        setTechnicienData(Array.isArray(data) ? data : []);

        // Reconstruire la liste uniquement quand aucun filtre technicien actif
        // sinon la liste se réduirait à 1 seul technicien
        if (selectedTechnicienId === null) {
          const unique = Array.from(
            new Map(
              (data as any[]).map((t: any) => [
                t.technicienId,
                { value: t.technicienId, label: `${t.nom} ${t.prenom}` },
              ]),
            ).values(),
          ) as { label: string; value: number | null }[];
          setTechniciens(unique);
        }
      } catch (err) {
        console.error("Erreur fetch technicien stats:", err);
      }
    };
    fetchTechnicienStats();
  }, [selectedClientId, selectedTechnicienId]); // ✅ les deux filtres déclenchent le fetch

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-end justify-between">
        {/* Partie gauche : titre + description */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">Vue d'ensemble de l'activité</p>
        </div>

        {/* Partie droite : filtre client */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <select
              value={selectedClientId ?? ""}
              className="bg-card text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => {
                setSelectedClientId(
                  e.target.value ? Number(e.target.value) : null,
                );
                setSelectedTechnicienId(null); // ✅ reset technicien quand client change
              }}
            >
              <option value="">Tous les clients</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Inventory Cards - version Quick Summary style */}
      {/* Inventory Cards - Icône + nombre sur la même ligne */}
      <div className="flex gap-6">
        {inventoryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`inventory-${card.subtitle || index}`}
              className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl p-5 shadow-sm flex flex-col items-start gap-3 flex-1 hover:shadow-md transition-shadow"
            >
              {/* Ligne Icône + Nombre */}
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color: card.color }} />
                </div>
                <div
                  className="text-3xl font-semibold text-foreground
"
                >
                  {card.value}
                </div>
              </div>

              {/* Texte sur la ligne suivante */}
              <div className="w-full">
                <div className="text-muted-foreground">{card.subtitle}</div>
                {card.detail && (
                  <div className="text-sm text-gray-500">{card.detail}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart - 1/3 */}
        <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Répartition des essais</h3>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  key="main-pie"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item, index) => (
              <div
                key={`pie-legend-${index}`}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - 2/3 */}
        <div className="bg-card rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Évolution des essais sur 12 mois
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                key="bar-ok"
                dataKey="Fait"
                stackId="a"
                fill="#2E7D32"
                name="Fait"
              />
              <Bar
                key="bar-nok"
                dataKey="Pas_fait"
                stackId="a"
                fill="#C62828"
                name="Pas fait"
              />
              <Bar
                key="bar-reserve"
                dataKey="En_cours"
                stackId="a"
                fill="#ED6C02"
                name="En cours"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-6">
          {/* ===================== PIE / BAR WEEKLY ===================== */}
          <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Évolution des essais par semaine
              </h3>
            </div>

            {/* SELECTS EN LIGNE */}
            <div className="flex gap-2 mb-6">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-card text-foreground border border-border rounded-lg px-1 py-2 w-1/2"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* GRAPHIQUE */}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="Fait" stackId="a" fill="#2E7D32" />
                <Bar dataKey="Pas_fait" stackId="a" fill="#C62828" />
                <Bar dataKey="En_cours" stackId="a" fill="#ED6C02" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===================== TECHNICIEN ===================== */}
          {canSeeTechValidationCards && (
            <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
              <h3 className="text-xl font-semibold mb-6">
                Validation technicien d'essai
              </h3>

              {isAdmin && (
                <select
                  value={selectedTechnicienId ?? ""}
                  onChange={(e) =>
                    setSelectedTechnicienId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className="bg-card text-foreground border border-border rounded-lg px-3 py-2 mb-6 w-full"
                >
                  {/* OPTION PAR DÉFAUT */}
                  <option value="">Tous les techniciens</option>

                  {/* LISTE TECHNICIENS */}
                  {techniciens.map((tech) => (
                    <option key={tech.value} value={tech.value ?? ""}>
                      {tech.label}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieTeschnicienData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieTeschnicienData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                {pieTeschnicienData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ===================== CHARGE ===================== */}
          {canSeeChargeValidationCards && (
            <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
              <h3 className="text-xl font-semibold mb-6">
                Validation Chargé d'essai
              </h3>
              {isAdmin && (
                <select
                  value={selectedChargeId ?? ""}
                  onChange={(e) =>
                    setSelectedChargeId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className="bg-card text-foreground border border-border rounded-lg px-3 py-2 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Tous les chargés d'essai</option>

                  {charges.map((charge) => (
                    <option key={charge.value} value={charge.value ?? ""}>
                      {charge.label}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChargeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChargeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {pieChargeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Quick Summary */}
    </div>
  );
}

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
import { useTranslation } from "react-i18next";

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
  const [barData, setBarData] = useState<BarDataItem[]>([]);
  const [chargeData, setChargeData] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState<number | "Tous">("Tous");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [charges, setCharges] = useState<
    { label: string; value: number | null }[]
  >([]);
  const { t } = useTranslation();
  interface BarDataItem {
    month: string;
    Fait: number;
    Pas_fait: number;
    En_cours: number;
  }
  const translateMonth = (month: unknown): string => {
    const normalizedMonth = String(month).trim().toLowerCase();

    // Mois renvoyés par le backend :
    // Jan, Fev, Mars, Avr, Mai, Juin, Juil, Août, Sep, Oct, Nov, Déc
    const months: Record<string, number> = {
      jan: 1,
      fev: 2,
      février: 2,
      fevrier: 2,
      mars: 3,
      avr: 4,
      avril: 4,
      mai: 5,
      juin: 6,
      juil: 7,
      juillet: 7,
      août: 8,
      aout: 8,
      sep: 9,
      septembre: 9,
      oct: 10,
      octobre: 10,
      nov: 11,
      novembre: 11,
      déc: 12,
      dec: 12,
      décembre: 12,
      decembre: 12,

      // Au cas où le backend renvoie les noms anglais
      january: 1,
      february: 2,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };

    const monthNumber = months[normalizedMonth];

    if (monthNumber) {
      return t(`dashboard.months.${monthNumber}`);
    }

    return String(month);
  };

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
    { value: 1, label: t("dashboard.months.1") },
    { value: 2, label: t("dashboard.months.2") },
    { value: 3, label: t("dashboard.months.3") },
    { value: 4, label: t("dashboard.months.4") },
    { value: 5, label: t("dashboard.months.5") },
    { value: 6, label: t("dashboard.months.6") },
    { value: 7, label: t("dashboard.months.7") },
    { value: 8, label: t("dashboard.months.8") },
    { value: 9, label: t("dashboard.months.9") },
    { value: 10, label: t("dashboard.months.10") },
    { value: 11, label: t("dashboard.months.11") },
    { value: 12, label: t("dashboard.months.12") },
  ];

  const [weeklyData, setWeeklyData] = useState([]);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg p-3 shadow-lg">
      {label && (
        <p className="font-semibold text-foreground mb-1">
          {label}
        </p>
      )}
        {payload.map((item: any) => (
          <p key={item.dataKey}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  };
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
    {
      name: t("dashboard.status.ok"),
      value: technicienAggregated.ok,
      color: "#2E7D32",
    },
    {
      name: t("dashboard.status.nok"),
      value: technicienAggregated.nok,
      color: "#C62828",
    },
    {
      name: t("dashboard.status.underReserve"),
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
      name: t("dashboard.status.ok"),
      value: chargeAggregated.ok,
      color: "#2E7D32",
    },
    {
      name: t("dashboard.status.nok"),
      value: chargeAggregated.nok,
      color: "#C62828",
    },
    {
      name: t("dashboard.status.underReserve"),
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
const getMonthNumber = (month: unknown): number | null => {
  const normalized = String(month).trim().toLowerCase();

  const monthMap: Record<string, number> = {
    jan: 1,
    janvier: 1,
    january: 1,

    fev: 2,
    fév: 2,
    février: 2,
    fevrier: 2,
    feb: 2,
    february: 2,

    mars: 3,
    mar: 3,
    march: 3,

    avr: 4,
    avril: 4,
    apr: 4,
    april: 4,

    mai: 5,
    may: 5,

    juin: 6,
    jun: 6,
    june: 6,

    juil: 7,
    juillet: 7,
    jul: 7,
    july: 7,

    août: 8,
    aout: 8,
    aug: 8,
    august: 8,

    sep: 9,
    septembre: 9,
    sept: 9,
    september: 9,

    oct: 10,
    octobre: 10,
    october: 10,

    nov: 11,
    novembre: 11,
    november: 11,

    déc: 12,
    dec: 12,
    décembre: 12,
    decembre: 12,
    december: 12,
  };

  return monthMap[normalized] ?? null;
};

const shortMonth = (month: unknown): string => {
  const monthNumber = getMonthNumber(month);

  if (!monthNumber) {
    return String(month);
  }

  return t(`dashboard.monthsShort.${monthNumber}`);
};  const inventoryCards = [
    {
      icon: Car,
      bgColor: "#E3F2FD",
      title: t("dashboard.cards.vehicles"),
      value: vehiculeCount,
      subtitle: t("dashboard.cards.vehiclesCount"),
      color: "#0288D1",
    },
    {
      icon: BarChart3,
      title: t("dashboard.cards.roadLaws"),
      bgColor: "#FFF3E0",
      value: loiRouteCount,
      subtitle: t("dashboard.cards.roadLawsCount"),
      color: "#FB8C00",
    },
    {
      icon: Settings,
      title: t("dashboard.cards.calibrations"),
      bgColor: "#E8F5E9",
      value: calageCount,
      subtitle: t("dashboard.cards.calibrationsCount"),
      color: "#2E7D32",
    },
    {
      icon: Repeat,
      title: t("dashboard.cards.drivingCycles"),
      bgColor: "#FFEBEE",
      value: cycleCount,
      subtitle: t("dashboard.cards.drivingCyclesCount"),
      color: "#C62828",
    },
    {
      icon: ClipboardCheck,
      title: t("dashboard.cards.tests"),
      bgColor: "#F3E5F5",
      value: totalEssais,
      subtitle: t("dashboard.cards.testsCount"),
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
          {
            name: t("dashboard.status.done"),
            value: data?.fait ?? 0,
            color: "#2E7D32",
          },
          {
            name: t("dashboard.status.notDone"),
            value: data?.pasFait ?? 0,
            color: "#C62828",
          },
          {
            name: t("dashboard.status.inProgress"),
            value: data?.encours ?? 0,
            color: "#ED6C02",
          },
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
        const params = new URLSearchParams();

        if (selectedClientId !== null) {
          params.append("clientId", String(selectedClientId));
        }

        const query = params.toString() ? `?${params.toString()}` : "";

        const data = await authFetch(
          `/demandes-essai/evolution-12-mois${query}`,
        );

        console.log("Evolution 12 mois backend :", data);

        const backendData = Array.isArray(data) ? data : [];

        // Tous les 12 mois doivent toujours être affichés
        const completeData: BarDataItem[] = months.map((month) => {
          const backendMonth = backendData.find((item: any) => {
            const normalized = String(item.month).trim().toLowerCase();

            const monthMap: Record<string, number> = {
              jan: 1,
              janvier: 1,
              january: 1,

              fev: 2,
              février: 2,
              fevrier: 2,
              february: 2,

              mars: 3,
              march: 3,

              avr: 4,
              avril: 4,
              april: 4,

              mai: 5,
              may: 5,

              juin: 6,
              june: 6,

              juil: 7,
              juillet: 7,
              july: 7,

              août: 8,
              aout: 8,
              august: 8,

              sep: 9,
              septembre: 9,
              september: 9,

              oct: 10,
              octobre: 10,
              october: 10,

              nov: 11,
              novembre: 11,
              november: 11,

              déc: 12,
              dec: 12,
              décembre: 12,
              decembre: 12,
              december: 12,
            };

            return monthMap[normalized] === month.value;
          });

          return {
  month: shortMonth(String(backendMonth?.month ?? month.label)),
            Fait: backendMonth?.Fait ?? 0,
            Pas_fait: backendMonth?.Pas_fait ?? 0,
            En_cours: backendMonth?.En_cours ?? 0,
          };
        });

        console.log("Evolution 12 mois complète :", completeData);

        setBarData(completeData);
      } catch (err) {
        console.error("Erreur evolution 12 mois :", err);
        setBarData([]);
      }
    };

    fetchEvolution12Mois();
  }, [selectedClientId, t]);
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
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground"> {t("dashboard.subtitle")}</p>
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
                setSelectedTechnicienId(null); 
              }}
            >
              <option value=""> {t("dashboard.allClients")}</option>

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
                  <div className="text-sm text-muted-foreground">{card.detail}</div>
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
            <h3 className="text-xl font-semibold">
              {" "}
              {t("dashboard.charts.testDistribution")}
            </h3>
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
                <Tooltip content={<CustomTooltip />} />
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
        <div className="bg-card rounded-xl p-6 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {t("dashboard.charts.testsEvolution12Months")}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                interval={0}
                textAnchor="end"
                height={70}
                tickMargin={10}
                tick={{ fill: "currentColor" }}
              />{" "}
              <YAxis tick={{ fill: "currentColor" }} />
              <Tooltip content={<CustomTooltip />} /> <Legend />
              <Bar
                key="bar-ok"
                dataKey="Fait"
                stackId="a"
                fill="#2E7D32"
                name={t("dashboard.status.done")}
              />
              <Bar
                key="bar-nok"
                dataKey="Pas_fait"
                stackId="a"
                fill="#C62828"
                name={t("dashboard.status.notDone")}
              />
              <Bar
                key="bar-reserve"
                dataKey="En_cours"
                stackId="a"
                fill="#ED6C02"
                name={t("dashboard.status.inProgress")}
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
                {t("dashboard.charts.testsEvolutionByWeek")}
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
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar
                  dataKey="Fait"
                  stackId="a"
                  fill="#2E7D32"
                  name={t("dashboard.status.done")}
                />

                <Bar
                  dataKey="Pas_fait"
                  stackId="a"
                  fill="#C62828"
                  name={t("dashboard.status.notDone")}
                />

                <Bar
                  dataKey="En_cours"
                  stackId="a"
                  fill="#ED6C02"
                  name={t("dashboard.status.inProgress")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===================== TECHNICIEN ===================== */}
          {canSeeTechValidationCards && (
            <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
              <h3 className="text-xl font-semibold mb-6">
                {t("dashboard.charts.technicianValidation")}
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
                  <option value="">
                    {" "}
                    {t("dashboard.filters.allTechnicians")}
                  </option>

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
                    <Tooltip content={<CustomTooltip />} />
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
                {t("dashboard.charts.testManagerValidation")}
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
                  <option value="">
                    {t("dashboard.filters.allTestManagers")}
                  </option>

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
                    <Tooltip content={<CustomTooltip />} />
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

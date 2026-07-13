import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";
import { authFetch } from "../api";

/* ================= TYPES ================= */
interface DemandeEssai {
  // =====================
  // IDENTITÉ
  // =====================
  id?: number;
  nomAuto?: string;
  numeroProjet?: number;

  statutGlobal?: "EN_COURS" | "FAIT";
  statutDemande?: "EN_CREATION" | "VALIDEE";

  // =====================
  // RELATIONS (BACKEND)
  // =====================
  vehicule?: { id: number; identificateur: number };
  cycle?: { id: number };
  calage?: { id: number };
  client?: { id: number; nom: string };

  // =====================
  // PROJET
  // =====================
  typeProjet?: string;

  demandeur?: string;
  technicien?: string;

  banc?: string;
  datePlanification?: string;
  shift?: "MATIN" | "SOIR" | "NUIT";

  // =====================
  // CONDITIONS ESSAI
  // =====================
  besoinMaceration?: boolean;
  temperatureMaceration?: number;
  temperatureEau?: number;
  hygrometrieEssai?: number;
  activationSTT?: boolean;
  temperatureEssai?: number;

  // =====================
  // BATTERIE / CLIM
  // =====================
  gestionBatterie12V?: string;
  socDepart12V?: number;

  activationClim?: boolean;
  temperatureRegulationClim?: number;
  chauffageHabitable?: boolean;

  // =====================
  // TYPE ESSAI
  // =====================
  typeEssai?: string;
  verificationCoastDown?: boolean;
  nombreDecelerations?: number;
  commentaire?: string;

  // =====================
  // SAC / DÉBITS
  // =====================
  mesureSAC?: boolean;
  debitCVsPhase1?: number;
  debitCVsPhase2?: number;
  debitCVsPhase3?: number;
  debitCVsPhase4?: number;
  debitCVsPhase5?: number;
  debitCVsPhase6?: number;
  debitCVsPhase7?: number;
  debitCVsPhase8?: number;
  debitCVsPhase9?: number;
  debitCVsPhase10?: number;

  // =====================
  // PM / PN
  // =====================
  pm?: boolean;
  debitPrelevement?: number;

  pn10Nano?: boolean;
  facteurDilutionPN10?: number;

  pn23Nano?: boolean;
  facteurDilutionPN23?: number;

  // =====================
  // GAZ BRUTS
  // =====================
  ligne1?: boolean;
  pointPrelevementL1?: string;

  ligne2?: boolean;
  pointPrelevementL2?: string;

  ligne3?: boolean;
  pointPrelevementL3?: string;

  microsot?: boolean;
  pointPrelevementMicrosot?: string;

  qcl1?: boolean;
  pointPrelevementQCL1?: string;

  qcl2?: boolean;
  pointPrelevementQCL2?: string;

  FITR?: boolean;
  pointPrelevementFITR?: string;

  egr?: boolean;

  // =====================
  // XCU
  // =====================
  xcu1?: boolean;
  software1?: string;
  calibration1?: string;
  experiment1?: string;

  xcu2?: boolean;
  software2?: string;
  calibration2?: string;

  xcu3?: boolean;
  software3?: string;
  calibration3?: string;

  acquisitionEOBD?: boolean;
  typeAcquisition?: string;

  // =====================
  // MESURE COURANT
  // =====================
  mesureCourant?: boolean;
  indiceCourant?: number;
  numeroTermocoupleCourant?: number;
  typeMesureCourant?: number;

  // =====================
  // CONFIG BANC
  // =====================
  capot?: "OUVERT" | "FERME";
  soufflante?: string;
  qCvs?: number;
  carflow?: boolean;

  // =====================
  // MESURE TENSION
  // =====================
  mesureTension?: boolean;
  indiceTension?: number;
  numeroTermocoupleTension?: number;
  typeMesureTension?: string;

  // =====================
  // THERMOCOUPLES
  // =====================
  thermocouples?: boolean;
  indicethermocouples?: number;
  numeroTermocouple?: number;
  typeMesurethermocouples?: string;

  // =====================
  // SONDE LAMBDA
  // =====================
  sondeLambdaLA4?: boolean;
  indicesondeLambdaLA4?: number;
  numerosondeLambdaLA4?: number;
  typeMesuresondeLambdaLA4?: string;
}

type Slot = {
  time: string;
  numeroProjet: string;
  date: string;
  NomDemande: string;
  technicienId?: number | null;
  shift?: "MATIN" | "SOIR" | "NUIT" | "APRES_MIDI";
};

type DayPlanning = { day: string; slots: Slot[] };
type Technicien = { id: number; nom: string; prenom: string };

/* ================= UTILS ================= */
function getWeekDateRange(offsetWeeks = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetWeeks * 7);
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  return { monday: fmt(monday), sunday: fmt(sunday) };
}

function getWeekDays(offsetWeeks = 0) {
  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay();
  monday.setDate(
    monday.getDate() + ((day === 0 ? -6 : 1) - day) + offsetWeeks * 7,
  );
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      dayName: d.toLocaleDateString("fr-FR", { weekday: "long" }),
      date: d.toISOString().split("T")[0],
      label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    };
  });
}

function getSlotColor(shift?: string) {
  switch (shift) {
    case "MATIN":
      return "bg-green-100 border-green-300 dark:bg-green-900/40 dark:border-green-700";
    case "SOIR":
      return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/40 dark:border-yellow-700";
    case "NUIT":
      return "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-700";
    case "APRES_MIDI":
      return "bg-orange-100 border-orange-300 dark:bg-orange-900/40 dark:border-orange-700";
    default:
      return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600";
  }
}

/* ================= SUB-COMPONENTS (outside Planning) ================= */
function CalendarView({
  planning,
  technicienMap,
}: {
  planning: DayPlanning[];
  technicienMap: Map<number, string>;
}) {
  return (
    <div className="grid grid-cols-7 gap-2 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {planning.map((day) => (
        <div
          key={day.day}
          className="flex flex-col bg-card border-r border-border last:border-r-0 min-h-[260px]"
        >
          <div className="sticky top-0 z-10 bg-[#B9032C] text-white text-center py-3 font-semibold text-sm tracking-wide shadow-sm">
            {day.day}
          </div>
          <div className="p-2 space-y-2 overflow-y-auto">
            {day.slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground text-xs">
                <span>Aucun essai</span>
              </div>
            ) : (
              day.slots.map((slot, i) => (
                <div
                  key={i}
                  className={`rounded-lg border border-border p-2 shadow-sm bg-card hover:shadow-md transition-all ${getSlotColor(slot.shift)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/70">
                      {slot.shift}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground line-clamp-4 break-words">
                    {slot.NomDemande}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Projet : {slot.numeroProjet}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                    👤{" "}
                    {slot.technicienId != null
                      ? (technicienMap.get(Number(slot.technicienId)) ??
                        "Non assigné")
                      : "Non assigné"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({
  planning,
  technicienMap,
}: {
  planning: DayPlanning[];
  technicienMap: Map<number, string>;
}) {
  return (
    <div className="space-y-4">
      {planning.map((day) => (
        <div
          key={day.day}
          className="bg-card border border-border p-3 rounded-xl shadow-sm"
        >
          <h2 className="font-bold mb-2 text-foreground">{day.day}</h2>
          {day.slots.map((slot, i) => (
            <div
              key={i}
              className={`p-2 mb-2 rounded border border-border bg-background text-foreground ${getSlotColor(slot.shift)}`}
            >
              <span className="text-xs font-semibold text-foreground/90">
                {slot.time}
              </span>
              {" - "}
              <span className="text-sm font-medium text-foreground">
                {slot.NomDemande}
              </span>
              {" - "}
              <span className="text-xs text-muted-foreground">
                {slot.technicienId != null
                  ? (technicienMap.get(Number(slot.technicienId)) ??
                    "Non assigné")
                  : "Non assigné"}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export function Planning() {
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [techniciens, setTechniciens] = useState<Technicien[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [numeroProjetFilter, setNumeroProjetFilter] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedTechnicienId, setSelectedTechnicienId] = useState<number | "">(
    "",
  );

  const { monday } = getWeekDateRange(weekOffset);
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  /* ── Fetch demandes ── */
  useEffect(() => {
    authFetch("/demandes-essai")
      .then((data) => setDemandes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ── Fetch techniciens ── */
  useEffect(() => {
    authFetch("/users/techniciens")
      .then((data) => setTechniciens(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ── Map id → "Nom Prenom" ── */
  const technicienMap = useMemo(
    () =>
      new Map(
        techniciens.map((t) => [
          Number(t.id),
          `${t.nom ?? ""} ${t.prenom ?? ""}`.trim(),
        ]),
      ),
    [techniciens],
  );
  const fetchDemandes = async () => {
    try {
      setLoading(true);

      const res = await authFetch("/demandes-essai");

      const data = res?.data ?? res?.content ?? res?._embedded?.demandes ?? res;

      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);
  /* ── Transform ── */
  const planningData: DayPlanning[] = useMemo(
    () =>
      weekDays.map((day) => ({
        day: `${day.dayName} ${day.label}`,
        slots: demandes
          .filter((dem) => dem.datePlanification?.startsWith(day.date))
          .map((dem) => ({
            time: dem.shift ?? "MATIN",
            numeroProjet: dem.numeroProjet?.toString() ?? "",
            date: dem.datePlanification,
            NomDemande: dem.nomAuto ?? "",
            technicienId:
              dem.technicienId != null ? Number(dem.technicienId) : null,
            shift: dem.shift,
          })),
      })),
    [demandes, weekDays],
  );

  /* ── Filter ── */
  const filteredPlanning = planningData.map((day) => ({
    ...day,
    slots: day.slots.filter((slot) => {
      if (selectedTechnicienId && slot.technicienId !== selectedTechnicienId)
        return false;
      if (
        numeroProjetFilter &&
        !slot.numeroProjet
          ?.toLowerCase()
          .includes(numeroProjetFilter.toLowerCase())
      )
        return false;
      if (filterDate && slot.date !== filterDate) return false;
      return true;
    }),
  }));

  /* ── Render ── */
  return (
    <div className="space-y-6 p-3">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Planning hebdomadaire
        </h1>
        <p className="text-muted-foreground">
          Visualisation des essais planifiés
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-background px-6 py-2 rounded-lg border border-border">
            <Calendar className="w-6 h-8 text-muted-foreground" />
            <span className="text-sm font-medium">Semaine du {monday}</span>
          </div>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setWeekOffset(0)}
          className="h-12 px-10 bg-[#B9032C] text-white rounded-lg hover:bg-[#B9032C]/90 transition text-sm"
        >
          Aujourd'hui
        </button>

<div className="flex flex-1 flex-wrap gap-3 items-center">          <input
            type="text"
            placeholder="Projet"
            value={numeroProjetFilter}
            onChange={(e) => setNumeroProjetFilter(e.target.value)}
            className="h-12 px-6 bg-background text-foreground border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus-within:ring-ring transition w-full sm:w-[160px]"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="h-12 px-6 bg-background text-foreground border border-border rounded-lg text-sm focus:outline-none w-full sm:w-[160px] transition"
          />
          <select
            value={selectedTechnicienId}
            onChange={(e) =>
              setSelectedTechnicienId(
                e.target.value ? Number(e.target.value) : "",
              )
            }
            className="h-12 px-6 bg-background text-foreground border border-border rounded-lg text-sm"
          >
            <option value="">Tous techniciens</option>
            {techniciens.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nom} {t.prenom}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              setViewMode(viewMode === "calendar" ? "list" : "calendar")
            }
            className="h-12 px-10 bg-background text-foreground border border-border rounded-lg flex items-center gap-2 hover:bg-muted transition"
          >
            <List className="w-4 h-4" />
            <span className="text-sm capitalize">{viewMode}</span>
          </button>
        </div>
      </div>

      {/* ✅ technicienMap passé en prop */}
      {viewMode === "calendar" ? (
        <CalendarView
          planning={filteredPlanning}
          technicienMap={technicienMap}
        />
      ) : (
        <ListView planning={filteredPlanning} technicienMap={technicienMap} />
      )}
    </div>
  );
}

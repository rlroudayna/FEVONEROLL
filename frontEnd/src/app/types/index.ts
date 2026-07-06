export interface Vehicule {
  id: number;
  nom: string;
  immatriculation: string;
  motorisation: "ICE" | "HEV" | "BEV" | "PHEV";
  transmission: "4x2" | "4x4";
  responsable: string;
  localisation: string;
}

export interface LoiDeRoute {
  id: number;
  nom: string;
  mode: string;
  inertie: number;
  masse: number;
  f0: number;
  f1: number;
  f2: number;
  dateCreation: string;
}

export interface Calage {
  id: number;
  nom: string;
  vehicule: string;
  loi: string;
  mode: string;
  a: number;
  b: number;
  c: number;
}

export interface Cycle {
  id: number;
  nom: string;
  famille: "WLTC" | "NEDC" | "RDE" | "ARTEMIS" | "Personnalisé";
  duree: string;
  phases: number;
  stabilises: number;
  trace: string;
}

export interface Demande {
  id: number;
  nom: string;
  projet: "COP" | "ISC" | "Autre";
  demandeur: string;
  statut: "Validé" | "Brouillon";
  datePlanification: string;
  shift: "Matin" | "Après-midi" | "Nuit";
  validation: "Fait" | "En cours" | "Pas fait";
}

export interface ValidationEssai {
  id: number;
  date: string;
  vehicule: string;
  cycle: string;
  conducteur: string;
  validationConducteur: "Fait" | "En cours" | "Pas fait";
  validationCharge: "Fait" | "En cours" | "Pas fait";
  statutGlobal: "Fait" | "En cours" | "Pas fait";
}

DESIGN GLOBAL (TOUTES LES PAGES)
Style : moderne, épuré, professionnel
Navigation latérale gauche : icônes + textes
Dashboard 🏠
Véhicules 🚗
Lois de route 📊
Calages ⚙️
Cycles 🔄
Demandes 📝
Validation ✅
📈 Reporting                                                                                                                     
Cards : coins arrondis 12px, ombres légères 0 4px 12px rgba(0,0,0,0.05)
Palette couleurs :
Principal : Bleu foncé #0A2647
Fond : Gris clair #F5F5F5
Blanc : #FFFFFF (cards)
Accent : Bleu #0288D1 (boutons, liens)
Vert #2E7D32 (succès)
Rouge #C62828 (erreur)
Orange #ED6C02 (avertissement)
Typographie : Inter (400, 500, 600)
Icônes : Material Design
Espacements : 24px entre sections, 16px padding cartes
Grille : 12 colonnes, marges 24px
 
### PAGE 0 : ACCUEIL
- Titre : "Bienvenue sur SmartTest"
- Sous-titre : "Gestion complète de vos bancs d'essai"
- Boutons : "Se connecter" (primaire), "Créer un compte" (secondaire)
- Illustration/visuel : style moderne, flat design
### PAGE 1 : CONNEXION
- Champs : Email* [texte], Mot de passe* [password]
- Actions : "Se connecter" (primaire), "Mot de passe oublié ?" (link), "Créer un compte" (secondary)
- Validation : champs requis avec astérisque rouge
### PAGE 2 : CREATION DE COMPTE
- Champs : Prénom*, Nom*, Email*, Mot de passe*, Confirmation mot de passe*
- Boutons : "Créer un compte" (primaire), "Annuler" (secondaire)
- Validation : messages d’erreur pour email invalide ou mot de passe non conforme
PAGE 1 : DASHBOARD
1. Inventaire (4 cartes)
Véhicules 🚗
Valeur : 24 (SemiBold 48px)
Sous-titre : "Nombre de véhicules " (Medium 16px, gris)
Petit texte : "4x2: 14 / 4x4: 10" (14px)
Lois de route 📊
Valeur : 18
Sous-titre : "Lois paramétrées"
Petit texte : " 3 nouvelles ce mois"
Calages ⚙️
Valeur : 32
Sous-titre : "nobre de Configurations calage"
Petit texte : "12 associées à des véhicules"
Cycles conduite 🔄
Valeur : 15
Sous-titre : "Cycles disponibles"
5 Essais du mois en cours
Mois : Mars 2026
Valeur : 28
Sous-titre : "Essais réalisés"
 
2. Statistiques mensuelles (2 cartes)
Répartition par statut (camembert)
65% vert ✅ OK - 18 essais
15% rouge ❌ NOK - 4 essais
20% orange ⚠️ OK sous réserve - 6 essais
3. Évolution temporelle
Graphique barre 12 mois (JUIN → DECEMBRE)
Barres empilées vert/rouge/orange
5. Récapitulatif rapide (3 mini-cartes)
Essais aujourd'hui : 3
Essais à valider : 5
Prochain essai : Aujourd'hui 14h - Megane
PAGE 2 : GESTION DES VÉHICULES (/vehicules)
Barre d’actions
Recherche 🔍 "Rechercher par nom, immatriculation, VIN..."
Filtres chips : Tous / Thermique / Hybride / Électrique / 4x2 / 4x4
Bouton "+ Ajouter un véhicule" (bleu)
Tableau véhicules
Colonnes : Nom, Immatriculation, Motorisation, Transmission, Responsable, Localisation, Actions (👁️, ✏️, 📋, 🗑️)
Formulaire modal : Nouveau véhicule
Identification : Nom, Immatriculation, VIN, Site, Responsable, Localisation
Motorisation/Transmission : Type, Moteur, Boîte, Carburant, Mode conduite
Caractéristiques : Couleur, Famille, Puissance, Densité
Dimensions : Pneus, Pression, Empattement, Type catalyseur
Boutons : Annuler / Valider

PAGE 3 : LOIS DE ROUTE (/lois-de-route)
Barre d’actions
Recherche 🔍, filtres chips (Toutes, 4x4, Avant, Arrière, Sync), "+ Ajouter loi de route"
Tableau lois de route
Colonnes : Nom, Mode banc, Inertie, Masse d'essai, F0/F1/F2, Date création, Actions
Formulaire loi de route
Identification : Nom*, Description
Configuration banc : Mode*
Paramètres inertie : Inertie*, Masse*, Inertie Rotative Train Non Roulant, Deux Trains
Coefficients : F0*, F1*, F2*
PAGE 4 : CALAGES (/calages)
Barre actions : recherche, filtres, "+ Ajouter calage"
Tableau : Nom, Véhicule, Loi, Mode, Coefficients, Statut, Actions(viualiser supprimer modifier )
Formulaire calage : Identification, Associations, Coefficients provisoires, Résultats (masqué par défaut)
PAGE 5 : CYCLES DE CONDUITE (/cycles)
Barre actions : recherche, filtres, "+ Ajouter cycle"
TABLEAU : nom, famille, durée, phases, stabilité , trace(ficher excel ) , actions
Formulaire cycle : Identification, Caractéristiques, Import fichier trace,
PAGE 6 : DEMANDES D'ESSAI (/demandes)
## PAGE 6 : DEMANDES D'ESSAI (/demandes)
TITRE : "Demandes d'essai"
avec sous-titre "Gérer les demandes d'utilisation du banc"
BARRE D'ACTIONS : - Recherche 🔍 - Filtres dropdown : Statut (Tous/Validé/Brouillon), Projet (COP/ISC), Demandeur - Bouton "+ Nouvelle demande"
TABLEAU DES DEMANDES :
Colonnes : - Nom (format Projet_Demandeur_Véhicule_Cycle_numéro) - Projet - Demandeur - Statut (badge 🔵 Validé / ⚪ Brouillon) - Date planification - Shift (Matin/Après-midi/Nuit) - Validation (badge ✅ Fait / 🟡 En cours / ⭕ Pas fait) - Actions (👁️ tout le monde, ✏️📋🗑️ seulement pour demandeur)
## FORMULAIRE DEMANDE –
ÉTAPE 1/2 Titre : "Nouvelle demande d'essai –
Étape 1/2 : Informations générales"
SECTION 1 - INFORMATIONS DE BASE (2 colonnes) : - Véhicule* [dropdown] - Cycle de conduite* [dropdown] - Calage* [dropdown filtré selon véhicule] - Type projet* [dropdown : COP, ISC, Autre] - Demandeur* [dropdown] - Conducteur* [dropdown] SECTION 2 - INFOS GÉNÉRÉES (lecture seule, fond gris clair) : - Nom demande [format Projet_Demandeur_Véhicule_Cycle_numéro] - Motorisation [affichage automatique] - Carburant [dropdown : E10, E3, BPVR] - Banc [affichage "Banc n°1"] SECTION 3 - OPTIONS DE MESURE (grille 4x2) : Ligne 1 : ☐ INCA | ☐ Mesures auxiliaires | ☐ Gaz brutes | ☐ Gaz dilués Ligne 2 : ☐ BAG
| ☐ PM | ☐ PN23 | ☐ PN10 Ligne 3 : Capot [◉ Ouvert] [○ Fermé] | Soufflante [dropdown] | Q_CVS [nombre] | Carflow ☐ SECTION 4 - CONDITIONS D'ESSAI (grille 3 colonnes) : - Date essai* [calendrier] - Shift* [dropdown] - Besoin macération [toggle] + température si oui - Température eau [champ] - Activation STT [toggle] - Température essai [champ] - Hygrométrie [champ] - Gestion batterie 12V [dropdown] - SOC départ 12V [champ] - Activation Clim [toggle] + température régulation - Chauffage habitacle [toggle] - Type essai [dropdown] - Vérification Coast Down [toggle] + nb décélérations - Commentaire conducteur [textarea] Bouton "Suivant" ## FORMULAIRE DEMANDE - ÉTAPE 2/2 (5 onglets) Titre : "Étape 2/2 : Configuration détaillée" ONGLET 1 : Véhicule/Calage - Infos véhicule (lecture seule) - Trace cycle : 📎 Importer Excel ONGLET 2 : Gaz dilués (conditionnel) - ☐ SAC → Débits CVs phase 1,2,3,10 - ☐ PM → Débit prélèvement - ☐ PN10 → Facteur dilution - ☐ PN23 → Facteur dilution ONGLET 3 : Gaz brutes - ☐ Ligne 1 + Point prélèvement - ☐ Ligne 2 + Point prélèvement - ☐ Ligne 3 + Point prélèvement - ☐ QCL_1, QCL_2, PN_1, PN_2, EGR, Microsot ONGLET 4 : Données INCA - ☐ XCU1 → Software .a2l/.srh, Calibration .hex/.s19/.ulp, Experiment .exp - ☐ XCU2 → Software, Calibration - ☐ XCU3 → Software, Calibration - ☐ Acquisition EOBD → Type acquisition ONGLET 5 : Mesures auxiliaires - Toggles : Courant, Tension, Thermocouples, Sonde Lambda - Tableau dynamique avec ajout de lignes Boutons : "Précédent" | "Enregistrer brouillon" | "Créer la demande"
PAGE 7 : VALIDATION (/validation)
«3 Carte indicateurs : nbre de Fait /nbre de  En cours / nombre Pas fait
Cartes interlocuteurs : Conducteur / Chargé d’essai
Tableau récapitulatif : Date, Véhicule, Cycle, Conducteur, Validation Conducteur, Validation Chargé, Statut, Actions
PAGE 8 : VALIDATION CONDUCTEUR
Tableau : Essai, Date, Véhicule, Cycle, Conducteur, etat de validationd de conconductuer  (OK, NOK, OK sous réserve)
Commentaire : textarea 120px
Boutons : Annuler / Enregistrer brouillon / Valider
PAGE 9 : VALIDATION CHARGÉ D'ESSAI
tableau : Essai, Date, Véhicule, Cycle, Chargé d’essai , , statut de validation de chargé d’essai  , Section import fichiers : 3 drag & drop (INCA, BàR, Checklist) ,
Aperçu checklist : tableau critères OK/NOK
 
OETB : checkbox
Boutons : Annuler / Enregistrer brouillon / Valider essai
ÉLÉMENTS COMMUNS
Navigation latérale : largeur 240px, fond #0A2647
En-tête : titre, avatar, notifications 🔔
États chargement : skeleton, spinner
Messages succès/erreur : toast
Responsive : grille adaptable, tableaux scrollables, menu latéral repliable
 
 
 
 
 
 
 
 
 
 
 
 
 
 
```
CRÉER UNE APPLICATION WEB DE GESTION DE BANC D'ESSAI DYNAMOMÉTRIQUE - DESIGN FIGMA COMPLET
 
## INFORMATIONS GÉNÉRALES
- Nom du projet : Taurus V2
- Plateforme : Application web responsive
- Style : Moderne, épuré, professionnel
- Typographie : Inter (Regular 400, Medium 500, SemiBold 600)
- Grille : 12 colonnes, marges 24px, gouttières 16px
 
## PALETTE DE COULEURS
- Primaire (navigation) : #0A2647 (bleu foncé)
- Fond général : #F5F5F5 (gris clair)
- Cartes : #FFFFFF (blanc)
- Accent principal : #0288D1 (bleu)
- Vert succès : #2E7D32 (pour OK, validé)
- Rouge erreur : #C62828 (pour NOK, non valide)
- Orange avertissement : #ED6C02 (pour sous réserve, provisoire)
- Bordures et séparateurs : #E0E0E0
 
## COMPOSANTS COMMUNS À TOUTES LES PAGES
 
### Navigation Latérale (240px)
- Fond : #0A2647
- Logo en haut : "DYNOBENCH" (blanc, SemiBold 20px)
- Menu items (16px, blanc, padding 16px 24px) :
 - 🏠 Dashboard
 - 🚗 Véhicules
 - 📊 Lois de route
 - ⚙️ Calages
 - 🔄 Cycles
 - 📝 Demandes
 - 📅 Planning
 - ✅ Validation
 - 📈 Reporting   
                                                                                                           Item actif : fond rgba(255,255,255,0.1), bordure gauche 4px #0288D1
 
### En-tête (barre supérieure)
- Hauteur : 72px
- Fond : blanc
- Titre de page à gauche (SemiBold 24px)
- Avatar utilisateur à droite avec icône 🔔 notifications
 
### Cards standards
- Coins arrondis : 12px
- Ombres : 0 4px 12px rgba(0,0,0,0.05)
- Padding interne : 24px
 
### Boutons
- Primaire : fond #0288D1, texte blanc, padding 12px 24px, coins 8px
- Secondaire : fond blanc, bordure 1px #E0E0E0, texte #333, padding 12px 24px
- Tertiaire : fond transparent, texte #0288D1
- États : hover, focus, disabled
 
### Badges
- Validé/Bleu : fond #E3F2FD, texte #0288D1, coins 20px
- Brouillon/Gris : fond #F5F5F5, texte #757575
- OK/Vert : fond #E8F5E9, texte #2E7D32
- NOK/Rouge : fond #FFEBEE, texte #C62828
- Sous réserve/Orange : fond #FFF3E0, texte #ED6C02
- En cours/Jaune : fond #FFF9C4, texte #FBC02D
 
### Tableaux
- En-tête : fond #F9F9F9, texte Medium 14px
- Lignes : alternance blanc/#FCFCFC
- Padding cellules : 16px 12px
- Actions : icônes (👁️ ✏️📋🗑️) avec espacement
 
### Formulaires
- Labels au-dessus des champs (Medium 14px)
- Champs : hauteur 44px, bordure 1px #E0E0E0, coins 8px
- État focus : bordure #0288D1
- Champs obligatoires : astérisque rouge
- Espacement entre sections : 32px
- Titres de section : Medium 18px, marge basse 16px
 
### Icônes
- Material Design Icons
- Taille standard : 20px
- Taille grandes icônes : 32px
 
---
### PAGE 0 : ACCUEIL
- Titre : "Bienvenue sur TAURUS V2"
- Sous-titre : "Gestion complète de vos bancs d'essai"
- Boutons : "Se connecter" (primaire), "Créer un compte" (secondaire)
- Illustration/visuel : style moderne, flat design
### PAGE 1 : CONNEXION
- Champs : Email* [texte], Mot de passe* [password]
- Actions : "Se connecter" (primaire), "Mot de passe oublié ?" (link), "Créer un compte" (secondary)
- Validation : champs requis avec astérisque rouge
### PAGE 2 : CREATION DE COMPTE
- Champs : Prénom*, Nom*, Email*, Mot de passe*, Confirmation mot de passe*
- Boutons : "Créer un compte" (primaire), "Annuler" (secondaire)
- Validation : messages d’erreur pour email invalide ou mot de passe non conforme
## PAGE 1 : DASHBOARD
 
### Structure en 4 lignes
 
#### LIGNE 1 - Inventaire (5 cartes)
Disposition : 5 colonnes égales
 
**Carte 1 - Véhicules**
- Icône : 🚗 (32px, #0288D1)
- Grande valeur : "24" (SemiBold 48px)
- Sous-titre : "Véhicules en base" (Regular 16px, #757575)
- Petit texte : "4x2: 14 / 4x4: 10" (Regular 14px)
 
**Carte 2 - Lois de route**
- Icône : 📊 (32px, #0288D1)
- Grande valeur : "18"
- Sous-titre : "Lois paramétrées"
- Petit texte : "Dont 3 nouvelles ce mois"
 
**Carte 3 - Calages**
- Icône : ⚙️ (32px, #0288D1)
- Grande valeur : "32"
- Sous-titre : "Configurations calage"
- Petit texte : "12 associées à des véhicules"
 
**Carte 4 - Cycles conduite**
- Icône : 🔄 (32px, #0288D1)
- Grande valeur : "15"
- Sous-titre : "Cycles disponibles"
- Petit texte : "WLTC, NEDC, RDE, perso..."                                                                               **Carte **Carte 5- Essais du mois**
- Grand titre : "Mars 2026" (Medium 20px)
- Grande valeur : "28" (SemiBold 48px)
- Sous-titre : "Essais réalisés"
- Petit texte : "Dont 12 programmés"
 
#### LIGNE 2 - Statistiques mensuelles (2 cartes)
Disposition : 2 colonnes (60% - 40%)
 
**Carte droite - Répartition par statut**
- Titre : "Répartition des essais"
- Graphique circulaire (taille 160px) :
 - 65% vert #2E7D32 - "OK (18)"
 - 15% rouge #C62828 - "NOK (4)"
 - 20% orange #ED6C02 - "Sous réserve (6)"
- Légende horizontale sous le graphique
 
 
Carte pleine largeur "Évolution des essais sur 12mois"
- Graphique en barres empilées
- Axe X : Oct, Nov, Déc, Jan, Fév, Mars, Avril mai jui juiilet aout octebre novemvre  december
- Barres avec segments vert/rouge/orange
- Légende en bas
 
 
#### LIGNE 3 - Récapitulatif rapide (3 mini-cartes)
Disposition : 3 colonnes
- "Essais aujourd'hui : 3" avec 📅
- "Essais à valider : 5 (2 cond., 3 chargé)" avec ✅
- "Prochain essai : Aujourd'hui 14h - Megane" avec ⏰
 
---
 
## PAGE 2 : VÉHICULES (/vehicules)
 
### En-tête de page
- Titre : "Véhicules" (SemiBold 24px)
- Sous-titre : "Gérer la base de données des véhicules" (Regular 14px, #757575)
 
### Barre d'actions
- Champ recherche : 🔍 "Rechercher par nom, immatriculation, VIN..." (largeur 400px)
- Filtres chips :
   Filtrer par transmission (4x2 / 4x4)
Filtre par motorisation (
  Filtrer par localisation (Site A / Site B / etc.)
 
)
- Bouton "+ Ajouter un véhicule" (primaire)
 
### Tableau des véhicules
Colonnes :
1. "Nom" (appli_immat)
2. "Immatriculation"
3. "Motorisation" (avec icônes : 🔥 thermique, ⚡ électrique, 🔋 hybride)
4. "Transmission" (4x2/4x4)
5. "Responsable"
6. "Localisation"
7. "Actions" (👁️ ✏️📋🗑️)
 
### Modal formulaire véhicule (au clic sur Ajouter)
 
**Titre : "Nouveau véhicule"** (SemiBold 20px)
 
**Section 1 - Identification** (2 colonnes)
- "Nom (appli_immat)"* [champ texte]
- "Immatriculation"* [champ texte]
- "VIN"* [champ texte]
- "Site" [dropdown : Site A, Site B]
- "Responsable" [dropdown : Dupont, Martin, Petit, Bernard]
- "Localisation" [champ texte]
 
**Section 2 - Motorisation et transmission** (2 colonnes)
- "Type motorisation"* [dropdown : ICE, HEV, BEV, PHEV]
- "Moteur" [champ texte]
- "Boîte vitesse" [dropdown : Manuelle, Automatique, Double embrayage]
- "Carburant" [dropdown : Essence, Diesel, Électrique, Hybride]
- "Mode conduite" [dropdown : Traction, Propulsion, 4x4, 4x2]
 
**Section 3 - Caractéristiques** (2 colonnes)
- "Couleur" [champ texte + aperçu couleur]
- "Famille" [dropdown : Citadine, Berline, SUV, Utilitaire]
- "Puissance" [nombre + dropdown kW/ch]
- "Densité" [nombre]
 
**Section 4 - Dimensions** (2 colonnes)
- "Dimensions pneus" [champ texte, placeholder "205/55 R16"]
- "Pression pneus" [nombre + "bar"]
- "Empattement" [nombre + "mm", note "max 4400 mm"]
- "Type catalyseur" [champ texte]
 
**Message info** : "Tout véhicule créé est automatiquement ajouté à la base de données."
 
**Boutons** : "Annuler" (secondaire) | "Valider" (primaire)
 
---
 
 
## PAGE 3 : LOIS DE ROUTE (/lois-de-route)
### En-tête
- Titre : "Lois de route"
- Sous-titre : "Paramétrer les lois de simulation des efforts routiers"
 
### Barre d'actions
- Recherche : 🔍 "Rechercher par nom, mode banc..."
- Filtres chips : "Toutes", "4x4", "Avant", "Arrière", "Sync"
- Bouton "+ Ajouter une loi de route" (primaire)
 
### Tableau des lois de route
Colonnes :
1. "Nom de la loi"
2. "Mode banc" (badge coloré)
3. "Inertie (kg)"
4. "Masse d'essai (kg)"
5. "Coefficients" (
6,"F0 "
7."F1 "
8."F2"
9. "Date création"
10. "Actions"
 
### Formulaire loi de route
 
**Section 1 - Identification**
- "Nom"* [champ texte, placeholder "Norme_Customer_Application_Commentaire"]
- "Description" [textarea, placeholder "Détails complémentaires..."]
 
**Section 2 - Configuration banc**
- "Mode du banc"* [dropdown : 4x4, Avant Sync, Arrière Sync, Avant, Arrière]
 
**Section 3 - Paramètres d'inertie** (2 colonnes)
- "Inertie (kg)"* [nombre]
- "Masse d'essai (kg)"* [nombre]
- "Inertie Rotative Train Non Roulant" [nombre]
- "Inertie Rotative Deux Trains" [nombre]
 
**Section 4 - Coefficients de résistance** (3 champs côte à côte)
- "F0 (N)"* [nombre]
- "F1 (N/km/h)"* [nombre]
- "F2 (N/(km/h)²)"* [nombre]
 
---
 
## PAGE 4 : CALAGES (/calages)
 
### En-tête
- Titre : "Calages"
- Sous-titre : "Gérer les configurations de calage pour les essais"
 
### Barre d'actions
- Recherche : 🔍 "Rechercher par nom, véhicule, LdR..."
- Bouton "+ Ajouter un calage" (primaire)
 
### Tableau des calages
Colonnes :
1. "Nom du calage"
2. "Véhicule associé"
3. "Loi de route associée"
4. "Mode de conduite"
5. "Coefficients" (A,
6.B,
7.C)
9. "Actions"
 
### Formulaire calage
**Section 1 - Identification**
- "Nom du calage"* [champ texte, placeholder "ClioV_WLTP_01"]
- "Description" [textarea]
 
**Section 2 - Associations** (2 colonnes)
- "Véhicule associé"* [dropdown]
- "Loi de route associée"* [dropdown]
- "Mode de conduite"* [dropdown : Traction, Propulsion, 4x4, 4x2]
 
**Section 3 - Coefficients provisoires** (3 champs)
- "A (N)"* [nombre, placeholder "45.5"]
- "B (N/km/h)"* [nombre, placeholder "0.32"]
- "C (N/(km/h)²)"* [nombre, placeholder "0.024"]
**Section 4 - Résultats de calage** (visible après essai)
- "Coefficients mesurés" (champs verrouillés)
- "Date du dernier calage"
- "Fichier résultats" (lien de téléchargement)
 
---
 
## PAGE 5 : CYCLES DE CONDUITE (/cycles)
 
### En-tête
- Titre : "Cycles de conduite"
- Sous-titre : "Gérer les cycles de roulage pour les essais"
 
### Barre d'actions
- Recherche : 🔍 "Rechercher par nom, famille..."
- Filtres chips : "Tous", "WLTC", "RDE", "NEDC", "ARTEMIS", "Personnalisé"
- Bouton "+ Ajouter un cycle" (primaire)
 
Colonnes
Nom du cycle
- famille (WLTC bleu, RDE vert, NEDC orange)
Nombre de phese
Nombre de stabilité
Trace (fichier excel)
- Actions en bas : 👁️ ✏️📋🗑️
 
### Formulaire cycle
 
**Section 1 - Identification** (2 colonnes)
- "Nom du cycle"* [champ texte]
- "Famille "* [dropdown : WLTC, RDE, NEDC, ARTEMIS, Personnalisé]
 
**Section 2 - Caractéristiques** (2 colonnes)
- "Durée"* [nombre + dropdown secondes/minutes]
- "Nombre de phases"* [nombre]
- "Nombre de stabilisés" [nombre]
 
**Section 3 - Fichier trace**
- Zone drag & drop (bordure pointillée, hauteur 120px)
- Formats acceptés : Excel (.xlsx, .xls)
- Description : "Le fichier doit contenir : temps (s), vitesse (km/h), rapport, phase pente"
 
 
---
 
## PAGE 6 : DEMANDES D'ESSAI (/demandes)
 
### En-tête
- Titre : "Demandes d'essai"
- Sous-titre : "Gérer toutes les demandes d'utilisation du banc"
 
### Barre d'actions
- Recherche : 🔍 "Rechercher par nom, projet, demandeur..."
- Filtres dropdown :
 - Statut : "Tous", "Validé", "Brouillon"
 - Projet : "COP", "ISC", "Tous"
- Bouton "+ Nouvelle demande" (primaire)
 
### Tableau des demandes
Colonnes :
1. "Nom de la demande" (format Projet_Demandeur_Véhicule_Cycle_numéro)
2. "Projet"
3. "Demandeur"
4. "Statut" (badge 🔵 Validé / ⚪ Brouillon)
5. "Date planification"
6. "Shift" (Matin/Après-midi/Nuit)
7. "Validation" (badge ✅ Fait / 🟡 En cours / ⭕ Pas fait)
8. "Actions" (👁️ ✏️📋🗑️ avec restriction)
 
### Formulaire demande - Étape 1/2
 
**Indicateur progression** : Étape 1 sur 2 - Informations générales
 
**Section 1 - Informations de base** (2 colonnes)
- "Véhicule"* [dropdown]
- "Cycle de conduite"* [dropdown]
- "Calage"* [dropdown filtré par véhicule]
- "Type de projet"* [dropdown : COP, ISC, Autre]
- "Demandeur"* [dropdown]
- "Conducteur"* [dropdown]
 
**Section 2 - Infos générées automatiquement** (fond gris clair)
- "Nom de la demande" [champ verrouillé]
- "Type de motorisation" [affichage]
- "Carburant" [dropdown : E10, E3, BPVR]
- "Banc" [affichage "Banc n°1"]
 
**Section 3 - Options de mesure** (grille)
Ligne 1 : ☐ "INCA" | ☐ "Mesures auxiliaires" | ☐ "Gaz brutes" | ☐ "Gaz dilués"
Ligne 2 : ☐ "BAG" | ☐ "Microsot" | ☐ "PM" | ☐ "PN23" | ☐ "PN10"
Ligne 3 : "Capot" [◉ Ouvert] [○ Fermé] | "Soufflante" [dropdown] | "Q_CVS" [nombre] | ☐ "Carflow"
 
**Section 4 - Conditions d'essai** (grille 3 colonnes)
- "Date de l'essai"* [calendrier]
- "Shift"* [dropdown : Matin, Après-midi, Nuit]
- "Besoin macération" [toggle] + "Température" si oui
- "Température d'eau" [champ]
- "Activation STT" [toggle]
- "Température d'essai" [champ]
- "Hygrométrie d'essai" [champ]
- "Gestion batterie 12V" [dropdown : Chargement, BBN]
- "SOC départ 12V" [champ]
- "Activation Clim" [toggle] + "Température régulation"
- "Chauffage habitacle" [toggle]
- "Type d'essai" [dropdown : Tir macéré, Précon, Calage, Roulage]
- "Vérification Coast Down" [toggle] + "Nb décélérations"
- "Commentaire conducteur" [textarea]
 
Bouton "Suivant" (primaire, aligné droite)
 
### Formulaire demande - Étape 2/2 (5 onglets)
 
**Indicateur progression** : Étape 2 sur 2 - Configuration détaillée
 
**Système d'onglets** horizontaux :
 
**Onglet 1 - Véhicule/Calage**
- Infos véhicule (lecture seule)
- "Trace du cycle" : 📎 "Importer fichier Excel"
- Affichage des paramètres LdR et calage
 
**Onglet 2 - Gaz dilués**
- ☐ "Mesure SAC" → Débits CVs Phase 1,2,3,10
- ☐ "PM" → "Débit de prélèvement (l/min)"
- ☐ "PN_10 nano" → "Facteur de dilution PN10"
- ☐ "PN_23 nano" → "Facteur de dilution PN23"
 
**Onglet 3 - Gaz brutes**
- ☐ "Ligne 1" → "Point prélèvement" [dropdown]
- ☐ "Ligne 2" → "Point prélèvement" [dropdown]
- ☐ "Ligne 3" → "Point prélèvement" [dropdown]
- ☐ "QCL_1" → "Point prélèvement" [dropdown]
- ☐ "QCL_2" → "Point prélèvement" [dropdown]
- ☐ "PN_1" → "Point prélèvement" [dropdown]
- ☐ "PN_2" → "Point prélèvement" [dropdown]
- ☐ "EGR" | ☐ "Microsot"
 
**Onglet 4 - Données INCA**
- ☐ "XCU1" → Software (.a2l, .srh) + Calibration (.hex, .s19, .ulp) + Experiment (.exp)
- ☐ "XCU2" → Software + Calibration
- ☐ "XCU3" → Software + Calibration
- ☐ "Acquisition EOBD" → "Type d'acquisition" [dropdown]
 
**Onglet 5 - Mesures auxiliaires**
- Toggles : ☐ "Mesure courant" | ☐ "Mesure tension" | ☐ "Thermocouples" | ☐ "Sonde Lambda"
- Tableau dynamique : bouton "+ Ajouter une ligne"
 | Indice | Numéro thermocouple | Type de mesure | Action |
 
**Boutons** : "Précédent" | "Enregistrer comme brouillon" | "Créer la demande" (primaire)
 
---
 
## PAGE 7 : PLANNING HEBDOMADAIRE (/planning)
 
### En-tête
- Titre : "Planning hebdomadaire"
- Sous-titre : "Visualisation des essais planifiés sur la semaine"
 
### Encart cycle de vie (fond #E3F2FD)
- Diagramme horizontal : "Expression → Planification → Validation → Réalisation → Reporting"
- Étape "Planification" mise en évidence (fond blanc, bordure #0288D1)
 
### Description
- Texte : "Mise à disposition d'un calendrier hebdomadaire partagé regroupant l'ensemble des essais planifiés sur la semaine."
- Liste puces : "Les essais ajoutés durant la semaine", "Le moyen d'essai affecté", "Le jour de réalisation et le shift", "L'heure de début et de fin", "Le banc utilisé", "Le nom du conducteur"
 
### Barre d'actions
- Ligne 1 :
 - Sélecteur de semaine : [Calendrier] "Semaine du 02/03/2026 au 08/03/2026" avec flèches ◀▶
 - Bouton "Aujourd'hui"
 - Chips : "Tous les essais" (actif), "Mes essais", "À valider", "Banc disponible"
- Ligne 2 :
 - Recherche rapide 🔍 "Rechercher..."
 - Filtre par statut [dropdown]
 - Filtre par conducteur [dropdown]
 
### Vue planning - Option Agenda
 
**En-tête des jours** (7 colonnes) :
| Lundi 02/03 | Mardi 03/03 | Mercredi 04/03 | Jeudi 05/03 | Vendredi 06/03 | Samedi 07/03 | Dimanche 08/03 |
 
**Ligne ressource** :
Colonne fixe "Banc n°1" (largeur 150px, fond #F5F5F5)
 
**Contenu des cellules** (hauteur minimale 200px) :
 
LUNDI :
- Bloc 09h-12h : "Clio V - Calage - Dupont" (fond #BBDEFB)
- Bloc 14h-17h : "Megane - Homologation - Martin" (fond #C8E6C9)
 
MARDI :
- Bloc 08h-12h : "Captur - Roulage - Petit" (fond #BBDEFB)
- Bloc 13h-16h : "Kangoo - Calage - Dupont" (fond #BBDEFB)
 
MERCREDI :
- Bloc 10h-12h : "Master - Coast Down - Bernard" (fond #FFE0B2)
- Bloc 14h-18h : "Trafic - Calage - Martin" (fond #BBDEFB)
 
JEUDI :
- Bloc 08h-11h : "Clio V - Validation - Dupont" (fond #C8E6C9)
- Bloc 13h-17h : "Megane - Roulage - Petit" (fond #BBDEFB)
 
VENDREDI :
- Bloc 09h-12h : "Captur - Calage - Bernard" (fond #BBDEFB)
- Bloc après-midi : "Banc disponible" (fond #F5F5F5, texte italique)
 
SAMEDI/DIMANCHE :
- "Repos" (fond #F5F5F5)
 
### Légende
- 🟦 Bleu : Essais standards
- 🟩 Vert : Homologation/Validation
- 🟧 Orange : Essais spéciaux
- ⬜ Gris : Créneaux disponibles
 
### Sections informatives (bas de page, 2 colonnes)
 
**Gauche - Nouveaux essais planifiés**
- ⭐ "Megane E-Tech - 04/03"
- ⭐ "Trafic - 05/03"
- ⭐ "Master - 03/03 (modifié)"
 
 
---
 
## PAGE 8 : VALIDATION & REPORTING (/validation)
 
### En-tête
- Titre : "Validation & Reporting"
- Sous-titre : "Suivi des validations d'essais par interlocuteur"
 
### Indicateur global (carte)
3 badges avec compteurs :
- ✅ "Fait" (12) - vert
- 🟡 "En cours" (5) - orange
- ⭕ "Pas fait" (3) - rouge
 
### Section interlocuteurs (2 cartes côte à côte)
 
**Carte Conducteur** (👤)
- Icône grande taille (48px)
- Titre : "Validation Conducteur"
- Sous-titre : "Valider l'essai du point de vue déroulement"
- Badge "5 en attente"
- Bouton "Accéder" ou carte cliquable
 
**Carte Chargé d'essai** (👨‍💼)
- Icône grande taille (48px)
- Titre : "Validation Chargé d'essai"
- Sous-titre : "Valider l'essai du point de vue analyse"
- Badge "3 en attente"
- Bouton "Accéder"
 
### Tableau récapitulatif
Colonnes :
1. "Date"
2. "Véhicule"
3. "Cycle"
4. "Conducteur"
5. "Validation Conducteur" (badge)
6. "Validation Chargé" (badge)
7. "Statut global" (🔵 Fait / 🟡 En cours / 🔴 Pas fait)
8. "Actions" (👁️)
 
---
 
## PAGE 9 : VALIDATION CONDUCTEUR
 
### En-tête
- Titre : "Validation Conducteur - Essai du 05/03/2026"
 
### Carte récapitulative
- Véhicule : "Clio V"
- Cycle : "WLTC"
- Date : "05/03/2026"
- Heure : "08h-11h"
- Conducteur : "Dupont"
 
### Note explicative (fond #F5F5F5)
"Le conducteur valide l'essai du point de vue déroulement et partage son ressenti sur le comportement du véhicule."
 
### Section validation (3 cartes horizontales)
 
**Carte OK** ✅ (fond #E8F5E9, bordure #2E7D32)
- Titre : "OK"
- Description : "Essai réalisé sans problèmes"
- Icône : ✅ cercle vert
 
**Carte NOK** ❌ (fond #FFEBEE, bordure #C62828)
- Titre : "NOK"
- Description : "Essai interrompu ou non réalisé"
- Icône : ❌ cercle rouge
 
**Carte Sous réserve** ⚠️ (fond #FFF3E0, bordure #ED6C02)
- Titre : "OK sous réserve"
- Description : "Essai réalisé mais avec complications"
- Icône : ⚠️ triangle orange
 
### Section commentaire
- Label : "Commentaire et ressenti conducteur"
- Textarea (hauteur 120px)
- Placeholder : "Décrivez le déroulement de l'essai, le comportement du véhicule, les problèmes rencontrés..."
- Exemples : "Déroulement, comportement véhicule, problèmes, anomalies, ressenti..."
 
### Boutons
- "Annuler" | "Enregistrer comme brouillon" | "Valider" (primaire)
 
---
 
## PAGE 10 : VALIDATION CHARGÉ D'ESSAI
 
### En-tête
- Titre : "Validation Chargé d'essai - Essai du 05/03/2026"
 
### Carte récapitulative
- Véhicule : "Clio V"
- Cycle : "WLTC"
- Date : "05/03/2026"
- Heure : "08h-11h"
- Chargé d'essai : "Martin"
 
### Note explicative
"Le chargé d'essai valide l'essai du point de vue analyse 1er niveau des résultats et partage les données avec le client."
 
### Section import fichiers (3 zones drag & drop)
 
1. "Acquisition INCA" (obligatoire)
  - Formats : .dat, .mf4
  - Zone pointillée avec icône 📁
 
2. "Fichier BàR" (obligatoire)
  - Format : .xlsx
  - Zone pointillée
 
3. "Checklist" (obligatoire)
  - Format : .xlsx
  - Zone pointillée
 
### Section aperçu checklist
Tableau 2 colonnes :
| Critère | Statut |
|---------|--------|
| Passage en D 20s | ✅ OK |
| Rec. calage temporel | ✅ OK |
| LDR | ✅ OK |
| Lien de banc | ✅ OK |
| CD | ✅ OK |
| Conduite | ✅ OK |
| SOC init 12V | ✅ OK |
| STT | ✅ OK |
 
### Section validation demandeur
3 options horizontales :
- ✅ "OK - Essai valide"
- ❌ "NOK - Essai non valide"
- ⚠️ "OK sous réserve - Essai valide sous conditions"
 
### Section OETB
☐ "OETB renseigné dans le réseau + importé dernière version dans l'outil"
 
### Boutons
- "Annuler" | "Enregistrer comme brouillon" | "Valider l'essai" (primaire)
 
---
 
## ÉLÉMENTS D'INTERACTION ET MICRO-INTERACTIONS
 
### États de survol
- Cartes : ombre renforcée, scale 1.02, transition 0.2s
- Boutons : opacité 0.9
- Lignes tableau : fond #F5F5F5
 
### États de chargement
- Skeleton screens (animation de pulse)
- Spinners pour actions asynchrones
 
### Messages de notification
- Succès : toast vert avec ✅
- Erreur : toast rouge avec ❌
- Avertissement : toast orange avec ⚠️
 
### Validation de formulaire
- Champ valide : bordure verte
- Champ invalide : bordure rouge + message d'erreur
- Champ requis : astérisque rouge
 
### Animations
- Transition douce sur apparition des modales
- Accordéons avec animation de hauteur
- Onglets avec transition de contenu
 
---
 
## RESPONSIVE DESIGN
 
### Desktop (1200px+)
- Navigation latérale visible
- Grille 12 colonnes
 
### Tablet (768px - 1199px)
- Navigation repliable (icônes seulement)
- Grille 8 colonnes
- Tableaux scrollables horizontalement
 
### Mobile (320px - 767px)
- Menu hamburger
- Grille 4 colonnes
- Cartes en colonne unique
- Formulaires en 1 colonne
- Boutons full width
 
---
 
## SPÉCIFICATIONS DE GÉNÉRATION FIGMA
 
### Auto Layout
- Utiliser Auto Layout pour tous les composants
- Padding, gap et alignement paramétrés
- Contraintes de redimensionnement
 
### Composants
- Créer une bibliothèque de composants :
 - Button/Primary, Button/Secondary, Button/Tertiary
 - Card/Default, Card/Interactive
 - Input/Text, Input/Dropdown, Input/Textarea
 - Badge/Status (4 variants)
 - Table/Header, Table/Row
 - Navigation/MenuItem
 - Modal/Default
 
### Styles
- Créer des styles de texte :
 - H1 (SemiBold 32px)
 - H2 (SemiBold 24px)
 - H3 (Medium 20px)
 - Body (Regular 16px)
 - Small (Regular 14px)
 - Tiny (Regular 12px)
- Créer des styles de couleurs
- Créer des effets (ombres)
 
### Variants
- Boutons avec états (default, hover, pressed, disabled)
- Badges avec couleurs différentes
- Inputs avec états (default, focus, error, disabled)
 
### Prototypage (optionnel)
- Créer des flows simples :
 - Création d'une demande d'essai
 - Validation conducteur
 - Navigation entre pages
 
---
 
## STRUCTURE DES PAGES DANS FIGMA
 
### Page 1 : Cover
- Titre du projet
- Version et date
 
### Page 2 : Design System
- Palette de couleurs
- Typographie
- Composants
- Icônes
- Grille
 
### Page 3 : Dashboard
- Écran complet
 
### Page 4 : Véhicules
- Liste + modal formulaire
 
### Page 5 : Lois de route
- Liste + formulaire
 
### Page 6 : Calages
- Liste + formulaire
 
### Page 7 : Cycles
- Vue cartes + formulaire
 
### Page 8 : Demandes
- Liste + formulaire étapes 1 et 2
 
### Page 9 : Planning
- Vue agenda complète
 
### Page 10 : Validation
- Accueil validation
 
### Page 11 : Validation Conducteur
- Écran validation
 
### Page 12 : Validation Chargé
- Écran validation
 
 
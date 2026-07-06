# Dossier Assets

Ce dossier contient tous les assets statiques de l'application SmartTest.

## 📁 Structure simple

```
/src/assets/
├── index.ts           # Export centralisé des images
├── SmartTest.png      # Votre logo (à ajouter)
└── README.md          # Ce fichier
```

## 🚀 Utilisation rapide

### Étape 1 : Coller votre image

Placez simplement votre fichier image dans `/src/assets/` :
```
/src/assets/
  └── SmartTest.png    ← Collez votre logo ici
```

### Étape 2 : Activer l'import

Ouvrez `/src/assets/index.ts` et décommentez cette ligne :

```tsx
import SmartTestLogo from "./SmartTest.png";
```

Et commentez le placeholder :
```tsx
// const SmartTestLogo = "https://via.placeholder.com/...";
```

### Étape 3 : C'est tout ! ✅

Vos composants utilisent déjà l'import centralisé :
```tsx
import { images } from "../../assets";
<img src={images.logo.smartTest} alt="SmartTest Logo" />
```

## 📝 Exemple complet

**Fichier `/src/assets/index.ts` :**
```tsx
import SmartTestLogo from "./SmartTest.png";

export const images = {
  logo: {
    smartTest: SmartTestLogo,
  },
};
```

## ➕ Ajouter d'autres images

```tsx
import SmartTestLogo from "./SmartTest.png";
import BannerImage from "./banner.jpg";
import VehicleIcon from "./vehicle-icon.svg";

export const images = {
  logo: {
    smartTest: SmartTestLogo,
  },
  banners: {
    main: BannerImage,
  },
  icons: {
    vehicle: VehicleIcon,
  },
};
```

## 🎨 Formats supportés

- PNG, JPG, JPEG, SVG, WebP, GIF

## 📍 Structure actuelle

```
/src/assets/
├── SmartTest.png          ← Ajoutez votre logo ici
├── index.ts               ← Configurez l'import ici
└── README.md
```

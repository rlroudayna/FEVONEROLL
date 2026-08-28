import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./app/i18n/i18n";
import logo3 from "./assets/images/logo3.png";

const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

if (favicon) {
  favicon.href = logo3;
}

createRoot(document.getElementById("root")!).render(<App />);
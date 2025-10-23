import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ShortcutsBinder from "@/components/ShortcutsBinder";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<App />
		<ShortcutsBinder />
	</BrowserRouter>
);

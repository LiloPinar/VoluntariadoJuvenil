export type ShortcutDef = {
  combo: string; // human readable combo for display
  label: string;
  description?: string;
};

export const SHORTCUTS: ShortcutDef[] = [
  { combo: "Ctrl/Cmd + H", label: "Inicio", description: "Ir a la página de inicio" },
  { combo: "Ctrl/Cmd + P", label: "Proyectos", description: "Abrir lista de proyectos" },
  { combo: "Ctrl/Cmd + M", label: "Mis Horas", description: "Ver tus horas registradas" },
  { combo: "Ctrl/Cmd + C", label: "Comunidad", description: "Ir a la sección Comunidad" },
];

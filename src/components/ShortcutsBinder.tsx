import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalShortcuts from "@/hooks/useGlobalShortcuts";

export const ShortcutsBinder: React.FC = () => {
  const navigate = useNavigate();

  useGlobalShortcuts({
    "ctrl+h": () => navigate("/"),
    "meta+h": () => navigate("/"),
    "ctrl+p": () => navigate("/proyectos"),
    "meta+p": () => navigate("/proyectos"),
    "ctrl+m": () => navigate("/mis-horas"),
    "meta+m": () => navigate("/mis-horas"),
    "ctrl+c": () => navigate("/comunidad"),
    "meta+c": () => navigate("/comunidad"),
  });

  return null;
};

export default ShortcutsBinder;

import projectEnvironmental from "@/assets/project-environmental.jpg";
import projectSocial from "@/assets/project-social.jpg";
import projectEducational from "@/assets/project-educational.jpg";

export interface Project {
  id: number;
  title: string;
  description: string;
  category: "social" | "environmental" | "educational";
  hours: number;
  participants: number;
  location: string;
  image: string;
  date: string;
  status: "available" | "in-progress" | "completed";
}

export const allProjects: Project[] = [
  {
    id: 1,
    title: "Reforestación Comunitaria",
    description: "Ayuda a plantar árboles y restaurar áreas verdes en nuestra comunidad local.",
    category: "environmental",
    hours: 4,
    participants: 25,
    location: "Parque Central, Manta",
    image: projectEnvironmental,
    date: "2025-11-01",
    status: "available",
  },
  {
    id: 2,
    title: "Apoyo a Personas Mayores",
    description: "Acompaña y asiste a adultos mayores en el centro comunitario.",
    category: "social",
    hours: 3,
    participants: 15,
    location: "Centro Comunitario San José",
    image: projectSocial,
    date: "2025-10-28",
    status: "available",
  },
  {
    id: 3,
    title: "Tutoría Académica",
    description: "Enseña y apoya a niños de primaria en sus estudios después de clases.",
    category: "educational",
    hours: 2,
    participants: 30,
    location: "Escuela La Esperanza",
    image: projectEducational,
    date: "2025-11-05",
    status: "available",
  },
  {
    id: 4,
    title: "Limpieza de Playas",
    description: "Únete a la jornada mensual de limpieza y conservación de nuestras playas.",
    category: "environmental",
    hours: 3,
    participants: 40,
    location: "Playa Murciélago",
    image: projectEnvironmental,
    date: "2025-11-10",
    status: "available",
  },
  {
    id: 5,
    title: "Alfabetización Digital",
    description: "Enseña habilidades tecnológicas básicas a personas de la tercera edad.",
    category: "educational",
    hours: 2,
    participants: 12,
    location: "Biblioteca Municipal",
    image: projectEducational,
    date: "2025-10-30",
    status: "available",
  },
  {
    id: 6,
    title: "Banco de Alimentos",
    description: "Colabora en la clasificación y distribución de alimentos para familias necesitadas.",
    category: "social",
    hours: 4,
    participants: 20,
    location: "Banco de Alimentos Manabí",
    image: projectSocial,
    date: "2025-11-03",
    status: "available",
  },
  {
    id: 7,
    title: "Construcción de Viviendas",
    description: "Ayuda a construir viviendas para familias de bajos recursos en la comunidad.",
    category: "social",
    hours: 6,
    participants: 18,
    location: "Sector Los Pinos, Manta",
    image: projectSocial,
    date: "2025-11-12",
    status: "available",
  },
  {
    id: 8,
    title: "Conservación Marina",
    description: "Participa en el monitoreo y protección de especies marinas en peligro.",
    category: "environmental",
    hours: 5,
    participants: 15,
    location: "Reserva Marina Machalilla",
    image: projectEnvironmental,
    date: "2025-11-15",
    status: "available",
  },
];

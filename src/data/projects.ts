import projectEnvironmental from "@/assets/project-environmental.jpg";
import projectSocial from "@/assets/project-social.jpg";
import projectEducational from "@/assets/project-educational.jpg";

export interface Activity {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  hours: number;
  completedBy: string[]; // IDs de usuarios que completaron esta actividad
  validatedBy?: string; // ID del admin que validó
  validatedAt?: string; // Fecha de validación
  isCompleted: boolean;
}

export interface Project {
  id: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: "social" | "environmental" | "educational";
  hours: number;
  participants: number;
  location: string;
  image: string;
  date: string;
  status: "available" | "in-progress" | "completed";
  isOpenForEnrollment?: boolean; // Campo para controlar si acepta inscripciones
  activities?: Activity[]; // Actividades/objetivos del proyecto
}

export const allProjects: Project[] = [
  {
    id: 1,
    title: "Reforestación Comunitaria",
    titleEn: "Community Reforestation",
    description: "Ayuda a plantar árboles y restaurar áreas verdes en nuestra comunidad local.",
    descriptionEn: "Help plant trees and restore green areas in our local community.",
    category: "environmental",
    hours: 4,
    participants: 25,
    location: "Parque Central, Manta",
    image: projectEnvironmental,
    date: "2025-11-01",
    status: "available",
    isOpenForEnrollment: true,
    activities: [
      {
        id: "act-1-1",
        name: "Preparación del terreno",
        nameEn: "Land Preparation",
        description: "Limpieza y preparación del área a reforestar",
        descriptionEn: "Cleaning and preparation of the reforestation area",
        hours: 1,
        completedBy: [],
        isCompleted: false,
      },
      {
        id: "act-1-2",
        name: "Plantación de árboles",
        nameEn: "Tree Planting",
        description: "Siembra de especies nativas",
        descriptionEn: "Planting of native species",
        hours: 2,
        completedBy: [],
        isCompleted: false,
      },
      {
        id: "act-1-3",
        name: "Riego y mantenimiento",
        nameEn: "Watering and Maintenance",
        description: "Cuidado inicial de los árboles plantados",
        descriptionEn: "Initial care of planted trees",
        hours: 1,
        completedBy: [],
        isCompleted: false,
      },
    ],
  },
  {
    id: 2,
    title: "Apoyo a Personas Mayores",
    titleEn: "Elderly Support",
    description: "Acompaña y asiste a adultos mayores en el centro comunitario.",
    descriptionEn: "Accompany and assist elderly adults at the community center.",
    category: "social",
    hours: 3,
    participants: 15,
    location: "Centro Comunitario San José",
    image: projectSocial,
    date: "2025-10-28",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 3,
    title: "Tutoría Académica",
    titleEn: "Academic Tutoring",
    description: "Enseña y apoya a niños de primaria en sus estudios después de clases.",
    descriptionEn: "Teach and support elementary school children with their studies after school.",
    category: "educational",
    hours: 2,
    participants: 30,
    location: "Escuela La Esperanza",
    image: projectEducational,
    date: "2025-11-05",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 4,
    title: "Limpieza de Playas",
    titleEn: "Beach Cleanup",
    description: "Únete a la jornada mensual de limpieza y conservación de nuestras playas.",
    descriptionEn: "Join the monthly beach cleanup and conservation event.",
    category: "environmental",
    hours: 3,
    participants: 40,
    location: "Playa Murciélago",
    image: projectEnvironmental,
    date: "2025-11-10",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 5,
    title: "Alfabetización Digital",
    titleEn: "Digital Literacy",
    description: "Enseña habilidades tecnológicas básicas a personas de la tercera edad.",
    descriptionEn: "Teach basic technology skills to elderly people.",
    category: "educational",
    hours: 2,
    participants: 12,
    location: "Biblioteca Municipal",
    image: projectEducational,
    date: "2025-10-30",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 6,
    title: "Banco de Alimentos",
    titleEn: "Food Bank",
    description: "Colabora en la clasificación y distribución de alimentos para familias necesitadas.",
    descriptionEn: "Help sort and distribute food for families in need.",
    category: "social",
    hours: 4,
    participants: 20,
    location: "Banco de Alimentos Manabí",
    image: projectSocial,
    date: "2025-11-03",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 7,
    title: "Construcción de Viviendas",
    titleEn: "Housing Construction",
    description: "Ayuda a construir viviendas para familias de bajos recursos en la comunidad.",
    descriptionEn: "Help build homes for low-income families in the community.",
    category: "social",
    hours: 6,
    participants: 18,
    location: "Sector Los Pinos, Manta",
    image: projectSocial,
    date: "2025-11-12",
    status: "available",
    isOpenForEnrollment: true,
  },
  {
    id: 8,
    title: "Conservación Marina",
    titleEn: "Marine Conservation",
    description: "Participa en el monitoreo y protección de especies marinas en peligro.",
    descriptionEn: "Participate in monitoring and protecting endangered marine species.",
    category: "environmental",
    hours: 5,
    participants: 15,
    location: "Reserva Marina Machalilla",
    image: projectEnvironmental,
    date: "2025-11-15",
    status: "available",
    isOpenForEnrollment: true,
  },
];

// Helper functions para obtener el texto según el idioma
export const getProjectTitle = (project: Project, locale: string): string => {
  return (locale === 'en' && project.titleEn) ? project.titleEn : project.title;
};

export const getProjectDescription = (project: Project, locale: string): string => {
  return (locale === 'en' && project.descriptionEn) ? project.descriptionEn : project.description;
};

export const getActivityName = (activity: Activity, locale: string): string => {
  return (locale === 'en' && activity.nameEn) ? activity.nameEn : activity.name;
};

export const getActivityDescription = (activity: Activity, locale: string): string => {
  return (locale === 'en' && activity.descriptionEn) ? activity.descriptionEn : activity.description;
};


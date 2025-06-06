import { Module } from "./types";

const courseData: Module[] = [
  {
    id: "intro",
    title: "Wprowadzenie do Framera",
    duration: "2m 49s",
    expanded: true,
    lessons: [
      {
        id: "welcome",
        title: "Witaj w kursie Framer",
        duration: "1m 24s",
        completed: true,
        videoUrl: "/videos/framer-wprowadzenie.mov",
        description:
          "Dowiedz się, czego nauczysz się w trakcie kursu i zobacz jak działa Framer.",
      },
      {
        id: "framer-zakladanie-konta",
        title: "Jak założyć konto Framer?",
        duration: "1m 25s",
        completed: true,
        videoUrl: "/videos/kurs-framer-zakladanie-konta.mov",
        description:
          "Praktyczny poradnik zakładania konta we Framerze.",
      },
      {
        id: "framer-podstawowe-funkcje",
        title: "Podstawowe funkcje Framer",
        duration: "6m 35s",
        completed: true,
        videoUrl: "/videos/framer-podstawowe-funkcje.mov",
        description:
          "Omówienie najważniejszych funkcji edytora.",
      },
    ],
  },
  {
    id: "basics",
    title: "Umiejętności w praktyce",
    duration: "11m 17s",
    expanded: false,
    lessons: [
      {
        id: "interface",
        title: "Tworzenie sekcji",
        duration: "4m 26s",
        completed: false,
        videoUrl: "/videos/framer-tworzenie-sekcji.mov",
        description: "Zobacz jak przygotować i sformatować sekcję w projekcie.",
      },
      {
        id: "canvas",
        title: "Obsługa linków i dodawanie podstrony",
        duration: "6m 51s",
        completed: false,
        videoUrl: "/videos/framer-podstrona-linki.mov",
        description: "Dodawanie podstron i linków w ramach projektu.",
      },
    ],
  },
  {
    id: "narzedzia-ai",
    title: "Poznanie narzędzi AI",
    duration: "7m 4s",
    expanded: false,
    lessons: [
      {
        id: "shapes",
        title: "Wireframer oraz Workshop",
        duration: "7m 4s",
        completed: false,
        videoUrl: "/videos/framer-narzedzia-ai.mov",
        description: "Przyjrzymy się narzędziom AI w Framerze - Wireframer i Workshop.",
      },
    ],
  },
  {
    id: "budowanie-strony",
    title: "Rozwijanie projektu",
    duration: "6m 2s",
    expanded: false,
    lessons: [
      {
        id: "basic-animations",
        title: "Budowanie strony",
        duration: "6m 2s",
        completed: false,
        videoUrl: "/videos/framer-rozwijanie-strony.mov",
        description: "Pracujemy nad rozbudową strony krok po kroku.",
      },
    ],
  },
  {
    id: "prototyping",
    title: "Podsumowanie",
    duration: "1m 56s",
    expanded: false,
    lessons: [
      {
        id: "interactive-prototypes",
        title: "Podsumowanie oraz publikacja projektu",
        duration: "1m 56s",
        completed: false,
        videoUrl: "/videos/framer-podsumowanie-publikacja.mov",
        description: "Czas na publikację projektu i krótkie podsumowanie.",
      },
    ],
  },
];

export default courseData


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
          "Krótka prezentacja kursu i możliwości Framera.",
      },
      {
        id: "framer-zakladanie-konta",
        title: "Jak założyć konto Framer?",
        duration: "1m 25s",
        completed: true,
        videoUrl: "/videos/kurs-framer-zakladanie-konta.mov",
        description:
          "Zakładamy konto i konfigurujemy podstawowe ustawienia.",
      },
      {
        id: "framer-podstawowe-funkcje",
        title: "Podstawowe funkcje Framer",
        duration: "6m 35s",
        completed: true,
        videoUrl: "/videos/framer-podstawowe-funkcje.mov",
        description:
          "Przegląd głównych narzędzi i interfejsu.",
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
        description: "Budujemy sekcję i omawiamy najczęstsze opcje formatowania.",
      },
      {
        id: "canvas",
        title: "Obsługa linków i dodawanie podstrony",
        duration: "6m 51s",
        completed: false,
        videoUrl: "/videos/framer-podstrona-linki.mov",
        description: "Łączymy strony i tworzymy nawigację.",
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
        description: "Testujemy wbudowane narzędzia AI: Wireframer oraz Workshop.",
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
        description: "Krok po kroku rozwijamy stronę i dodajemy kolejne sekcje.",
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
        description: "Końcowa publikacja projektu i podsumowanie kursu.",
      },
    ],
  },
];

export default courseData


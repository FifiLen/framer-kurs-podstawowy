"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Download,
  FileText,
  Video,
  Clock,
  CheckCircle,
  X,
  Menu,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Sun,
  Moon,
} from "lucide-react";

interface Material {
  name: string;
  type: "pdf" | "doc" | "zip" | "fig";
  url: string;
  size?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  materials?: Material[];
  description?: string;
}

interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
  expanded: boolean;
}

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
          "Poznaj podstawy Framera i dowiedz się, co możesz osiągnąć dzięki temu narzędziu.",
        materials: [
          {
            name: "Przewodnik po kursie.pdf",
            type: "pdf",
            url: "#",
            size: "2.1 MB",
          },
          {
            name: "Zasoby startowe.zip",
            type: "zip",
            url: "#",
            size: "15.3 MB",
          },
          {
            name: "Szablon projektu.fig",
            type: "fig",
            url: "#",
            size: "4.2 MB",
          },
        ],
      },
      {
        id: "framer-zakladanie-konta",
        title: "Jak założyć konto Framer?",
        duration: "1m 25s",
        completed: true,
        videoUrl: "/videos/kurs-framer-zakladanie-konta.mov",
        description:
          "Przegląd możliwości Framera i porównanie z innymi narzędziami do prototypowania.",
        materials: [
          {
            name: "Porównanie narzędzi.pdf",
            type: "pdf",
            url: "#",
            size: "1.8 MB",
          },
        ],
      },
      {
        id: "framer-podstawowe-funkcje",
        title: "Podstawowe funkcje Framer",
        duration: "6m 35s",
        completed: true,
        videoUrl: "/videos/framer-podstawowe-funkcje.mov",
        description:
          "Przegląd możliwości Framera i porównanie z innymi narzędziami do prototypowania.",
        materials: [
          {
            name: "Porównanie narzędzi.pdf",
            type: "pdf",
            url: "#",
            size: "1.8 MB",
          },
        ],
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
        description: "Szczegółowy przegląd interfejsu użytkownika Framera.",
      },
      {
        id: "canvas",
        title: "Obsługa linków i dodawanie podstrony",
        duration: "6m 51s",
        completed: false,
        videoUrl: "/videos/framer-podstrona-linki.mov",
        description: "Jak efektywnie poruszać się po obszarze roboczym.",
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
        description: "Tworzenie i edytowanie podstawowych kształtów.",
        materials: [
          {
            name: "Biblioteka kształtów.fig",
            type: "fig",
            url: "#",
            size: "2.1 MB",
          },
        ],
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
        description: "Tworzenie pierwszych animacji w Framerze.",
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
        description: "Tworzenie klikowalnych prototypów aplikacji.",
      },
    ],
  },
];

export default function LearningPlatform() {
  const { theme, setTheme } = useTheme();
  const [modules, setModules] = useState<Module[]>(courseData);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    courseData[0].lessons[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentLesson]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const toggleModule = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, expanded: !module.expanded }
          : module
      )
    );
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume / 100;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const totalLessons = modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = modules.reduce(
    (acc, module) =>
      acc + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "zip":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "fig":
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "pdf":
        return "badge-pdf";
      case "doc":
        return "badge-doc";
      case "zip":
        return "badge-zip";
      case "fig":
        return "badge-fig";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-heading font-semibold text-foreground truncate tracking-tight">
                Framer dla każdego: Kurs podstawowy
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground tracking-tight">
                  Autor: Filip Lendel
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              className="gap-2 hidden sm:flex tracking-tight"
            >
              <Download className="w-4 h-4" />
              Certyfikat
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div
            ref={containerRef}
            className="relative bg-black aspect-video group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              className="w-full h-full object-cover"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Button
                  size="lg"
                  className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 shadow-lg hover:scale-105 transition-transform"
                  onClick={togglePlay}
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>
            )}

            {/* Video Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={skipBackward}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={skipForward}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <span className="text-sm whitespace-nowrap ml-2 tracking-tight">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 text-xs tracking-tight"
                    onClick={changePlaybackRate}
                  >
                    {playbackRate}x
                  </Button>
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Logo */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-bold text-white">F</span>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-4 md:p-6 bg-card">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2 tracking-tight">
              {currentLesson.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="tracking-tight">{currentLesson.duration}</span>
              </div>
              {currentLesson.completed && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="tracking-tight">Ukończone</span>
                </div>
              )}
            </div>

            {/* Lesson Description */}
            {currentLesson.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed tracking-tight">
                {currentLesson.description}
              </p>
            )}

            {/* Materials */}
            {currentLesson.materials && currentLesson.materials.length > 0 && (
              <div className="mt-6">
                <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2 tracking-tight">
                  <Download className="w-5 h-5" />
                  Materiały do pobrania
                </h3>
                <div className="grid gap-3">
                  {currentLesson.materials.map((material, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:shadow-md transition-shadow bg-card/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {getFileIcon(material.type)}
                          <div className="min-w-0 flex-1">
                            <span className="font-medium block truncate tracking-tight">
                              {material.name}
                            </span>
                            {material.size && (
                              <span className="text-sm text-muted-foreground tracking-tight">
                                {material.size}
                              </span>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs tracking-tight ${getBadgeClass(
                              material.type
                            )}`}
                          >
                            {material.type.toUpperCase()}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 ml-3 flex-shrink-0 tracking-tight"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Pobierz</span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`
          w-full md:w-96 bg-card border-l border-border flex flex-col
          ${showSidebar ? "translate-x-0" : "translate-x-full"}
          ${isMobile ? "fixed top-0 right-0 h-full z-50" : "relative"}
          transition-transform duration-300 ease-in-out
        `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
            <h3 className="font-heading font-semibold text-foreground tracking-tight">
              ZAWARTOŚĆ KURSU
            </h3>
            <Button size="sm" variant="ghost" onClick={toggleSidebar}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Course Progress */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground tracking-tight">
                TWÓJ POSTĘP
              </span>
              <span className="text-sm font-bold text-foreground tracking-tight">
                {Math.round((completedLessons / totalLessons) * 100)}%
              </span>
            </div>
            <Progress
              value={(completedLessons / totalLessons) * 100}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span className="tracking-tight">
                {completedLessons} z {totalLessons} lekcji
              </span>
              <span className="tracking-tight">ukończone</span>
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto">
            {modules.map((module) => (
              <div key={module.id} className="border-b border-border/50">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 text-left hover:bg-muted/50 flex items-center justify-between transition-colors module-header"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-medium text-foreground truncate tracking-tight">
                      {module.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 tracking-tight">
                      {module.lessons.filter((l) => l.completed).length}/
                      {module.lessons.length} • {module.duration}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {module.expanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {module.expanded && (
                  <div className="bg-muted/30">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lesson)}
                        className={`
                          w-full p-3 pl-8 text-left hover:bg-muted/50 flex items-center gap-3 transition-all lesson-item
                          ${
                            currentLesson.id === lesson.id
                              ? "bg-blue-50 border-r-2 border-blue-500 dark:bg-blue-950/30"
                              : ""
                          }
                        `}
                      >
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Video className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate tracking-tight">
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground tracking-tight">
                              {lesson.duration}
                            </span>
                            {lesson.materials &&
                              lesson.materials.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs tracking-tight"
                                >
                                  {lesson.materials.length} plików
                                </Badge>
                              )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Toggle Button for Desktop */}
        {!showSidebar && (
          <Button
            className="fixed top-1/2 right-4 z-20 shadow-lg hidden md:flex"
            size="sm"
            onClick={toggleSidebar}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import VideoPlayer from "@/components/video-player";
import ModuleSidebar from "@/components/module-sidebar";
import LessonInfo from "@/components/lesson-info";
import courseData from "@/components/course-data";
import type { Module, Lesson } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, ChevronRight } from "lucide-react";

export default function LearningPlatform() {
  const { theme, setTheme } = useTheme();
  const [modules, setModules] = useState<Module[]>(courseData);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    courseData[0].lessons[0]
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleModule = (id: string) => {
    setModules(modules.map(m => (m.id === id ? { ...m, expanded: !m.expanded } : m)));
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const markLessonCompleted = (lessonId: string) => {
    setModules(prevModules =>
      prevModules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ),
      }))
    );
    if (currentLesson.id === lessonId) {
      setCurrentLesson(prev => ({ ...prev, completed: true }));
    }
  };

  const findNextLesson = (): Lesson | null => {
    for (let mi = 0; mi < modules.length; mi++) {
      const lessons = modules[mi].lessons;
      const li = lessons.findIndex(l => l.id === currentLesson.id);
      if (li !== -1) {
        if (li + 1 < lessons.length) return lessons[li + 1];
        if (mi + 1 < modules.length) return modules[mi + 1].lessons[0];
      }
    }
    return null;
  };

  const goToNextLesson = () => {
    markLessonCompleted(currentLesson.id);
    const next = findNextLesson();
    if (next) setCurrentLesson(next);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar}>
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
                <span className="text-sm text-muted-foreground tracking-tight">Autor: Filip Lendel</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {showSidebar && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />
        )}

        <div className="flex-1 min-w-0">
          <VideoPlayer
            lesson={currentLesson}
            onLessonComplete={() => markLessonCompleted(currentLesson.id)}
            onNextLesson={goToNextLesson}
          />
          <LessonInfo lesson={currentLesson} />
        </div>

        <ModuleSidebar
          modules={modules}
          currentLesson={currentLesson}
          showSidebar={showSidebar}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          toggleModule={toggleModule}
          selectLesson={selectLesson}
        />

        {!showSidebar && (
          <Button className="fixed top-1/2 right-4 z-20 shadow-lg hidden md:flex" size="sm" onClick={toggleSidebar}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

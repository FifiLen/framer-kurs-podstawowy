"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronRight, Clock, Video, CheckCircle, X } from "lucide-react"
import type { Module, Lesson } from "./types"

interface SidebarProps {
  modules: Module[]
  currentLesson: Lesson
  showSidebar: boolean
  isMobile: boolean
  toggleSidebar: () => void
  toggleModule: (id: string) => void
  selectLesson: (lesson: Lesson) => void
}

export default function ModuleSidebar({
  modules,
  currentLesson,
  showSidebar,
  isMobile,
  toggleSidebar,
  toggleModule,
  selectLesson
}: SidebarProps) {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  )

  return (
    <div
      className={`
          w-full md:w-96 bg-card border-l border-border flex flex-col
          ${showSidebar ? "translate-x-0" : "translate-x-full"}
          ${isMobile ? "fixed top-0 right-0 h-full z-50" : "relative"}
          transition-transform duration-300 ease-in-out
        `}
    >
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
        <h3 className="font-heading font-semibold text-foreground tracking-tight">ZAWARTOŚĆ KURSU</h3>
        <Button size="sm" variant="ghost" onClick={toggleSidebar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground tracking-tight">TWÓJ POSTĘP</span>
          <span className="text-sm font-bold text-foreground tracking-tight">
            {Math.round((completedLessons / totalLessons) * 100)}%
          </span>
        </div>
        <Progress value={(completedLessons / totalLessons) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span className="tracking-tight">
            {completedLessons} z {totalLessons} lekcji
          </span>
          <span className="tracking-tight">ukończone</span>
        </div>
      </div>

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
                  {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} • {module.duration}
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
                          ${currentLesson.id === lesson.id ? "bg-blue-50 border-r-2 border-blue-500 dark:bg-blue-950/30" : ""}
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
                        <span className="text-xs text-muted-foreground tracking-tight">{lesson.duration}</span>
                        {lesson.materials && lesson.materials.length > 0 && (
                          <Badge variant="outline" className="text-xs tracking-tight">
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
  )
}

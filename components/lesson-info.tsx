"use client"
import { Clock, CheckCircle, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Lesson } from "./types"

interface LessonInfoProps {
  lesson: Lesson
}

export default function LessonInfo({ lesson }: LessonInfoProps) {
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-500/10 text-red-500"
      case "doc":
        return "bg-blue-500/10 text-blue-500"
      case "zip":
        return "bg-green-500/10 text-green-500"
      case "fig":
        return "bg-purple-500/10 text-purple-500"
      default:
        return ""
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />
      case "doc":
        return <FileText className="w-5 h-5" />
      case "zip":
        return <FileText className="w-5 h-5" />
      case "fig":
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="p-4 md:p-6 bg-card">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2 tracking-tight">
        {lesson.title}
      </h2>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="tracking-tight">{lesson.duration}</span>
        </div>
        {lesson.completed && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="tracking-tight">Ukończone</span>
          </div>
        )}
      </div>

      {lesson.description && (
        <p className="text-muted-foreground mb-6 leading-relaxed tracking-tight">
          {lesson.description}
        </p>
      )}

      {lesson.materials && lesson.materials.length > 0 && (
        <div className="mt-6">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2 tracking-tight">
            <Download className="w-5 h-5" />
            Materiały do pobrania
          </h3>
          <div className="grid gap-3">
            {lesson.materials.map((material, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow bg-card/50">
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
                    <Badge variant="secondary" className={`text-xs tracking-tight ${getBadgeClass(material.type)}`}>
                      {material.type.toUpperCase()}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 ml-3 flex-shrink-0 tracking-tight">
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
  )
}

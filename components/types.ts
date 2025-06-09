export interface Material {
  name: string
  type: 'pdf' | 'doc' | 'zip' | 'fig'
  url: string
  size?: string
}

export interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  videoUrl: string
  materials?: Material[]
  description?: string
}

export interface Module {
  id: string
  title: string
  duration: string
  lessons: Lesson[]
  expanded: boolean
}

"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from "lucide-react"
import type { Lesson } from "./types"

interface VideoPlayerProps {
  lesson: Lesson
  onLessonComplete: () => void
  onNextLesson: () => void
}

export default function VideoPlayer({ lesson, onLessonComplete, onNextLesson }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showNext, setShowNext] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  const nextTimeoutRef = useRef<NodeJS.Timeout>()
  const countdownIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleResize = () => {
      setShowControls(true)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onLessonComplete()
      setShowNext(true)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("ended", handleEnded)
    }
  }, [lesson])

  useEffect(() => {
    if (showNext) {
      setCountdown(5)
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((c) => c - 1)
      }, 1000)
      nextTimeoutRef.current = setTimeout(() => {
        onNextLesson()
        setShowNext(false)
      }, 5000)
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current)
    }
  }, [showNext])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
    setShowNext(false)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume / 100
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, duration)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const changePlaybackRate = () => {
    const video = videoRef.current
    if (!video) return

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]

    video.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const goToNext = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current)
    setShowNext(false)
    onNextLesson()
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black aspect-video group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

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

      {showNext && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 flex-col gap-4">
          <Button size="lg" className="relative animate-pulse" onClick={goToNext}>
            Przejdź do następnego materiału ({countdown})
            <span
              className="absolute bottom-0 left-0 h-0.5 bg-white transition-all"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </Button>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-4">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

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
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="font-bold text-white">F</span>
      </div>
    </div>
  )
}

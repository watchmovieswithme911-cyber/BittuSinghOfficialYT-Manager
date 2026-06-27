import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Plus,
  Video,
  ExternalLink,
  Clock,
  Film,
  Edit3,
  CheckCircle2,
  PlayCircle,
  Trash2,
} from 'lucide-react'

interface VideoEntry {
  id: string
  title: string
  description?: string | null
  status: string
  tags?: string | null
  scheduledDate?: string | null
  publishedDate?: string | null
  youtubeUrl?: string | null
  views: number
  likes: number
  notes?: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  idea: { label: 'Idea', color: 'bg-purple-100 text-purple-700', icon: <Lightbulb className="h-3 w-3" /> },
  scripting: { label: 'Scripting', color: 'bg-blue-100 text-blue-700', icon: <Edit3 className="h-3 w-3" /> },
  filming: { label: 'Filming', color: 'bg-orange-100 text-orange-700', icon: <Film className="h-3 w-3" /> },
  editing: { label: 'Editing', color: 'bg-yellow-100 text-yellow-700', icon: <Edit3 className="h-3 w-3" /> },
  scheduled: { label: 'Scheduled', color: 'bg-cyan-100 text-cyan-700', icon: <Clock className="h-3 w-3" /> },
  published: { label: 'Published', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
}

const STATUSES = ['idea', 'scripting', 'filming', 'editing', 'scheduled', 'published']

function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function toLocalDate(dateStr: string) {
  return new Date(dateStr).toISOString().split('T')[0]
}

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function ContentCalendar() {
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'idea',
    tags: '',
    scheduledDate: '',
    youtubeUrl: '',
    notes: '',
  })

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setVideos(data.items ?? [])
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const createVideo = async () => {
    if (!form.title.trim()) return
    await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        tags: form.tags.trim() || null,
        scheduledDate: form.scheduledDate || null,
        youtubeUrl: form.youtubeUrl.trim() || null,
        notes: form.notes.trim() || null,
      }),
    })
    setForm({ title: '', description: '', status: 'idea', tags: '', scheduledDate: '', youtubeUrl: '', notes: '' })
    setDialogOpen(false)
    fetchVideos()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/videos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchVideos()
  }

  const deleteVideo = async (id: string) => {
    await fetch(`/api/videos/${id}`, { method: 'DELETE' })
    fetchVideos()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const videosByDay: Record<number, VideoEntry[]> = {}
  videos.forEach((v) => {
    if (v.scheduledDate) {
      const d = new Date(v.scheduledDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!videosByDay[day]) videosByDay[day] = []
        videosByDay[day].push(v)
      }
    }
  })

  const statusCounts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = videos.filter((v) => v.status === s).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            Content Calendar
          </h2>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your video production pipeline
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule a Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Video title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Video description..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="tech, tutorial, coding"
                />
              </div>
              <div>
                <Label>YouTube URL</Label>
                <Input
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Production notes..."
                  rows={2}
                />
              </div>
              <Button onClick={createVideo} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Video
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <Card key={s} className="py-3">
              <CardContent className="p-3 text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </div>
                <p className="text-2xl font-bold mt-1">{statusCounts[s] ?? 0}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
            >
              ← Prev
            </Button>
            <CardTitle>{monthLabel}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
            >
              Next →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayVideos = videosByDay[day] ?? []
              return (
                <div
                  key={day}
                  className={`p-2 rounded-lg min-h-[60px] text-left ${
                    dayVideos.length > 0
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="font-medium">{day}</span>
                  {dayVideos.slice(0, 2).map((v) => (
                    <div key={v.id} className="mt-1">
                      <Badge
                        className={`${STATUS_CONFIG[v.status]?.color ?? 'bg-slate-100 text-slate-700'} text-[10px] px-1 py-0 w-full justify-start truncate`}
                      >
                        {v.title}
                      </Badge>
                    </div>
                  ))}
                  {dayVideos.length > 2 && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      +{dayVideos.length - 2} more
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">All Videos</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 h-16" />
              </Card>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No videos yet. Click "Schedule Video" to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => {
              const cfg = STATUS_CONFIG[video.status] ?? STATUS_CONFIG.idea
              return (
                <Card key={video.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{video.title}</h4>
                          <Badge className={`${cfg.color} shrink-0`}>
                            {cfg.icon} {cfg.label}
                          </Badge>
                          {video.tags && (
                            <span className="text-xs text-muted-foreground hidden md:inline">
                              {video.tags}
                            </span>
                          )}
                        </div>
                        {video.scheduledDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📅 {formatMonth(video.scheduledDate)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {video.youtubeUrl && (
                          <Button size="sm" variant="ghost">
                            <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-inherit no-underline">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Select
                          value={video.status}
                          onValueChange={(v) => updateStatus(video.id, v)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_CONFIG[s].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-red-600"
                          onClick={() => deleteVideo(video.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

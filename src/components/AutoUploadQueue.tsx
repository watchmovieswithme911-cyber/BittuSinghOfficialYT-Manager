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
  Upload,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  Pause,
  RotateCw,
  ExternalLink,
  Zap,
  Globe,
  Music,
  ArrowUp,
  AlertCircle,
} from 'lucide-react'

interface UploadItem {
  id: string
  videoTitle: string
  genre?: string | null
  language?: string | null
  videoType?: string | null
  status: string
  scheduledTime?: string | null
  platform: string
  thumbnailUrl?: string | null
  youtubeUrl?: string | null
  views: number
  likes: number
  notes?: string | null
  createdAt: string
}

const UPLOAD_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-700', icon: <Clock className="h-3 w-3" /> },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
  { value: 'uploading', label: 'Uploading', color: 'bg-yellow-100 text-yellow-700', icon: <ArrowUp className="h-3 w-3" /> },
  { value: 'uploaded', label: 'Uploaded', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
]

const GENRES = [
  'Bass Boosted', 'Hindi Devotional', 'Punjabi Bhangra', 'English Trance',
  'Racing Motivation', 'Gym Workout', 'Bhojpuri Remix', 'English Rap',
  'Global Trance Remix', 'Desi Hip Hop', 'Spiritual Meditation',
  'Hindi Pop Remix', 'Punjabi Pop', 'Car Racing Bass', 'Gym Rep Music',
  'Devotional Fusion',
]

export default function AutoUploadQueue() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    videoTitle: '', genre: 'Bass Boosted', language: 'Global',
    videoType: 'lyrics', scheduledTime: '', platform: 'YouTube', notes: '',
  })

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/upload-queues')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch { /* empty */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const createItem = async () => {
    if (!form.videoTitle.trim()) return
    await fetch('/api/upload-queues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoTitle: form.videoTitle.trim(),
        genre: form.genre,
        language: form.language,
        videoType: form.videoType,
        scheduledTime: form.scheduledTime || null,
        platform: form.platform,
        notes: form.notes.trim() || null,
        status: 'pending',
      }),
    })
    setForm({ videoTitle: '', genre: 'Bass Boosted', language: 'Global', videoType: 'lyrics', scheduledTime: '', platform: 'YouTube', notes: '' })
    setDialogOpen(false)
    fetchItems()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/upload-queues/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchItems()
  }

  const deleteItem = async (id: string) => {
    await fetch(`/api/upload-queues/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)
  const statusCounts = UPLOAD_STATUSES.reduce((acc, s) => {
    acc[s.value] = items.filter(i => i.status === s.value).length
    return acc
  }, {} as Record<string, number>)

  const totalViews = items.reduce((a, i) => a + i.views, 0)
  const uploadedCount = items.filter(i => i.status === 'uploaded').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-500" />
            Auto Upload Queue
          </h2>
          <p className="text-muted-foreground mt-1">Automated upload pipeline — {items.length} videos in queue</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button><Plus className="h-4 w-4 mr-2" />Add to Queue</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Video to Upload Queue</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Video Title *</Label><Input value={form.videoTitle} onChange={e => setForm({ ...form, videoTitle: e.target.value })} placeholder="e.g. Bass Boosted Motivation Mix 2025" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Genre</Label>
                  <Select value={form.genre} onValueChange={v => setForm({ ...form, genre: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Language</Label>
                  <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['Hindi', 'English', 'Punjabi', 'Bhojpuri', 'Global'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Video Type</Label>
                  <Select value={form.videoType} onValueChange={v => setForm({ ...form, videoType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['lyrics', 'script', 'remix', 'compilation', 'original'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Platform</Label>
                  <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['YouTube', 'Instagram Reels', 'TikTok', 'Facebook', 'All Platforms'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Scheduled Upload Time</Label><Input type="datetime-local" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Special instructions..." /></div>
              <Button onClick={createItem} className="w-full"><Upload className="h-4 w-4 mr-2" />Add to Queue</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <Clock className="h-5 w-5 mx-auto text-slate-500 mb-1" />
          <p className="text-2xl font-bold">{statusCounts['pending'] ?? 0}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Loader2 className="h-5 w-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold">{(statusCounts['processing'] ?? 0) + (statusCounts['uploading'] ?? 0)}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <CheckCircle2 className="h-5 w-5 mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold">{uploadedCount}</p>
          <p className="text-xs text-muted-foreground">Uploaded</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Zap className="h-5 w-5 mx-auto text-orange-500 mb-1" />
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Views</p>
        </CardContent></Card>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          All <Badge variant="secondary" className="ml-1 text-xs">{items.length}</Badge>
        </Button>
        {UPLOAD_STATUSES.map(s => (
          <Button key={s.value} variant={filter === s.value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s.value)}>
            {s.icon} <span className="ml-1">{s.label}</span>
            <Badge variant="secondary" className="ml-1 text-xs">{statusCounts[s.value] ?? 0}</Badge>
          </Button>
        ))}
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-4 h-20" /></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Queue empty. Add videos to get started!</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const st = UPLOAD_STATUSES.find(s => s.value === item.status) ?? UPLOAD_STATUSES[0]
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium truncate">{item.videoTitle}</h4>
                        <Badge className={`${st.color} shrink-0`}>{st.icon} {st.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.genre && <Badge variant="secondary" className="text-xs"><Music className="h-3 w-3 mr-1" />{item.genre}</Badge>}
                        {item.language && <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1" />{item.language}</Badge>}
                        {item.scheduledTime && <span className="text-xs text-muted-foreground">📅 {new Date(item.scheduledTime).toLocaleString()}</span>}
                        <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                      </div>
                      {item.youtubeUrl && (
                        <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="h-3 w-3" />View on YouTube
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'processing')} className="text-blue-600">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {item.status === 'processing' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'uploading')} className="text-yellow-600">
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                      )}
                      {item.status === 'uploading' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'uploaded')} className="text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                        </Button>
                      )}
                      {item.status === 'failed' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'pending')} className="text-blue-600">
                          <RotateCw className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-600" onClick={() => deleteItem(item.id)}>
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
  )
}

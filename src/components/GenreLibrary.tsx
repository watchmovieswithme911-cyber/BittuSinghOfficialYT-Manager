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
  Music,
  Plus,
  Trash2,
  TrendingUp,
  Video,
  Globe,
  Zap,
  Disc3,
  Headphones,
} from 'lucide-react'

interface Genre {
  id: string
  name: string
  slug: string
  language: string
  description?: string | null
  bpmRange?: string | null
  mood?: string | null
  tags?: string | null
  iconEmoji: string
  colorHex: string
  videoCount: number
  avgViews: number
  isActive: boolean
  createdAt: string
}

const DEFAULT_GENRES = [
  { name: 'Bass Boosted', slug: 'bass-boosted', language: 'Global', iconEmoji: '🔊', colorHex: '#7c3aed', bpmRange: '128-160', mood: 'Energetic', tags: 'bass,boosted,bassboost,heavy' },
  { name: 'Hindi Devotional', slug: 'hindi-devotional', language: 'Hindi', iconEmoji: '🙏', colorHex: '#f59e0b', bpmRange: '70-110', mood: 'Peaceful', tags: 'bhajan,aarti,mandir,prayer' },
  { name: 'Punjabi Bhangra', slug: 'punjabi-bhangra', language: 'Punjabi', iconEmoji: '💃', colorHex: '#ef4444', bpmRange: '130-160', mood: 'Energetic', tags: 'bhangra,punjabi,desi,bhangra-remix' },
  { name: 'English Trance', slug: 'english-trance', language: 'English', iconEmoji: '🌀', colorHex: '#06b6d4', bpmRange: '128-150', mood: 'Euphoric', tags: 'trance,edm,psytrance,progressive' },
  { name: 'Racing Motivation', slug: 'racing-motivation', language: 'Global', iconEmoji: '🏎️', colorHex: '#dc2626', bpmRange: '140-180', mood: 'Adrenaline', tags: 'racing,car,motivation,drift,speed' },
  { name: 'Gym Workout', slug: 'gym-workout', language: 'Global', iconEmoji: '💪', colorHex: '#16a34a', bpmRange: '120-160', mood: 'Intense', tags: 'gym,workout,fitness,lifting,muscle' },
  { name: 'Bhojpuri Remix', slug: 'bhojpuri-remix', language: 'Bhojpuri', iconEmoji: '🎶', colorHex: '#ea580c', bpmRange: '120-140', mood: 'Celebratory', tags: 'bhojpuri,remix,desi,folk' },
  { name: 'English Rap Motivation', slug: 'english-rap-motivation', language: 'English', iconEmoji: '🎤', colorHex: '#1d4ed8', bpmRange: '80-120', mood: 'Powerful', tags: 'rap,hip-hop,motivation,lyrics' },
  { name: 'Global Trance Remix', slug: 'global-trance-remix', language: 'Global', iconEmoji: '🌍', colorHex: '#7c3aed', bpmRange: '130-155', mood: 'Hypnotic', tags: 'trance,remix,global,psy' },
  { name: 'Desi Hip Hop', slug: 'desi-hiphop', language: 'Hindi', iconEmoji: '🎧', colorHex: '#be185d', bpmRange: '85-115', mood: 'Raw', tags: 'desi,hiphop,rap,street,bollywood' },
  { name: 'Spiritual Meditation', slug: 'spiritual-meditation', language: 'Hindi', iconEmoji: '🕉️', colorHex: '#a855f7', bpmRange: '60-90', mood: 'Meditative', tags: 'meditation,spiritual,om,yoga,calm' },
  { name: 'Hindi Pop Remix', slug: 'hindi-pop-remix', language: 'Hindi', iconEmoji: '🎵', colorHex: '#e11d48', bpmRange: '110-135', mood: 'Fun', tags: 'hindi,pop,remix,bollywood,party' },
  { name: 'Punjabi Pop', slug: 'punjabi-pop', language: 'Punjabi', iconEmoji: '🎸', colorHex: '#f97316', bpmRange: '100-130', mood: 'Vibrant', tags: 'punjabi,pop,punjabi-pop,desi' },
  { name: 'Car Racing Bass', slug: 'car-racing-bass', language: 'Global', iconEmoji: '🏁', colorHex: '#0f172a', bpmRange: '140-180', mood: 'Aggressive', tags: 'racing,car,bass,drift,speed,v8' },
  { name: 'Gym Rep Music', slug: 'gym-rep-music', language: 'Global', iconEmoji: '🏋️', colorHex: '#059669', bpmRange: '130-170', mood: 'Maximum', tags: 'gym,rep,sets,power,energy' },
  { name: 'Devotional Fusion', slug: 'devotional-fusion', language: 'Global', iconEmoji: '✨', colorHex: '#d97706', bpmRange: '80-120', mood: 'Uplifting', tags: 'devotional,fusion,sacred,spiritual' },
]

export default function GenreLibrary() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLang, setFilterLang] = useState('all')
  const [form, setForm] = useState({
    name: '', slug: '', language: 'Hindi', description: '',
    bpmRange: '', mood: '', tags: '', iconEmoji: '🎵', colorHex: '#e11d48',
  })

  const fetchGenres = useCallback(async () => {
    try {
      const res = await fetch('/api/genres')
      const data = await res.json()
      setGenres(data.items ?? [])
    } catch { /* empty */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchGenres() }, [fetchGenres])

  const seedDefaultGenres = async () => {
    for (const g of DEFAULT_GENRES) {
      await fetch('/api/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...g, isActive: true }),
      })
    }
    fetchGenres()
  }

  const createGenre = async () => {
    if (!form.name.trim()) return
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await fetch('/api/genres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug, name: form.name.trim() }),
    })
    setForm({ name: '', slug: '', language: 'Hindi', description: '', bpmRange: '', mood: '', tags: '', iconEmoji: '🎵', colorHex: '#e11d48' })
    setDialogOpen(false)
    fetchGenres()
  }

  const deleteGenre = async (id: string) => {
    await fetch(`/api/genres/${id}`, { method: 'DELETE' })
    fetchGenres()
  }

  const languages = [...new Set(genres.map(g => g.language))]

  const filtered = genres.filter(g => {
    if (filterLang !== 'all' && g.language !== filterLang) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return g.name.toLowerCase().includes(q) || g.tags?.toLowerCase().includes(q) || g.mood?.toLowerCase().includes(q)
    }
    return true
  })

  const totalVideos = genres.reduce((a, g) => a + g.videoCount, 0)
  const topGenre = [...genres].sort((a, b) => b.videoCount - a.videoCount)[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-500" />
            Genre Library
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your music genres — {genres.length} genres across {languages.length} languages
          </p>
        </div>
        <div className="flex gap-2">
          {genres.length === 0 && (
            <Button variant="outline" onClick={seedDefaultGenres}>
              <Zap className="h-4 w-4 mr-2" />
              Load Default Genres
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button><Plus className="h-4 w-4 mr-2" />Add Genre</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add New Genre</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Genre Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bass Boosted" /></div>
                  <div><Label>Language</Label>
                    <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Hindi', 'English', 'Punjabi', 'Bhojpuri', 'Global', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Genre description..." rows={2} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>BPM Range</Label><Input value={form.bpmRange} onChange={e => setForm({ ...form, bpmRange: e.target.value })} placeholder="120-160" /></div>
                  <div><Label>Mood</Label><Input value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} placeholder="Energetic" /></div>
                  <div><Label>Icon</Label><Input value={form.iconEmoji} onChange={e => setForm({ ...form, iconEmoji: e.target.value })} placeholder="🎵" /></div>
                </div>
                <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="bass,boosted,heavy" /></div>
                <div><Label>Color</Label><div className="flex gap-2 items-center"><Input type="color" value={form.colorHex} onChange={e => setForm({ ...form, colorHex: e.target.value })} className="w-16 h-10 p-1" /><Input value={form.colorHex} onChange={e => setForm({ ...form, colorHex: e.target.value })} className="flex-1" /></div></div>
                <Button onClick={createGenre} className="w-full"><Music className="h-4 w-4 mr-2" />Add Genre</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <Disc3 className="h-5 w-5 mx-auto text-purple-500 mb-1" />
          <p className="text-2xl font-bold">{genres.length}</p>
          <p className="text-xs text-muted-foreground">Genres</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Globe className="h-5 w-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold">{languages.length}</p>
          <p className="text-xs text-muted-foreground">Languages</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Video className="h-5 w-5 mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold">{totalVideos}</p>
          <p className="text-xs text-muted-foreground">Total Videos</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <TrendingUp className="h-5 w-5 mx-auto text-orange-500 mb-1" />
          <p className="text-2xl font-bold truncate">{topGenre?.name ?? '—'}</p>
          <p className="text-xs text-muted-foreground">Top Genre</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input placeholder="Search genres, tags, moods..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64" />
        <Select value={filterLang} onValueChange={setFilterLang}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Languages" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Genre Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-6 h-36" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No genres found. {genres.length === 0 ? 'Click "Load Default Genres" to start!' : 'Try adjusting your search.'}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(g => (
            <Card key={g.id} className="hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: g.colorHex }} />
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{g.iconEmoji}</span>
                    <div>
                      <CardTitle className="text-sm leading-tight">{g.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{g.language}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteGenre(g.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {g.description && <p className="text-xs text-muted-foreground line-clamp-2">{g.description}</p>}
                <div className="flex flex-wrap gap-1">
                  {g.mood && <Badge variant="outline" className="text-[10px]">{g.mood}</Badge>}
                  {g.bpmRange && <Badge variant="outline" className="text-[10px]">BPM {g.bpmRange}</Badge>}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{g.videoCount} videos</span>
                  <span>{g.avgViews.toLocaleString()} avg views</span>
                </div>
                {g.tags && (
                  <div className="flex flex-wrap gap-1">
                    {g.tags.split(',').slice(0, 4).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

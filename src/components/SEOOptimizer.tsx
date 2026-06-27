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
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  TrendingUp,
  Hash,
  Tag,
  Type,
  BarChart,
  Sparkles,
} from 'lucide-react'

interface SEOEntry {
  id: string
  videoTitle: string
  genre?: string | null
  language: string
  content: string
  videoType: string
  tags?: string | null
  status: string
  createdAt: string
}

const SEO_TIPS: Record<string, string[]> = {
  'Bass Boosted': ['Add "bass boosted" in title', 'Use #bassboosted #bass #heavybass', 'Mention "1 hour" or "8D audio" for retention', 'Use 🔊 emoji in title for CTR'],
  'Punjabi Bhangra': ['Add year (2024/2025) in title', 'Use #punjabi #bhangra #desi', 'Include artist names for search', 'Add "official" for credibility'],
  'English Trance': ['Use BPM in title (138 BPM)', 'Use #trance #psytrance #edm', 'Mention "remix" or "mix"', 'Include DJ/producer tags'],
  'Hindi Devotional': ['Add deity name in title', 'Use #bhajan #aarti #mandir', 'Include "24/7" for loop plays', 'Add "hindi" explicitly'],
  'Gym Workout': ['Use "workout motivation" in title', 'Add "no copyright" for reuse', 'Mention exercise type', 'Use #gym #fitness #workout'],
  default: ['Research trending keywords', 'Use 3-5 hashtags maximum', 'Add relevant emojis to title', 'Include year for freshness'],
}

const GENRES_FOR_SEO = [
  'Bass Boosted', 'Hindi Devotional', 'Punjabi Bhangra', 'English Trance',
  'Racing Motivation', 'Gym Workout', 'Bhojpuri Remix', 'English Rap',
  'Global Trance Remix', 'Desi Hip Hop', 'Spiritual Meditation',
  'Hindi Pop Remix', 'Punjabi Pop', 'Car Racing Bass', 'Gym Rep Music',
  'Devotional Fusion',
]

function generateSEOTitle(genre: string, videoType: string): string {
  const templates: Record<string, string[]> = {
    'Bass Boosted': ['🔊 {genre} | Maximum Bass Experience {year}', '{genre} Mix - Heavy Bass Non Stop {year}', 'Insane {genre} 🔊 Bass Boosted to the MAX'],
    'Punjabi Bhangra': ['🎶 {genre} | New Punjabi Hits {year}', '{genre} Official Remix - DJ Mix {year}', 'Best of {genre} 🔥 Desi Vibes'],
    'English Trance': ['🌀 {genre} | Epic Trance Mix {year}', '{genre} — Deep Trance Experience', 'Ultimate {genre} Mix 🌀 140 BPM'],
    'Hindi Devotional': ['🙏 {genre} | Sacred Bhajans Collection', '{genre} | Morning Prayers 24/7', 'Divine {genre} 🙏 Peaceful Meditations'],
    'Gym Workout': ['💪 {genre} | Beast Mode Activated', '{genre} Mix — Maximum Reps Music', 'Ultimate {genre} 💪 Gym Motivation {year}'],
    'Racing Motivation': ['🏎️ {genre} | Adrenaline Rush', '{genre} Mix — Pure Speed Energy', 'Insane {genre} 🏁 Drift & Race Music'],
    'default': ['🎵 {genre} | {videoType} Video {year}', '{genre} — {videoType} Mix {year}', 'Best {genre} {year} 🔥'],
  }
  const tpls = templates[genre] || templates['default']
  const tpl = tpls[Math.floor(Math.random() * tpls.length)]
  return tpl.replace('{genre}', genre).replace('{videoType}', videoType).replace('{year}', String(new Date().getFullYear()))
}

function generateSEOTags(genre: string): string {
  const base: Record<string, string> = {
    'Bass Boosted': 'bass boosted, bass, heavy bass, bassboost, subwoofer, 8d audio, bass test, deep bass',
    'Punjabi Bhangra': 'punjabi, bhangra, punjabi songs, desi, punjabi music, bhangra remix, new punjabi',
    'English Trance': 'trance, psytrance, edm, electronic, progressive trance, trance music, dj mix',
    'Hindi Devotional': 'bhajan, aarti, mandir, prayer, hindi devotional, god, temple, spiritual',
    'Gym Workout': 'gym, workout, fitness, motivation, exercise, muscle, power, energy',
    'Racing Motivation': 'racing, car, motivation, speed, drift, adrenaline, racing music',
    'Bhojpuri Remix': 'bhojpuri, bhojpuri song, bhojpuri remix, desi, folk, bhojpuri hit',
    'default': genre.toLowerCase() + ', music, mix, {year}, trending, viral',
  }
  return (base[genre] || base['default']).replace('{year}', String(new Date().getFullYear()))
}

function generateSEODescription(genre: string): string {
  return `🎵 ${genre} Collection by BittuSinghOfficialYT

Welcome to the ultimate ${genre} experience! This video features the best ${genre} music curated for maximum entertainment.

📌 What's in this video:
✅ Best ${genre} tracks mixed to perfection
✅ High quality audio & visuals
✅ Non-stop entertainment

🔥 Subscribe for more: https://youtube.com/@BittuSinghOfficialYT

📱 Follow BittuSinghOfficialYT:
🎵 YouTube: https://youtube.com/@BittuSinghOfficialYT

#${genre.replace(/\s+/g, '')} #Music #BittuSinghOfficialYT #Viral #Trending`
}

export default function SEOOptimizer() {
  const [seoEntries, setSeoEntries] = useState<SEOEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState('Bass Boosted')
  const [generatedSEO, setGeneratedSEO] = useState({ title: '', tags: '', description: '' })
  const [form, setForm] = useState({ videoTitle: '', genre: 'Bass Boosted', language: 'Hindi', videoType: 'lyrics' })

  const fetchSEO = useCallback(async () => {
    try {
      const res = await fetch('/api/content-scripts')
      const data = await res.json()
      const items = (data.items ?? []).filter((s: SEOEntry) => s.videoType === 'seo')
      setSeoEntries(items)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchSEO() }, [fetchSEO])

  const generateSEO = (genre: string) => {
    setSelectedGenre(genre)
    setGeneratedSEO({
      title: generateSEOTitle(genre, form.videoType || 'mix'),
      tags: generateSEOTags(genre),
      description: generateSEODescription(genre),
    })
  }

  const saveSEO = async () => {
    if (!form.videoTitle.trim()) return
    await fetch('/api/content-scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoTitle: form.videoTitle.trim(),
        videoType: 'seo',
        genre: form.genre,
        language: form.language,
        content: `TITLE: ${generatedSEO.title}\n\nTAGS: ${generatedSEO.tags}\n\nDESCRIPTION:\n${generatedSEO.description}`,
        tags: generatedSEO.tags,
        status: 'ready',
      }),
    })
    setForm({ videoTitle: '', genre: 'Bass Boosted', language: 'Hindi', videoType: 'lyrics' })
    setGeneratedSEO({ title: '', tags: '', description: '' })
    setDialogOpen(false)
    fetchSEO()
  }

  const deleteSEO = async (id: string) => {
    await fetch(`/api/content-scripts/${id}`, { method: 'DELETE' })
    fetchSEO()
  }

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-500" />
            SEO Optimizer
          </h2>
          <p className="text-muted-foreground mt-1">Generate optimized titles, tags & descriptions for every genre</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button><Plus className="h-4 w-4 mr-2" />Generate SEO</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Generate SEO Content</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Video Title *</Label><Input value={form.videoTitle} onChange={e => setForm({ ...form, videoTitle: e.target.value })} placeholder="Enter video title..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Genre</Label>
                  <Select value={form.genre} onValueChange={v => { setForm({ ...form, genre: v }); generateSEO(v) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{GENRES_FOR_SEO.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Language</Label>
                  <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['Hindi', 'English', 'Punjabi', 'Bhojpuri', 'Global'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => generateSEO(form.genre)} type="button">
                <Sparkles className="h-4 w-4 mr-2" />Generate SEO for {form.genre}
              </Button>

              {generatedSEO.title && (
                <div className="space-y-3 border rounded-lg p-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="flex items-center gap-1"><Type className="h-3 w-3" />Title</Label>
                      <Button size="sm" variant="ghost" onClick={() => copyText('title', generatedSEO.title)}>
                        {copiedField === 'title' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Input value={generatedSEO.title} onChange={e => setGeneratedSEO({ ...generatedSEO, title: e.target.value })} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="flex items-center gap-1"><Tag className="h-3 w-3" />Tags</Label>
                      <Button size="sm" variant="ghost" onClick={() => copyText('tags', generatedSEO.tags)}>
                        {copiedField === 'tags' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Textarea value={generatedSEO.tags} onChange={e => setGeneratedSEO({ ...generatedSEO, tags: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="flex items-center gap-1"><BarChart className="h-3 w-3" />Description</Label>
                      <Button size="sm" variant="ghost" onClick={() => copyText('desc', generatedSEO.description)}>
                        {copiedField === 'desc' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Textarea value={generatedSEO.description} onChange={e => setGeneratedSEO({ ...generatedSEO, description: e.target.value })} rows={8} />
                  </div>
                  <Button onClick={saveSEO} className="w-full"><Sparkles className="h-4 w-4 mr-2" />Save SEO Package</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEO Tips by Genre */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />SEO Tips for {selectedGenre}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(SEO_TIPS[selectedGenre] || SEO_TIPS['default']).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Badge variant="outline" className="shrink-0 text-xs">{i + 1}</Badge>
                <span>{tip}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {GENRES_FOR_SEO.slice(0, 8).map(g => (
              <Button key={g} size="sm" variant={selectedGenre === g ? 'default' : 'outline'} onClick={() => { setSelectedGenre(g); generateSEO(g) }}>
                {g}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved SEO Entries */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Saved SEO Packages</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-4 h-16" /></Card>)}</div>
        ) : seoEntries.length === 0 ? (
          <Card><CardContent className="p-8 text-center"><Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-muted-foreground text-sm">No SEO packages yet. Generate one!</p></CardContent></Card>
        ) : (
          <div className="space-y-3">
            {seoEntries.map(seo => (
              <Card key={seo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{seo.videoTitle}</h4>
                      <div className="flex gap-2 mt-1">
                        {seo.genre && <Badge variant="secondary" className="text-xs">{seo.genre}</Badge>}
                        <Badge variant="outline" className="text-xs">{seo.language}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => copyText(seo.id, seo.content)}>
                        {copiedField === seo.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-600" onClick={() => deleteSEO(seo.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

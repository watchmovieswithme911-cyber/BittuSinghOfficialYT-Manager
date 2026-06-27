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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Music,
  Mic,
  Video,
  Globe,
  Type,
  Clock,
} from 'lucide-react'

interface ContentScript {
  id: string
  videoTitle: string
  videoType: string
  genre?: string | null
  language: string
  content: string
  tags?: string | null
  duration?: string | null
  mood?: string | null
  status: string
  createdAt: string
}

const VIDEO_TYPES = [
  { value: 'lyrics', label: '🎵 Lyrics Video', icon: <Music className="h-3 w-3" /> },
  { value: 'script', label: '📝 Video Script', icon: <FileText className="h-3 w-3" /> },
  { value: 'description', label: '📺 Video Description', icon: <Video className="h-3 w-3" /> },
  { value: 'seo', label: '🔍 SEO Content', icon: <Globe className="h-3 w-3" /> },
  { value: 'intro', label: '🎬 Intro Script', icon: <Mic className="h-3 w-3" /> },
  { value: 'outro', label: '👋 Outro Script', icon: <Type className="h-3 w-3" /> },
]

const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Bhojpuri', 'Global', 'Hinglish']

const SCRIPT_TEMPLATES: Record<string, Record<string, string>> = {
  lyrics: {
    Hindi: `[Verse 1]\n\n[Lines here]\n\n[Chorus]\n\n[Hook - repeat]\n\n[Verse 2]\n\n[Bridge]\n\n[Final Chorus]\n\n[Outro]`,
    English: `[Verse 1]\n\n[Lines here]\n\n[Chorus]\n\n[Hook - repeat]\n\n[Verse 2]\n\n[Bridge]\n\n[Final Chorus]\n\n[Outro]`,
    Punjabi: `[Verse 1 - Punjabi]\n\n[Lines here]\n\n[Chorus - High Energy]\n\n[Hook]\n\n[Verse 2 - Punjabi]\n\n[Bhangra Beat Drop]\n\n[Final Chorus]\n\n[Outro]`,
    Bhojpuri: `[Intro - Bhojpuri Hook]\n\n[Verse 1]\n\n[Chorus]\n\n[Hook]\n\n[Verse 2]\n\n[Bridge]\n\n[Final Chorus]\n\n[Outro]`,
    Global: `[Verse 1]\n\n[Lines here]\n\n[Chorus]\n\n[Drop]\n\n[Verse 2]\n\n[Bridge]\n\n[Final Chorus]\n\n[Outro]`,
    Hinglish: `[Verse 1 - Hinglish Mix]\n\n[Lines here]\n\n[Chorus]\n\n[Hook]\n\n[Verse 2]\n\n[Bridge]\n\n[Final Chorus]\n\n[Outro]`,
  },
  script: {
    Hindi: `🎬 INTRO (0:00 - 0:15)\n- Hook line / attention grabber\n- Channel intro: "Welcome to BittuSinghOfficialYT!"\n\n📍 MAIN CONTENT (0:15 - 3:00)\n- Section 1: Point / Lyric explanation\n- Section 2: Story behind the music\n- Section 3: Key message / emotion\n\n🔥 CLIMAX (3:00 - 3:45)\n- Peak moment / best drop / emotional climax\n\n👋 OUTRO (3:45 - 4:00)\n- "Like, Share & Subscribe!"\n- Next video teaser`,
    English: `🎬 INTRO (0:00 - 0:15)\n- Hook line / attention grabber\n- Channel intro: "Welcome to BittuSinghOfficialYT!"\n\n📍 MAIN CONTENT (0:15 - 3:00)\n- Section 1: Main point / Story\n- Section 2: Deep dive / Details\n- Section 3: Key takeaways\n\n🔥 CLIMAX (3:00 - 3:45)\n- Peak moment / Impact section\n\n👋 OUTRO (3:45 - 4:00)\n- "Like, Share & Subscribe!"\n- Next video teaser`,
    default: `🎬 INTRO (0:00 - 0:15)\n- Hook line / attention grabber\n- Channel intro\n\n📍 MAIN CONTENT (0:15 - X:XX)\n- Core content here\n\n🔥 KEY MOMENT\n- Peak / Climax\n\n👋 OUTRO\n- CTA: Like, Share, Subscribe!`,
  },
}

function getTemplate(videoType: string, language: string): string {
  if (SCRIPT_TEMPLATES[videoType]) {
    return SCRIPT_TEMPLATES[videoType][language] || SCRIPT_TEMPLATES[videoType]['Hindi'] || SCRIPT_TEMPLATES[videoType]['Global'] || SCRIPT_TEMPLATES['script']['default']
  }
  return ''
}

export default function ScriptGenerator() {
  const [scripts, setScripts] = useState<ContentScript[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [form, setForm] = useState({
    videoTitle: '', videoType: 'lyrics', genre: '', language: 'Hindi',
    content: '', tags: '', duration: '', mood: '', status: 'draft',
  })

  const fetchScripts = useCallback(async () => {
    try {
      const res = await fetch('/api/content-scripts')
      const data = await res.json()
      setScripts(data.items ?? [])
    } catch { /* empty */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchScripts() }, [fetchScripts])

  const applyTemplate = () => {
    const tpl = getTemplate(form.videoType, form.language)
    setForm({ ...form, content: tpl })
  }

  const createScript = async () => {
    if (!form.videoTitle.trim() || !form.content.trim()) return
    await fetch('/api/content-scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoTitle: form.videoTitle.trim(),
        videoType: form.videoType,
        genre: form.genre.trim() || null,
        language: form.language,
        content: form.content.trim(),
        tags: form.tags.trim() || null,
        duration: form.duration.trim() || null,
        mood: form.mood.trim() || null,
        status: form.status,
      }),
    })
    setForm({ videoTitle: '', videoType: 'lyrics', genre: '', language: 'Hindi', content: '', tags: '', duration: '', mood: '', status: 'draft' })
    setDialogOpen(false)
    fetchScripts()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/content-scripts/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchScripts()
  }

  const deleteScript = async (id: string) => {
    await fetch(`/api/content-scripts/${id}`, { method: 'DELETE' })
    fetchScripts()
  }

  const copyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = activeTab === 'all' ? scripts : scripts.filter(s => s.videoType === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Script Generator
          </h2>
          <p className="text-muted-foreground mt-1">AI-powered scripts, lyrics, descriptions & SEO for every genre</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button><Plus className="h-4 w-4 mr-2" />New Script</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Script</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Video Title *</Label><Input value={form.videoTitle} onChange={e => setForm({ ...form, videoTitle: e.target.value })} placeholder="e.g. Bass Boosted Motivation Mix" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Script Type</Label>
                  <Select value={form.videoType} onValueChange={v => setForm({ ...form, videoType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{VIDEO_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Language</Label>
                  <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Genre</Label><Input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Bass Boosted" /></div>
                <div><Label>Mood</Label><Input value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} placeholder="Energetic" /></div>
                <div><Label>Duration</Label><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="4:30" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Content *</Label>
                  <Button variant="outline" size="sm" onClick={applyTemplate} type="button">
                    <Sparkles className="h-3 w-3 mr-1" />Load Template
                  </Button>
                </div>
                <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your script here, or click 'Load Template' to start with a pre-filled structure..." rows={12} className="font-mono text-sm" />
              </div>
              <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="bass,boosted,motivation" /></div>
              <Button onClick={createScript} className="w-full"><Sparkles className="h-4 w-4 mr-2" />Save Script</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          {VIDEO_TYPES.map(t => <TabsTrigger key={t.value} value={t.value}>{t.icon} <span className="hidden md:inline ml-1">{t.value}</span></TabsTrigger>)}
        </TabsList>
      </Tabs>

      {/* Scripts List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-6 h-24" /></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No scripts yet. Click "New Script" to get started!</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => {
            const typeInfo = VIDEO_TYPES.find(t => t.value === s.videoType)
            return (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{s.videoTitle}</CardTitle>
                      <Badge variant="outline" className="text-xs">{typeInfo?.label ?? s.videoType}</Badge>
                      <Badge variant="secondary" className="text-xs"><Globe className="h-3 w-3 mr-1" />{s.language}</Badge>
                      {s.genre && <Badge variant="secondary" className="text-xs"><Music className="h-3 w-3 mr-1" />{s.genre}</Badge>}
                    </div>
                    <Badge className={s.status === 'ready' ? 'bg-green-100 text-green-700' : s.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                      {s.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{s.content}</pre>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {s.tags && <span className="text-xs text-muted-foreground">🏷️ {s.tags}</span>}
                      {s.duration && <span className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{s.duration}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" onClick={() => copyContent(s.id, s.content)}>
                        {copiedId === s.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      {s.status === 'draft' && <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, 'ready')} className="text-green-600">Mark Ready</Button>}
                      {s.status === 'ready' && <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, 'published')} className="text-blue-600">Publish</Button>}
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-600" onClick={() => deleteScript(s.id)}>
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

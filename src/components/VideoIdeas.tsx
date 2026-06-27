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
  Lightbulb,
  Plus,
  Check,
  X,
  Clock,
  Flame,
  ArrowUp,
  Trash2,
  Zap,
} from 'lucide-react'

interface VideoIdea {
  id: string
  title: string
  description?: string | null
  category?: string | null
  priority: number
  estimatedEffort: string
  status: string
  createdAt: string
}

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Low', color: 'bg-slate-100 text-slate-700' },
  2: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  3: { label: 'High', color: 'bg-yellow-100 text-yellow-700' },
  4: { label: 'Urgent', color: 'bg-orange-100 text-orange-700' },
  5: { label: 'Top', color: 'bg-red-100 text-red-700' },
}

const EFFORT_ICONS: Record<string, string> = {
  short: '⚡ Short',
  medium: '🎬 Medium',
  long: '🎥 Long',
}

export default function VideoIdeas() {
  const [ideas, setIdeas] = useState<VideoIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '3',
    estimatedEffort: 'medium',
  })

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch('/api/video-ideas')
      const data = await res.json()
      setIdeas(data.items ?? [])
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const createIdea = async () => {
    if (!form.title.trim()) return
    await fetch('/api/video-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        priority: parseInt(form.priority),
        estimatedEffort: form.estimatedEffort,
        status: 'new',
      }),
    })
    setForm({ title: '', description: '', category: '', priority: '3', estimatedEffort: 'medium' })
    setDialogOpen(false)
    fetchIdeas()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/video-ideas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchIdeas()
  }

  const deleteIdea = async (id: string) => {
    await fetch(`/api/video-ideas/${id}`, { method: 'DELETE' })
    fetchIdeas()
  }

  const filtered = ideas.filter((i) => {
    if (filter === 'all') return true
    return i.status === filter
  })

  const statusCounts = {
    all: ideas.length,
    new: ideas.filter((i) => i.status === 'new').length,
    approved: ideas.filter((i) => i.status === 'approved').length,
    rejected: ideas.filter((i) => i.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Video Ideas
          </h2>
          <p className="text-muted-foreground mt-1">
            Brainstorm, prioritize, and manage your content pipeline
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Video Idea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. My Top 10 Coding Tips"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief outline of the video..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Tech, Vlog"
                  />
                </div>
                <div>
                  <Label>Effort</Label>
                  <Select
                    value={form.estimatedEffort}
                    onValueChange={(v) => setForm({ ...form, estimatedEffort: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">⚡ Short</SelectItem>
                      <SelectItem value="medium">🎬 Medium</SelectItem>
                      <SelectItem value="long">🎥 Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 — Low</SelectItem>
                    <SelectItem value="2">2 — Medium</SelectItem>
                    <SelectItem value="3">3 — High</SelectItem>
                    <SelectItem value="4">4 — Urgent</SelectItem>
                    <SelectItem value="5">5 — Top Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createIdea} className="w-full">
                <Lightbulb className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'new', 'approved', 'rejected'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <Badge variant="secondary" className="ml-2 text-xs">
              {statusCounts[f]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'No ideas yet. Click "New Idea" to get started!'
                : `No ${filter} ideas found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered
            .sort((a, b) => b.priority - a.priority)
            .map((idea) => {
              const p = PRIORITY_LABELS[idea.priority] ?? PRIORITY_LABELS[3]
              return (
                <Card
                  key={idea.id}
                  className="hover:shadow-md transition-shadow relative group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base leading-tight">
                        {idea.title}
                      </CardTitle>
                      <Badge className={`${p.color} shrink-0`}>{p.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {idea.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {idea.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {idea.category && (
                        <Badge variant="outline">{idea.category}</Badge>
                      )}
                      <span>{EFFORT_ICONS[idea.estimatedEffort] ?? idea.estimatedEffort}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      {idea.status === 'new' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-green-600"
                            onClick={() => updateStatus(idea.id, 'approved')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600"
                            onClick={() => updateStatus(idea.id, 'rejected')}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {idea.status === 'approved' && (
                        <Badge className="bg-green-100 text-green-700 w-full justify-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Approved — Ready to Produce
                        </Badge>
                      )}
                      {idea.status === 'rejected' && (
                        <Badge className="bg-slate-100 text-slate-500 w-full justify-center">
                          Rejected
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-600 shrink-0"
                        onClick={() => deleteIdea(idea.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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

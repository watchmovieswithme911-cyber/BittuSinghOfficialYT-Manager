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
  MessageSquare,
  Plus,
  ThumbsUp,
  Meh,
  ThumbsDown,
  CheckCircle2,
  Archive,
  Reply,
  Trash2,
  Filter,
} from 'lucide-react'

interface Comment {
  id: string
  videoTitle: string
  author: string
  content: string
  sentiment: string
  status: string
  publishedAt?: string | null
  createdAt: string
}

const SENTIMENT_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  positive: {
    label: 'Positive',
    color: 'bg-green-100 text-green-700',
    icon: <ThumbsUp className="h-3 w-3" />,
  },
  neutral: {
    label: 'Neutral',
    color: 'bg-slate-100 text-slate-700',
    icon: <Meh className="h-3 w-3" />,
  },
  negative: {
    label: 'Negative',
    color: 'bg-red-100 text-red-700',
    icon: <ThumbsDown className="h-3 w-3" />,
  },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new: {
    label: 'New',
    color: 'bg-blue-100 text-blue-700',
    icon: <MessageSquare className="h-3 w-3" />,
  },
  responded: {
    label: 'Responded',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  archived: {
    label: 'Archived',
    color: 'bg-slate-100 text-slate-500',
    icon: <Archive className="h-3 w-3" />,
  },
}

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState({
    videoTitle: '',
    author: '',
    content: '',
    sentiment: 'neutral',
  })

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch('/api/comments')
      const data = await res.json()
      setComments(data.items ?? [])
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const createComment = async () => {
    if (!form.content.trim() || !form.author.trim()) return
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoTitle: form.videoTitle.trim() || 'Unknown Video',
        author: form.author.trim(),
        content: form.content.trim(),
        sentiment: form.sentiment,
        status: 'new',
      }),
    })
    setForm({ videoTitle: '', author: '', content: '', sentiment: 'neutral' })
    setDialogOpen(false)
    fetchComments()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchComments()
  }

  const deleteComment = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    fetchComments()
  }

  const filtered = comments.filter((c) => {
    if (sentimentFilter !== 'all' && c.sentiment !== sentimentFilter) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    return true
  })

  const sentimentCounts = {
    all: comments.length,
    positive: comments.filter((c) => c.sentiment === 'positive').length,
    neutral: comments.filter((c) => c.sentiment === 'neutral').length,
    negative: comments.filter((c) => c.sentiment === 'negative').length,
  }

  const statusCounts = {
    all: comments.length,
    new: comments.filter((c) => c.status === 'new').length,
    responded: comments.filter((c) => c.status === 'responded').length,
    archived: comments.filter((c) => c.status === 'archived').length,
  }

  function timeAgo(dateStr: string) {
    const now = new Date()
    const d = new Date(dateStr)
    const diffMs = now.getTime() - d.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-violet-500" />
            Comment Manager
          </h2>
          <p className="text-muted-foreground mt-1">
            Track, respond to, and moderate comments across your videos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Video Title</Label>
                <Input
                  value={form.videoTitle}
                  onChange={(e) => setForm({ ...form, videoTitle: e.target.value })}
                  placeholder="Which video is this comment on?"
                />
              </div>
              <div>
                <Label>Author *</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Commenter's name"
                />
              </div>
              <div>
                <Label>Comment *</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Comment content..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Sentiment</Label>
                <Select
                  value={form.sentiment}
                  onValueChange={(v) => setForm({ ...form, sentiment: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">👍 Positive</SelectItem>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                    <SelectItem value="negative">👎 Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createComment} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['positive', 'neutral', 'negative'] as const).map((s) => {
          const cfg = SENTIMENT_CONFIG[s]
          return (
            <Card
              key={s}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                sentimentFilter === s ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSentimentFilter(sentimentFilter === s ? 'all' : s)}
            >
              <CardContent className="p-3 text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </div>
                <p className="text-xl font-bold mt-1">{sentimentCounts[s]}</p>
              </CardContent>
            </Card>
          )
        })}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSentimentFilter('all')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold mt-1">{sentimentCounts.all}</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Status:</span>
        {(['all', 'new', 'responded', 'archived'] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <Badge variant="secondary" className="ml-1 text-xs">
              {statusCounts[s]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {comments.length === 0
                ? 'No comments tracked yet. Click "Add Comment" to get started!'
                : 'No comments match your filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => {
            const sentCfg = SENTIMENT_CONFIG[comment.sentiment] ?? SENTIMENT_CONFIG.neutral
            const statCfg = STATUS_CONFIG[comment.status] ?? STATUS_CONFIG.new
            return (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{comment.author}</span>
                        <Badge className={`${sentCfg.color}`}>
                          {sentCfg.icon} {sentCfg.label}
                        </Badge>
                        <Badge className={`${statCfg.color}`}>
                          {statCfg.icon} {statCfg.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          on "{comment.videoTitle}"
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-foreground/80">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {comment.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 text-xs"
                          onClick={() => updateStatus(comment.id, 'responded')}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Respond
                        </Button>
                      )}
                      {comment.status !== 'archived' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground text-xs"
                          onClick={() => updateStatus(comment.id, 'archived')}
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-600"
                        onClick={() => deleteComment(comment.id)}
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
  )
}

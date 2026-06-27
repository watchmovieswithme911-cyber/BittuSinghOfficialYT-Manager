import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Plus,
  BarChart3,
  PlayCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'

interface Snapshot {
  id: string
  date: string
  subscribers: number
  totalViews: number
  watchTimeHours: number
  avgViewDurationMins: number
  topVideo?: string | null
  notes?: string | null
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AnalyticsDashboard() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    subscribers: '',
    totalViews: '',
    watchTimeHours: '',
    avgViewDurationMins: '',
    topVideo: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  })

  const fetchSnapshots = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics-snapshots')
      const data = await res.json()
      setSnapshots(data.items ?? [])
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSnapshots()
  }, [fetchSnapshots])

  const createSnapshot = async () => {
    await fetch('/api/analytics-snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date(form.date).toISOString(),
        subscribers: parseInt(form.subscribers) || 0,
        totalViews: parseInt(form.totalViews) || 0,
        watchTimeHours: parseFloat(form.watchTimeHours) || 0,
        avgViewDurationMins: parseFloat(form.avgViewDurationMins) || 0,
        topVideo: form.topVideo.trim() || null,
        notes: form.notes.trim() || null,
      }),
    })
    setForm({
      subscribers: '',
      totalViews: '',
      watchTimeHours: '',
      avgViewDurationMins: '',
      topVideo: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    })
    setDialogOpen(false)
    fetchSnapshots()
  }

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const latest = sorted[sorted.length - 1]
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null

  const chartData = sorted.map((s) => ({
    date: formatDate(s.date),
    subscribers: s.subscribers,
    views: s.totalViews,
    watchTime: s.watchTimeHours,
    avgDuration: s.avgViewDurationMins,
  }))

  function delta(current: number, prev: number | undefined) {
    if (prev === undefined || prev === 0) return null
    return current - prev
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Track your channel performance for BittuSinghOfficialYT
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Metrics
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Today's Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subscribers</Label>
                  <Input
                    type="number"
                    value={form.subscribers}
                    onChange={(e) => setForm({ ...form, subscribers: e.target.value })}
                    placeholder="e.g. 15000"
                  />
                </div>
                <div>
                  <Label>Total Views</Label>
                  <Input
                    type="number"
                    value={form.totalViews}
                    onChange={(e) => setForm({ ...form, totalViews: e.target.value })}
                    placeholder="e.g. 250000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Watch Time (hours)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.watchTimeHours}
                    onChange={(e) => setForm({ ...form, watchTimeHours: e.target.value })}
                    placeholder="e.g. 1200"
                  />
                </div>
                <div>
                  <Label>Avg View Duration (min)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.avgViewDurationMins}
                    onChange={(e) =>
                      setForm({ ...form, avgViewDurationMins: e.target.value })
                    }
                    placeholder="e.g. 4.5"
                  />
                </div>
              </div>
              <div>
                <Label>Top Performing Video</Label>
                <Input
                  value={form.topVideo}
                  onChange={(e) => setForm({ ...form, topVideo: e.target.value })}
                  placeholder="Video title"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any observations..."
                  rows={2}
                />
              </div>
              <Button onClick={createSnapshot} className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Save Metrics
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-20 mb-2" />
                <div className="h-8 bg-muted rounded w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No analytics data yet. Click "Log Metrics" to start tracking!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Subscribers
                    </p>
                    <p className="text-2xl font-bold">{formatNumber(latest?.subscribers ?? 0)}</p>
                  </div>
                  {previous && (
                    <DeltaBadge value={delta(latest!.subscribers, previous.subscribers)} />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Total Views
                    </p>
                    <p className="text-2xl font-bold">{formatNumber(latest?.totalViews ?? 0)}</p>
                  </div>
                  {previous && (
                    <DeltaBadge value={delta(latest!.totalViews, previous.totalViews)} />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Watch Time
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(Math.round(latest?.watchTimeHours ?? 0))}h
                    </p>
                  </div>
                  {previous && (
                    <DeltaBadge
                      value={delta(latest!.watchTimeHours, previous.watchTimeHours)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" /> Avg Duration
                    </p>
                    <p className="text-2xl font-bold">
                      {(latest?.avgViewDurationMins ?? 0).toFixed(1)}m
                    </p>
                  </div>
                  {previous && (
                    <DeltaBadge
                      value={delta(latest!.avgViewDurationMins, previous.avgViewDurationMins)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subscriber Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.15}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Watch Time (hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="watchTime"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Watch Time (h)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg View Duration (min)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="avgDuration"
                      stroke="#ec4899"
                      fill="#ec4899"
                      fillOpacity={0.15}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Video & History */}
          {latest?.topVideo && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Top Video:</span>
                  <span className="text-sm">{latest.topVideo}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Metrics History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sorted
                  .slice()
                  .reverse()
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(s.date)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>👥 {formatNumber(s.subscribers)}</span>
                        <span>👁 {formatNumber(s.totalViews)}</span>
                        <span>⏱ {s.watchTimeHours.toFixed(0)}h</span>
                        {s.topVideo && (
                          <span className="hidden md:inline max-w-[200px] truncate">
                            🎬 {s.topVideo}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null || value === 0) return null
  const isPositive = value > 0
  return (
    <Badge
      className={`text-xs ${
        isPositive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3 mr-0.5" />
      ) : (
        <ArrowDownRight className="h-3 w-3 mr-0.5" />
      )}
      {Math.abs(value) >= 1000 ? formatNumber(Math.abs(value)) : Math.abs(value)}
    </Badge>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Zap, Play, RotateCw, CheckCircle2, XCircle, Clock, Bot,
  FileText, Lightbulb, Upload, BarChart3, TrendingUp, Sparkles,
  Layers, Target, RefreshCw
} from 'lucide-react'

interface AutoStats {
  totalScripts: number
  totalIdeas: number
  totalQueued: number
  totalTasks: number
  completedTasks: number
  failedTasks: number
  pendingUploads: number
  uploadedCount: number
  approvedIdeas: number
  readyScripts: number
  successRate: number
}

interface AutomationTask {
  id: string
  type: string
  title: string
  description?: string
  genre?: string
  language?: string
  status: string
  priority: number
  result?: string
  runsCount: number
  lastRunAt?: string
  nextRunAt?: string
  isRecurring: boolean
  createdAt: string
}

export default function AutoPilot() {
  const [stats, setStats] = useState<AutoStats | null>(null)
  const [tasks, setTasks] = useState<AutomationTask[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [lastResults, setLastResults] = useState<string[]>([])
  const [batchCount, setBatchCount] = useState(5)
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [autoInterval, setAutoInterval] = useState<ReturnType<typeof setInterval> | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/autopilot/stats')
      const data = await res.json()
      if (data.ok) {
        setStats(data.stats)
        setTasks(data.recentTasks)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const runSingle = async () => {
    setIsRunning(true)
    setLastResults([])
    try {
      const res = await fetch('/api/autopilot/run', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setLastResults(data.results)
        fetchStats()
      }
    } catch { /* ignore */ }
    setIsRunning(false)
  }

  const runBatch = async () => {
    setIsRunning(true)
    setLastResults([])
    try {
      const res = await fetch('/api/autopilot/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: batchCount }),
      })
      const data = await res.json()
      if (data.ok) {
        setLastResults(data.results)
        fetchStats()
      }
    } catch { /* ignore */ }
    setIsRunning(false)
  }

  const toggleAutoMode = () => {
    if (isAutoMode && autoInterval) {
      clearInterval(autoInterval)
      setAutoInterval(null)
      setIsAutoMode(false)
    } else {
      setIsAutoMode(true)
      const interval = setInterval(() => {
        runSingle()
      }, 60000)
      setAutoInterval(interval)
      runSingle()
    }
  }

  useEffect(() => {
    return () => {
      if (autoInterval) clearInterval(autoInterval)
    }
  }, [autoInterval])

  const successRate = stats?.successRate ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-violet-500" />
            {isAutoMode && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              AutoPilot Agent
              {isAutoMode && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ACTIVE</Badge>}
            </h2>
            <p className="text-sm text-muted-foreground">24/7 AI-powered content generation for BittuSinghOfficialYT</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={toggleAutoMode}
            className={isAutoMode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isAutoMode ? <><XCircle className="h-4 w-4 mr-2" /> Stop Auto</> : <><Play className="h-4 w-4 mr-2" /> Start 24/7 Auto</>}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-muted-foreground">Scripts Generated</span>
              </div>
              <div className="text-3xl font-bold text-violet-400">{stats.totalScripts}</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.readyScripts} ready to publish</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-muted-foreground">Video Ideas</span>
              </div>
              <div className="text-3xl font-bold text-blue-400">{stats.totalIdeas}</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.approvedIdeas} approved</div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-muted-foreground">Upload Queue</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">{stats.totalQueued}</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.pendingUploads} pending</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{stats.completedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">{successRate}% success rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Rate Bar */}
      {stats && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Automation Success Rate</span>
              <span className="text-sm font-bold text-green-400">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Single Run */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              Single Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generates 1 script + 1 video idea + 1 upload entry. Perfect for testing or one-off generation.
            </p>
            <Button onClick={runSingle} disabled={isRunning} className="w-full bg-violet-600 hover:bg-violet-700">
              {isRunning ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Play className="h-4 w-4 mr-2" /> Run One Cycle</>}
            </Button>
          </CardContent>
        </Card>

        {/* Batch Run */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              Batch Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate multiple scripts, ideas, and uploads at once. Max 20 per batch.
            </p>
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm whitespace-nowrap">Count:</span>
                <select
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="flex-1 bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  {[3, 5, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} items</option>
                  ))}
                </select>
              </div>
            </div>
            <Button onClick={runBatch} disabled={isRunning} className="w-full" variant="outline">
              {isRunning ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Batch Running...</> : <><Layers className="h-4 w-4 mr-2" /> Generate {batchCount} Items</>}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Last Results */}
      {lastResults.length > 0 && (
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-400" />
              Latest Generation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {lastResults.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-md bg-green-500/5">
                    <span className="whitespace-pre-wrap">{r}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Recent Automation Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Automation Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No tasks yet. Run your first automation cycle!</p>
            </div>
          ) : (
            <ScrollArea className="max-h-80">
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : task.status === 'failed' ? (
                        <XCircle className="h-5 w-5 text-red-400" />
                      ) : task.status === 'running' ? (
                        <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {task.genre && `${task.genre} • `}
                          {task.language && `${task.language} • `}
                          {new Date(task.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.isRecurring && (
                        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50 text-xs">
                          <RotateCw className="h-3 w-3 mr-1" /> Recurring
                        </Badge>
                      )}
                      <Badge className={
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                        task.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-400" />
            How AutoPilot Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Lightbulb className="h-5 w-5" />, title: 'Generate Ideas', desc: 'AI creates trending video ideas across 16 genres', color: 'text-blue-400' },
              { icon: <FileText className="h-5 w-5" />, title: 'Write Scripts', desc: 'Auto-generates lyrics, descriptions, and SEO in 5 languages', color: 'text-violet-400' },
              { icon: <BarChart3 className="h-5 w-5" />, title: 'Optimize SEO', desc: 'Tags, titles, and descriptions optimized for viral reach', color: 'text-orange-400' },
              { icon: <Upload className="h-5 w-5" />, title: 'Queue Uploads', desc: 'Auto-schedules content across YouTube, Reels, TikTok', color: 'text-green-400' },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 rounded-lg border bg-card">
                <div className={`${step.color} mb-2 flex justify-center`}>{step.icon}</div>
                <div className="font-medium text-sm mb-1">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

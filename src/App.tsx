import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoIdeas from '@/components/VideoIdeas'
import ContentCalendar from '@/components/ContentCalendar'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import CommentManager from '@/components/CommentManager'
import GenreLibrary from '@/components/GenreLibrary'
import ScriptGenerator from '@/components/ScriptGenerator'
import SEOOptimizer from '@/components/SEOOptimizer'
import AutoUploadQueue from '@/components/AutoUploadQueue'
import AIChatbot from '@/components/AIChatbot'
import {
  Lightbulb,
  Calendar,
  BarChart3,
  MessageSquare,
  Youtube,
  Music,
  Sparkles,
  Search,
  Upload,
  Bot,
} from 'lucide-react'

export default function App() {
  const [tab, setTab] = useState('genres')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-xl">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                BittuSinghOfficialYT
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered YouTube Channel Manager</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-5 w-full mb-6 h-auto flex-wrap">
            <TabsTrigger value="genres" className="flex items-center gap-1 text-xs">
              <Music className="h-3 w-3" />
              <span className="hidden sm:inline">Genres</span>
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Scripts</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-1 text-xs">
              <Search className="h-3 w-3" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-1 text-xs">
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Uploads</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-1 text-xs">
              <Bot className="h-3 w-3" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Second row of tabs */}
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="ideas" className="flex items-center gap-1 text-xs">
              <Lightbulb className="h-3 w-3" />
              <span className="hidden sm:inline">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="genres"><GenreLibrary /></TabsContent>
          <TabsContent value="scripts"><ScriptGenerator /></TabsContent>
          <TabsContent value="seo"><SEOOptimizer /></TabsContent>
          <TabsContent value="upload"><AutoUploadQueue /></TabsContent>
          <TabsContent value="chatbot"><AIChatbot /></TabsContent>
          <TabsContent value="ideas"><VideoIdeas /></TabsContent>
          <TabsContent value="calendar"><ContentCalendar /></TabsContent>
          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="comments"><CommentManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

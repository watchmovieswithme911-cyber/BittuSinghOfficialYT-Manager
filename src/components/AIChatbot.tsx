import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bot,
  Send,
  User,
  Sparkles,
  Music,
  Video,
  Search,
  Calendar,
  Upload,
  BarChart3,
  MessageSquare,
  Zap,
  Globe,
  Lightbulb,
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: string
  content: string
  category?: string | null
  createdAt: string
}

const QUICK_ACTIONS = [
  { label: 'Generate Lyrics', icon: <Music className="h-3 w-3" />, prompt: 'Generate lyrics for a Bass Boosted motivational track in Hindi', category: 'lyrics' },
  { label: 'SEO Ideas', icon: <Search className="h-3 w-3" />, prompt: 'Give me SEO title and tag ideas for a Punjabi Bhangra remix video', category: 'seo' },
  { label: 'Upload Tips', icon: <Upload className="h-3 w-3" />, prompt: 'What is the best time to upload YouTube videos for maximum views?', category: 'strategy' },
  { label: 'Video Ideas', icon: <Lightbulb className="h-3 w-3" />, prompt: 'Suggest 5 viral video ideas for my channel BittuSinghOfficialYT', category: 'ideas' },
  { label: 'Channel Growth', icon: <BarChart3 className="h-3 w-3" />, prompt: 'How can I grow my YouTube channel faster? Give me 10 actionable tips', category: 'strategy' },
  { label: 'Trending Now', icon: <TrendingUpIcon />, prompt: 'What music genres are trending globally right now for YouTube?', category: 'trends' },
]

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

const AI_RESPONSES: Record<string, string> = {
  'lyrics': `🎵 **AI Lyrics Generator**\n\nHere's a sample Bass Boosted Motivational Track in Hindi:\n\n**[Verse 1]**\nDuniya kahe ruk ja, tu chalna seekh le\nHaar ke baith ja, ya haar ko dekh le\nDil mein junoon hai, aankhon mein aag hai\nYe waqt badlega, tera apna sag hai\n\n**[Chorus]**\n🔊 Bass Boosted! Dil se nachle!\nTu rocket ki tarah udd ke chal!\nHaar nahi manunga, jeet ka hai yakeen\nYe duniya meri, main hoon apne haseen!\n\n**[Verse 2]**\nRaat ka andhera, savere ki kirne\nMehnat ka rang hai, ye sabki birne\nBass boost kar de, volume full kar de\nDuniya ko dikha, tu kaun hai dekh le!\n\n**[Outro - Repeat]**\nBass Boosted! Bass Boosted!\nTu sabse alag, tu sabse mast!\n\n💡 **Tips for viral lyrics:**\n- Use hook words like "Bass Boosted" in chorus\n- Keep verses short and punchy (4-6 lines)\n- Add English words for global appeal\n- Include a catchy repeating outro`,

  'seo': `🔍 **SEO Ideas for Punjabi Bhangra Remix**\n\n**Title Options:**\n1. 🔥 Bhangra Remix 2025 | New Punjabi Hits Non Stop\n2. DJ Mix Punjabi Bhangra 🔊 Desi Beats to Dance\n3. Best Bhangra Songs 2025 | Punjabi Remix Collection\n4. Punjabi Bhangra Mix 🔥 Wedding Dance Hits\n5. Desi Bhangra Party Mix 2025 🎶\n\n**Tags:**\npunjabi bhangra, bhangra remix, punjabi songs 2025, desi bhangra, punjabi DJ, bhangra dance, punjabi music mix, new punjabi songs\n\n**Description Template:**\n🎵 Punjabi Bhangra Remix Collection by BittuSinghOfficialYT!\n\nThe ultimate Bhangra experience for weddings, parties & dance!\n\n📌 Best Bhangra hits mixed to perfection\n✅ High quality audio\n✅ Non-stop entertainment\n\n🔥 Subscribe: youtube.com/@BittuSinghOfficialYT\n\n#Bhangra #Punjabi #Desi #MusicMix #BittuSinghOfficialYT`,

  'strategy': `📊 **Best Upload Times for YouTube (2025)**\n\n🎯 **For Indian Audience (Hindi/Punjabi/Bhojpuri):**\n- **Best:** Friday & Saturday, 6:00 PM - 9:00 PM IST\n- **Good:** Weekday evenings 5:00 PM - 8:00 PM IST\n- **Avoid:** Early morning (4-7 AM) and late night (11 PM+)\n\n🌍 **For Global Audience (English/Trance/Bass):**\n- **Best:** Friday & Saturday, 12:00 PM - 3:00 PM EST\n- **Good:** Weekday afternoons 2:00 PM - 5:00 PM EST\n- **Weekends** generally get more views for music content\n\n📈 **Growth Tips:**\n1. Upload consistently (same day, same time)\n2. Use Shorts for reach, long-form for watch time\n3. First 24 hours are critical — share on all social media\n4. Reply to every comment in the first hour\n5. Use end screens and cards for longer sessions`,

  'ideas': `💡 **5 Viral Video Ideas for BittuSinghOfficialYT**\n\n1. **🔊 "1 Hour Bass Boosted Workout Motivation"**\n   - Target: Gym audience + bass boost fans\n   - Why viral: Combines two trending niches\n   - SEO: "bass boosted workout motivation 2025"\n\n2. **🏎️ "Car Racing Songs Compilation - Speed Boost Mix"**\n   - Target: Car enthusiasts + racing gamers\n   - Why viral: Gaming + car culture crossover\n   - SEO: "car racing songs" "drift music"\n\n3. **🙏 "Morning Devotional Mix - 24/7 Loop"**\n   - Target: Devotional audience (massive daily plays)\n   - Why viral: Loop content = insane watch time\n   - SEO: "morning bhajan" "devotional music 24/7"\n\n4. **💪 "Gym Rep Music - Beast Mode Bass Boosted"**\n   - Target: Fitness community\n   - Why viral: "Rep" content is evergreen\n   - SEO: "gym motivation" "workout bass"\n\n5. **🌀 "Trance Music for Focus - Study Mix"**\n   - Target: Students + remote workers\n   - Why viral: Study/focus content gets massive long plays\n   - SEO: "study music" "focus trance" "concentration"\n\n🚀 **Pro Tip:** All 5 can be made as "1 hour" or "2 hour" loops for maximum watch time!`,

  'trends': `📈 **Trending Music Genres on YouTube (2025)**\n\n🔥 **Top 5 Trending:**\n1. **Bass Boosted / 8D Audio** — Massive growth, viral potential\n2. **Desi Hip Hop / Punjabi Pop** — Global Indian audience explosion\n3. **Lo-fi + Devotional Fusion** — New niche, low competition\n4. **Gym/Workout Compilation** — Evergreen with loyal audiences\n5. **Trance / Psytrance** — Growing fast in global markets\n\n🌏 **By Language:**\n- Hindi: Devotional + Pop Remix\n- Punjabi: Bhangra + Pop\n- English: Bass Boosted + Rap Motivation\n- Bhojpuri: Remix + Folk Fusion\n- Global: Trance + Workout\n\n📊 **Growth Opportunity:**\n- Bhojpuri music is UNDERSERVED on YouTube\n- Devotional music gets 24/7 plays (passive income)\n- "Bass Boosted" has 3x search volume vs last year\n\n💡 **Action Plan:**\n1. Double down on Bass Boosted + Devotional\n2. Start a Bhojpuri remix series (low competition)\n3. Cross-post to Instagram Reels for reach\n4. Create "1 hour loop" versions of every popular video`,
}

function generateAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('lyric') || lower.includes('गाना') || lower.includes('song')) return AI_RESPONSES['lyrics']
  if (lower.includes('seo') || lower.includes('title') || lower.includes('tag')) return AI_RESPONSES['seo']
  if (lower.includes('upload') || lower.includes('time') || lower.includes('schedule') || lower.includes('grow')) return AI_RESPONSES['strategy']
  if (lower.includes('idea') || lower.includes('suggest') || lower.includes('viral')) return AI_RESPONSES['ideas']
  if (lower.includes('trend') || lower.includes('popular') || lower.includes('hot')) return AI_RESPONSES['trends']
  return `🤖 **AI Assistant for BittuSinghOfficialYT**\n\nI can help you with:\n\n🎵 **Music & Lyrics** — Generate lyrics in Hindi, English, Punjabi, Bhojpuri\n🔍 **SEO** — Optimize titles, tags, and descriptions\n📅 **Schedule** — Best upload times for your audience\n💡 **Ideas** — Viral video ideas for your channel\n📈 **Growth** — Channel growth strategies\n🌐 **Trends** — Current music trends globally\n\nTry asking me something specific like:\n- "Generate lyrics for a gym motivation track"\n- "Best SEO for bass boosted videos"\n- "What time should I upload on Friday?"\n- "Give me video ideas for Punjabi audience"`
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/chat-messages')
      const data = await res.json()
      setMessages(data.items ?? [])
    } catch { /* empty */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: msg,
      category: 'user',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await fetch('/api/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: msg, category: 'user' }),
    })

    setTimeout(async () => {
      const response = generateAIResponse(msg)
      await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: response, category: 'assistant' }),
      })
      setIsTyping(false)
      fetchMessages()
    }, 1200)
  }

  const clearChat = async () => {
    for (const msg of messages) {
      await fetch(`/api/chat-messages/${msg.id}`, { method: 'DELETE' })
    }
    setMessages([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            AI Content Assistant
          </h2>
          <p className="text-muted-foreground mt-1">24/7 AI support for your YouTube channel</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat}>Clear Chat</Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((qa, i) => (
          <Button key={i} variant="outline" size="sm" onClick={() => sendMessage(qa.prompt)} className="text-xs">
            {qa.icon} <span className="ml-1">{qa.label}</span>
          </Button>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 mx-auto text-blue-500 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant! 🤖</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I can help you with lyrics, SEO, video ideas, upload strategy, and channel growth.
                  Pick a quick action above or type your question!
                </p>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="bg-blue-500 text-white rounded-full p-2 shrink-0 h-8 w-8 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{msg.content.split('\n').map((line, j) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={j} className="font-bold">{line.replace(/\*\*/g, '')}</p>
                    }
                    if (line.startsWith('- ') || line.startsWith('• ')) {
                      return <p key={j} className="ml-2">{line}</p>
                    }
                    return <p key={j}>{line}</p>
                  })}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="bg-primary text-primary-foreground rounded-full p-2 shrink-0 h-8 w-8 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="bg-blue-500 text-white rounded-full p-2 shrink-0 h-8 w-8 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-3">
          <form onSubmit={e => { e.preventDefault(); sendMessage() }} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about lyrics, SEO, video ideas, growth tips..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

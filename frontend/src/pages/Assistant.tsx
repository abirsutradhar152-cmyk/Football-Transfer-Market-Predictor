import { useState, useRef, useEffect } from "react"
import { players, clubs, rumours } from "../data/demo"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { MessageSquare, Send, Bot, User, Loader2, Sparkles } from "lucide-react"

interface Message { role: 'user' | 'assistant', content: string, timestamp: Date }

const SAMPLE_QUESTIONS = [
  "Who should Arsenal sign this summer?",
  "Which striker fits Bayern Munich best?",
  "Compare Haaland and Mbappé",
  "Why is Salah's probability low?",
  "What clubs need a striker?",
  "Who are the highest-valued players?",
]

function buildContext(query: string): string {
  const q = query.toLowerCase()
  const parts: string[] = []

  // Determine which club the user asks about
  const mentionedClub = clubs.find(c => q.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()))
  const mentionedPlayer = players.find(p => q.includes(p.lastName.toLowerCase()) || q.includes(p.firstName.toLowerCase()))

  // Check for comparison
  const isCompare = q.includes('compar') || q.includes(' vs ') || q.includes(' and ')
  const isSign = q.includes('sign') || q.includes('buy') || q.includes('need') || q.includes('who should')
  const isValue = q.includes('value') || q.includes('worth') || q.includes('highest')
  const isStriker = q.includes('striker') || q.includes('forward')

  if (mentionedClub) {
    const squad = players.filter(p => p.currentClubId === mentionedClub.id)
    const budget = (mentionedClub.estimatedBudget / 1e6).toFixed(0)
    parts.push(`**${mentionedClub.name}** — Manager: ${mentionedClub.manager}, Budget: €${budget}M, Style: ${mentionedClub.tacticalStyle}. Squad: ${squad.map(p => p.name).join(', ')}.`)
  }

  if (mentionedPlayer) {
    const club = clubs.find(c => c.id === mentionedPlayer.currentClubId)
    const r = rumours.find(r => r.playerId === mentionedPlayer.id)
    const toClub = r ? clubs.find(c => c.id === r.interestedClubId) : null
    parts.push(`**${mentionedPlayer.name}** (${mentionedPlayer.nationality}, ${mentionedPlayer.age}y) — ${mentionedPlayer.position} at ${club?.name}. Market value: €${(mentionedPlayer.marketValue/1e6).toFixed(0)}M. Contract until ${mentionedPlayer.contractExpiry.slice(0,7)}.${r ? ` Linked to ${toClub?.name} (Probability: ${r.transferProbability}%).` : ''}`)
  }

  if (isSign && mentionedClub) {
    const needed = players.filter(p => p.currentClubId !== mentionedClub.id).sort((a,b) => b.marketValue - a.marketValue).slice(0, 5)
    parts.push(`Top candidate recommendations for ${mentionedClub.name}: ${needed.map(p => `${p.name} (${p.position}, €${(p.marketValue/1e6).toFixed(0)}M)`).join('; ')}.`)
  }

  if (isStriker && !mentionedClub) {
    const strikers = players.filter(p => p.position === 'Striker')
    parts.push(`Available top strikers in the demo: ${strikers.map(p => `${p.name} (${clubs.find(c=>c.id===p.currentClubId)?.name}, €${(p.marketValue/1e6).toFixed(0)}M)`).join('; ')}.`)
  }

  if (isCompare && mentionedPlayer) {
    const p2 = players.find(p => p.id !== mentionedPlayer.id && (q.includes(p.lastName.toLowerCase()) || q.includes(p.firstName.toLowerCase())))
    if (p2) {
      const s1 = mentionedPlayer.statistics, s2 = p2.statistics
      parts.push(`**Comparison — ${mentionedPlayer.name} vs ${p2.name}**: Goals: ${s1?.goals ?? 'N/A'} vs ${s2?.goals ?? 'N/A'}. Assists: ${s1?.assists ?? 'N/A'} vs ${s2?.assists ?? 'N/A'}. xG: ${s1?.xG ?? 'N/A'} vs ${s2?.xG ?? 'N/A'}. Market values: €${(mentionedPlayer.marketValue/1e6).toFixed(0)}M vs €${(p2.marketValue/1e6).toFixed(0)}M.`)
    }
  }

  if (isValue) {
    const topByValue = [...players].sort((a,b) => b.marketValue - a.marketValue).slice(0, 5)
    parts.push(`Highest valued players: ${topByValue.map((p,i) => `${i+1}. ${p.name} €${(p.marketValue/1e6).toFixed(0)}M`).join(', ')}.`)
  }

  if (parts.length === 0) {
    const topRumours = rumours.slice(0,3).map(r => {
      const p = players.find(pl => pl.id === r.playerId), t = clubs.find(c => c.id === r.interestedClubId)
      return `${p?.name} → ${t?.name} (${r.transferProbability}%)`
    }).join('; ')
    parts.push(`Current top transfer rumours from demo data: ${topRumours}. Total players tracked: ${players.length}. Clubs: ${clubs.length}.`)
  }

  return parts.join('\n\n')
}

function generateResponse(query: string): string {
  const ctx = buildContext(query)
  const q = query.toLowerCase()

  if (q.includes('sign') || q.includes('who should')) {
    const mentionedClub = clubs.find(c => q.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()))
    if (mentionedClub) {
      return `Based on **${mentionedClub.name}'s** profile (${mentionedClub.tacticalStyle}, budget €${(mentionedClub.estimatedBudget/1e6).toFixed(0)}M), here are the top signings to consider:\n\n${ctx}\n\n⚠️ *These recommendations are based on demo data, not live transfer intelligence.*`
    }
  }

  if (q.includes('compar')) {
    return `Here's a head-to-head comparison from our demo database:\n\n${ctx}\n\nFor a full interactive comparison, visit the **Compare** page.\n\n⚠️ *Statistics are from demo data.*`
  }

  if (q.includes('probability') || q.includes('realistic') || q.includes('likely')) {
    return `To assess transfer probability, our engine weighs **10 factors**: Tactical Fit (20%), Club Need (15%), Financial Feasibility (15%), Player Interest (10%), Club Interest (10%), Contract Situation (10%), Fee Feasibility (8%), Wage Compatibility (5%), Competition (4%), Availability (3%).\n\n${ctx}\n\nUse the **Transfer Predictor** for a detailed analysis.`
  }

  return `${ctx}\n\n💡 *Tip: Ask me about specific players, clubs, or use the Transfer Predictor for detailed probability analysis.*\n\n⚠️ *Answers are based on demo data, not live transfer news.*`
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 I'm **TransferIQ Assistant** — your AI-powered football transfer intelligence. I can help you analyze transfers, compare players, check squad needs, and more.\n\n*Note: I operate on demo data only and will never fabricate real transfer news.*", timestamp: new Date() }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  function sendMessage(text?: string) {
    const query = text || input.trim()
    if (!query) return
    setInput("")
    const userMsg: Message = { role: 'user', content: query, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      const response = generateResponse(query)
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  function renderContent(text: string) {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
      return <p key={i} className={line.startsWith('⚠️') ? 'text-yellow-500/80 text-xs mt-1' : 'text-sm'} dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-xl">TransferIQ Assistant</h1>
          <p className="text-xs text-muted-foreground">Powered by demo data • Does not fabricate real transfer news</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'}`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 space-y-1 ${msg.role === 'assistant' ? 'bg-card border' : 'bg-primary text-primary-foreground'}`}>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border rounded-2xl px-4 py-3 flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sample questions */}
      {messages.length <= 1 && (
        <div className="py-4 flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map(q => (
            <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 text-xs border rounded-full hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors text-muted-foreground">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 pt-4 border-t">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about players, clubs, or transfers..."
          className="flex-1"
          disabled={isTyping}
        />
        <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

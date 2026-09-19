import { useState } from "react"
import { rumours, players, clubs } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Search, Filter, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"

type RumourStatus = 'Rumour' | 'Interest' | 'Contact' | 'Negotiation' | 'Bid' | 'Agreement' | 'Medical' | 'Completed' | 'Rejected' | 'Collapsed'

const statusColors: Record<RumourStatus, string> = {
  Rumour:      "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Interest:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Contact:     "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Negotiation: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Bid:         "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Agreement:   "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Medical:     "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Completed:   "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected:    "bg-red-500/20 text-red-400 border-red-500/30",
  Collapsed:   "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const statusSteps: RumourStatus[] = ['Rumour','Interest','Contact','Negotiation','Bid','Agreement','Medical','Completed']

function ReliabilityBadge({ score }: { score: number }) {
  const label = score >= 80 ? 'Highly Credible' : score >= 60 ? 'Credible' : 'Unverified'
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-slate-400'
  return (
    <div className="flex items-center gap-1.5">
      <div className={`text-sm font-bold ${color}`}>{score}/100</div>
      <div className={`text-xs ${color}`}>— {label}</div>
    </div>
  )
}

function StatusProgress({ status }: { status: RumourStatus }) {
  const currentIdx = statusSteps.indexOf(status)
  if (currentIdx === -1) return null
  return (
    <div className="flex items-center gap-0.5 mt-3">
      {statusSteps.map((s, i) => (
        <div key={s} className="flex items-center gap-0.5 flex-1">
          <div className={`h-1.5 w-full rounded-full ${i <= currentIdx ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      ))}
    </div>
  )
}

export default function Rumours() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("All")

  const statuses = ["All", "Rumour", "Interest", "Contact", "Negotiation", "Bid", "Agreement", "Completed", "Rejected"]

  const filtered = rumours.filter(r => {
    const player = players.find(p => p.id === r.playerId)
    const toClub = clubs.find(c => c.id === r.interestedClubId)
    const matchSearch = !search || 
      player?.name.toLowerCase().includes(search.toLowerCase()) ||
      toClub?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || r.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Transfer Rumours</h1>
        <p className="text-muted-foreground mt-1">
          Tracked rumours with source reliability scores. 
          <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">⚠ DEMO DATA</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search player or club..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Note about data */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-blue-400">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>Rumours shown are sample demo data. In Live Mode, rumours would be sourced from credible verified reports. Source URLs are not fabricated.</p>
      </div>

      {/* Rumour Cards */}
      <div className="grid gap-4">
        {filtered.map(rumour => {
          const player = players.find(p => p.id === rumour.playerId)
          const fromClub = clubs.find(c => c.id === rumour.currentClubId)
          const toClub = clubs.find(c => c.id === rumour.interestedClubId)
          if (!player || !fromClub || !toClub) return null
          const status = rumour.status as RumourStatus

          return (
            <Card key={rumour.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Player info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border flex-shrink-0">
                      {player.imageUrl && <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{player.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1.5">
                          <img src={fromClub.logoUrl} alt="" className="w-4 h-4" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                          {fromClub.name}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <img src={toClub.logoUrl} alt="" className="w-4 h-4" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                          {toClub.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-5 md:gap-8">
                    {/* Status Badge */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>

                    {/* Transfer Probability */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Transfer Probability</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${rumour.transferProbability}%` }} />
                        </div>
                        <span className="text-sm font-bold text-primary">{rumour.transferProbability}%</span>
                      </div>
                    </div>

                    {/* Reliability */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Source Reliability</div>
                      <ReliabilityBadge score={rumour.reliabilityScore} />
                    </div>

                    {/* Source */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Source</div>
                      <div className="text-sm font-medium">{rumour.source}</div>
                    </div>

                    {/* Last updated */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Updated</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rumour.lastUpdated).toLocaleDateString('en-GB', { day:'2-digit', month:'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {!['Rejected','Collapsed'].includes(status) && (
                  <StatusProgress status={status} />
                )}
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground">No rumours found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

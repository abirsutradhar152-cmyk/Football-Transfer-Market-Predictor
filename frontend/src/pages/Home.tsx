import { Link } from "react-router-dom"
import { ArrowUpRight, TrendingUp, Search, Activity, Target, Flame, BarChart3 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { players, clubs, rumours } from "../data/demo"

export default function Home() {
  const sortedRumours = [...rumours].sort((a, b) => b.transferProbability - a.transferProbability)
  const topPlayers = [...players].sort((a, b) => b.marketValue - a.marketValue).slice(0, 5)

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-secondary border p-8 md:p-12 lg:p-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
        <div className="z-10 relative max-w-2xl space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-background text-primary">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" />
            DEMO MODE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight">
            Predict the <span className="text-primary">Next Big Move.</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            AI-powered football transfer intelligence, player analytics, and transfer predictions.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/predict"><Activity className="mr-2 h-5 w-5" />Predict a Transfer</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/transfer-market"><Search className="mr-2 h-5 w-5" />Explore Transfer Market</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trending Transfers */}
      <div>
        <h2 className="text-xl font-heading font-semibold flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" /> Trending Transfers
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedRumours.slice(0, 6).map(rumour => {
            const player = players.find(p => p.id === rumour.playerId)
            const fromClub = clubs.find(c => c.id === rumour.currentClubId)
            const toClub = clubs.find(c => c.id === rumour.interestedClubId)
            if (!player || !toClub || !fromClub) return null

            return (
              <Card key={rumour.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img src={player.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{player.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span>{fromClub.name}</span>
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="font-medium text-foreground">{toClub.name}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-primary">{rumour.transferProbability}%</div>
                      <div className="text-xs text-muted-foreground">{rumour.status}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Est. €{(player.marketValue / 1e6).toFixed(0)}M</span>
                    <span className={`font-semibold ${rumour.reliabilityScore >= 80 ? 'text-green-400' : rumour.reliabilityScore >= 60 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      Reliability: {rumour.reliabilityScore}/100
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Market Leaders */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Highest Valued Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlayers.map((p, i) => {
                const club = clubs.find(c => c.id === p.currentClubId)
                return (
                  <Link key={p.id} to={`/players/${p.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/30 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</div>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{club?.name}</div>
                      </div>
                    </div>
                    <div className="font-bold text-primary">€{(p.marketValue / 1e6).toFixed(0)}M</div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Most Active Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const counts: Record<string, number> = {}
                rumours.forEach(r => { counts[r.interestedClubId] = (counts[r.interestedClubId] || 0) + 1 })
                return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, count], i) => {
                  const club = clubs.find(c => c.id === id)
                  if (!club) return null
                  return (
                    <Link key={id} to={`/clubs/${id}`} className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/30 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</div>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-1">
                          <img src={club.logoUrl} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{club.name}</div>
                          <div className="text-xs text-muted-foreground">{club.league}</div>
                        </div>
                      </div>
                      <div className="text-sm"><span className="font-bold">{count}</span> <span className="text-muted-foreground">rumour{count !== 1 ? 's' : ''}</span></div>
                    </Link>
                  )
                })
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { players, clubs, historicalTransfers, rumours } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Users, Globe } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

const PIE_COLORS = ["hsl(142,76%,40%)", "hsl(217,91%,60%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)", "hsl(270,70%,55%)", "hsl(180,60%,45%)"]

export default function Analytics() {
  // Spending by league
  const leagueSpending: Record<string, number> = {}
  historicalTransfers.forEach(t => {
    const club = clubs.find(c => c.id === t.toClubId)
    if (club) {
      leagueSpending[club.league] = (leagueSpending[club.league] || 0) + t.transferFee
    }
  })
  const spendingData = Object.entries(leagueSpending).map(([league, total]) => ({ league, total: total / 1e6 })).sort((a, b) => b.total - a.total)

  // Players by position
  const positionCount: Record<string, number> = {}
  players.forEach(p => {
    const pos = p.position.includes('Back') ? 'Defender' : p.position.includes('Midfielder') ? 'Midfielder' : p.position.includes('Wing') ? 'Winger' : p.position === 'Striker' ? 'Striker' : 'Other'
    positionCount[pos] = (positionCount[pos] || 0) + 1
  })
  const positionData = Object.entries(positionCount).map(([name, value]) => ({ name, value }))

  // Top transfers
  const topTransfers = [...historicalTransfers].sort((a, b) => b.transferFee - a.transferFee).slice(0, 5)

  // Most active clubs (by rumour count)
  const clubActivity: Record<string, number> = {}
  rumours.forEach(r => {
    const toClub = clubs.find(c => c.id === r.interestedClubId)
    if (toClub) clubActivity[toClub.name] = (clubActivity[toClub.name] || 0) + 1
  })
  const activityData = Object.entries(clubActivity).map(([club, count]) => ({ club, count })).sort((a, b) => b.count - a.count).slice(0, 6)

  // Stat cards
  const totalSpending = historicalTransfers.reduce((s, t) => s + t.transferFee, 0)
  const avgFee = totalSpending / (historicalTransfers.filter(t => t.transferFee > 0).length || 1)
  const avgAge = players.reduce((s, p) => s + p.age, 0) / (players.length || 1)

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Transfer market intelligence and data insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Total Spending</div>
              <div className="text-2xl font-bold">€{(totalSpending / 1e6).toFixed(0)}M</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10"><TrendingUp className="w-5 h-5 text-blue-500" /></div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Average Fee</div>
              <div className="text-2xl font-bold">€{(avgFee / 1e6).toFixed(1)}M</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-yellow-500/10"><Users className="w-5 h-5 text-yellow-500" /></div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Players Tracked</div>
              <div className="text-2xl font-bold">{players.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10"><Globe className="w-5 h-5 text-purple-500" /></div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Average Age</div>
              <div className="text-2xl font-bold">{avgAge.toFixed(1)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by League */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Spending by League</CardTitle>
            <CardDescription>Historical transfer spending from demo data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={spendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="league" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={v => `€${v}M`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} formatter={(v: number) => [`€${v.toFixed(1)}M`, 'Spending']} />
                <Bar dataKey="total" fill="hsl(142,76%,40%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Players by Position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Players by Position</CardTitle>
            <CardDescription>Distribution across the tracked player pool</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={positionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {positionData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biggest Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>Biggest Transfers (Historical)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTransfers.map((t, i) => {
                const player = players.find(p => p.id === t.playerId)
                const from = clubs.find(c => c.id === t.fromClubId)
                const to = clubs.find(c => c.id === t.toClubId)
                return (
                  <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{player?.name || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground truncate">{from?.name} → {to?.name} • {t.season}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-primary">{t.transferFee > 0 ? `€${(t.transferFee / 1e6).toFixed(0)}M` : 'Free'}</div>
                      <div className="text-xs text-muted-foreground">{t.transferType}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Clubs */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Clubs</CardTitle>
            <CardDescription>Clubs with the most transfer rumours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activityData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis type="category" dataKey="club" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="count" fill="hsl(217,91%,60%)" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

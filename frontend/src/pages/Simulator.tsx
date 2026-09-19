import { useState, useMemo } from "react"
import { players, clubs } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ShoppingCart, Minus, Plus, Trophy, Users, DollarSign, ArrowRight, RotateCcw, Star, AlertCircle } from "lucide-react"

interface SimTransfer {
  playerId: string
  type: 'buy' | 'sell' | 'loan_in' | 'loan_out'
  fee: number
}

export default function Simulator() {
  const [selectedClubId, setSelectedClubId] = useState(clubs[0].id)
  const [transfers, setTransfers] = useState<SimTransfer[]>([])

  const club = clubs.find(c => c.id === selectedClubId)!
  const originalSquad = players.filter(p => p.currentClubId === selectedClubId)

  const totalSpent = transfers.filter(t => t.type === 'buy').reduce((s, t) => s + t.fee, 0)
  const totalIncome = transfers.filter(t => t.type === 'sell').reduce((s, t) => s + t.fee, 0)
  const remainingBudget = club.estimatedBudget - totalSpent + totalIncome

  const soldPlayerIds = transfers.filter(t => t.type === 'sell' || t.type === 'loan_out').map(t => t.playerId)
  const boughtPlayerIds = transfers.filter(t => t.type === 'buy' || t.type === 'loan_in').map(t => t.playerId)
  const currentSquad = [
    ...originalSquad.filter(p => !soldPlayerIds.includes(p.id)),
    ...players.filter(p => boughtPlayerIds.includes(p.id)),
  ]

  const squadValue = currentSquad.reduce((s, p) => s + p.marketValue, 0)
  const avgAge = currentSquad.length ? currentSquad.reduce((s, p) => s + p.age, 0) / currentSquad.length : 0

  const availableToSign = players.filter(p => p.currentClubId !== selectedClubId && !boughtPlayerIds.includes(p.id))
  const availableToSell = originalSquad.filter(p => !soldPlayerIds.includes(p.id))

  // Position balance
  const positionGroups: Record<string, number> = {}
  currentSquad.forEach(p => {
    const group = p.position.includes('Back') ? 'Defence' : p.position.includes('Midfielder') ? 'Midfield' : 'Attack'
    positionGroups[group] = (positionGroups[group] || 0) + 1
  })

  // Score calculation
  function calculateScore(): number {
    let score = 50 // base
    score += Math.min(20, currentSquad.length * 1.2) // squad depth
    if (remainingBudget >= 0) score += 10; else score -= 15 // financial
    if (avgAge >= 23 && avgAge <= 28) score += 8; else if (avgAge < 23) score += 3
    const balance = Math.min(positionGroups['Defence'] || 0, positionGroups['Midfield'] || 0, positionGroups['Attack'] || 0)
    score += balance * 2 // tactical balance
    score = Math.min(100, Math.max(0, Math.round(score)))
    return score
  }

  const windowScore = calculateScore()

  function buyPlayer(playerId: string) {
    const p = players.find(pl => pl.id === playerId)
    if (!p) return
    setTransfers(prev => [...prev, { playerId, type: 'buy', fee: p.marketValue }])
  }

  function sellPlayer(playerId: string) {
    const p = players.find(pl => pl.id === playerId)
    if (!p) return
    setTransfers(prev => [...prev, { playerId, type: 'sell', fee: Math.round(p.marketValue * 0.85) }])
  }

  function reset() { setTransfers([]) }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Transfer Simulator</h1>
          <p className="text-muted-foreground mt-1">Build your ideal transfer window and see the impact on your squad.</p>
        </div>
        <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Reset Window</Button>
      </div>

      {/* Club selector */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Trophy className="w-4 h-4" /> Select Club:
          </div>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm flex-1 max-w-xs"
            value={selectedClubId} onChange={e => { setSelectedClubId(e.target.value); setTransfers([]) }}>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {club && (
            <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
              <img src={club.logoUrl} alt="" className="w-7 h-7 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              <div>
                <div className="font-semibold text-sm">{club.name}</div>
                <div className="text-xs text-muted-foreground">Budget: €{(club.estimatedBudget / 1e6).toFixed(0)}M</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className={remainingBudget < 0 ? 'border-red-500/40 bg-red-500/5' : ''}>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Remaining Budget</div>
            <div className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-primary'}`}>€{(remainingBudget / 1e6).toFixed(0)}M</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Squad Value</div>
            <div className="text-2xl font-bold">€{(squadValue / 1e6).toFixed(0)}M</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Squad Size</div>
            <div className="text-2xl font-bold">{currentSquad.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Avg Age</div>
            <div className="text-2xl font-bold">{avgAge.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3" /> Window Score</div>
            <div className="text-2xl font-bold text-primary">{windowScore}/100</div>
          </CardContent>
        </Card>
      </div>

      {remainingBudget < 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Budget exceeded! Sell players or reduce spending.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Players */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400"><Plus className="w-5 h-5" /> Sign Players</CardTitle>
            <CardDescription>Click to buy a player at market value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {availableToSign.slice(0, 15).map(p => {
              const pClub = clubs.find(c => c.id === p.currentClubId)
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border hover:border-green-500/30 hover:bg-green-500/5 transition-colors cursor-pointer" onClick={() => buyPlayer(p.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.position} • {pClub?.name}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary flex-shrink-0 ml-3">€{(p.marketValue / 1e6).toFixed(0)}M</div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Sell Players */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400"><Minus className="w-5 h-5" /> Sell Players</CardTitle>
            <CardDescription>Click to sell at 85% market value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {availableToSell.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border hover:border-red-500/30 hover:bg-red-500/5 transition-colors cursor-pointer" onClick={() => sellPlayer(p.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.position} • Age {p.age}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-red-400 flex-shrink-0 ml-3">€{(Math.round(p.marketValue * 0.85) / 1e6).toFixed(0)}M</div>
              </div>
            ))}
            {availableToSell.length === 0 && <div className="text-sm text-muted-foreground py-4 text-center">No players available to sell</div>}
          </CardContent>
        </Card>
      </div>

      {/* Transfer Log */}
      {transfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" /> Transfer Window Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transfers.map((t, i) => {
                const p = players.find(pl => pl.id === t.playerId)
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${t.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {t.type === 'buy' ? 'IN' : 'OUT'}
                      </span>
                      <span className="font-semibold text-sm">{p?.name}</span>
                    </div>
                    <span className={`font-bold text-sm ${t.type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
                      {t.type === 'buy' ? '-' : '+'}€{(t.fee / 1e6).toFixed(0)}M
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

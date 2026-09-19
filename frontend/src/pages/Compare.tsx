import { useState } from "react"
import { players } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Users, Plus, X, TrendingUp } from "lucide-react"
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts"

const COLORS = ["hsl(142,76%,40%)", "hsl(217,91%,60%)", "hsl(38,92%,50%)"]

function getAttributes(p: typeof players[0]) {
  const s = p.statistics
  if (!s) return { Shooting: 50, Passing: 50, Dribbling: 50, Defending: 50, Physical: 50, Creativity: 50 }
  return {
    Shooting:   Math.min(100, Math.round((s.goals / Math.max(s.appearances, 1)) * 150 + (s.shotsOnTarget / Math.max(s.shots, 1)) * 30)),
    Passing:    Math.min(100, Math.round(s.passAccuracy * 0.6 + (s.keyPasses / Math.max(s.appearances, 1)) * 12)),
    Dribbling:  Math.min(100, Math.round((s.dribbles / Math.max(s.appearances, 1)) * 12 + 30)),
    Defending:  Math.min(100, Math.round(((s.tackles + s.interceptions) / Math.max(s.appearances, 1)) * 15)),
    Physical:   Math.min(100, Math.round((s.aerialDuels / Math.max(s.appearances, 1)) * 10 + (s.minutes / Math.max(s.appearances, 1)) / 1.5)),
    Creativity: Math.min(100, Math.round(((s.assists + s.keyPasses) / Math.max(s.appearances, 1)) * 8 + (s.xA / Math.max(s.appearances, 1)) * 20)),
  }
}

export default function Compare() {
  const [selected, setSelected] = useState<string[]>([players[0].id, players[6].id])

  const selectedPlayers = selected.map(id => players.find(p => p.id === id)!).filter(Boolean)

  const radarData = ["Shooting","Passing","Dribbling","Defending","Physical","Creativity"].map(attr => {
    const entry: Record<string, number | string> = { attribute: attr }
    selectedPlayers.forEach(p => {
      const attrs = getAttributes(p)
      entry[p.name] = attrs[attr as keyof typeof attrs]
    })
    return entry
  })

  const statRows = [
    { key: "goals", label: "Goals" },
    { key: "assists", label: "Assists" },
    { key: "xG", label: "xG" },
    { key: "xA", label: "xA" },
    { key: "keyPasses", label: "Key Passes" },
    { key: "dribbles", label: "Dribbles" },
    { key: "tackles", label: "Tackles" },
    { key: "passAccuracy", label: "Pass Acc %" },
  ]

  const barData = statRows.map(row => {
    const entry: Record<string, string | number> = { stat: row.label }
    selectedPlayers.forEach(p => {
      entry[p.name] = (p.statistics as unknown as Record<string, number>)?.[row.key] ?? 0
    })
    return entry
  })

  function addPlayer(id: string) {
    if (selected.length >= 3 || selected.includes(id)) return
    setSelected([...selected, id])
  }
  function removePlayer(id: string) { setSelected(selected.filter(s => s !== id)) }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Player Comparison</h1>
        <p className="text-muted-foreground mt-1">Compare up to 3 players across all key performance metrics.</p>
      </div>

      {/* Selector */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Users className="w-4 h-4" /> Compare:
            </div>
            {selectedPlayers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: COLORS[i] + '66' }}>
                <div className="w-7 h-7 rounded-full overflow-hidden bg-muted">
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                </div>
                <span className="font-medium text-sm">{p.name}</span>
                <button onClick={() => removePlayer(p.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {selected.length < 3 && (
              <select
                className="h-10 rounded-md border border-dashed border-input bg-background px-3 py-2 text-sm text-muted-foreground"
                value=""
                onChange={e => e.target.value && addPlayer(e.target.value)}
              >
                <option value="">+ Add Player</option>
                {players.filter(p => !selected.includes(p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPlayers.length < 2 ? (
        <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">
          Select at least 2 players to compare
        </div>
      ) : (
        <div className="space-y-6">
          {/* Player header cards */}
          <div className={`grid gap-4 grid-cols-${selectedPlayers.length}`} style={{ gridTemplateColumns: `repeat(${selectedPlayers.length}, 1fr)` }}>
            {selectedPlayers.map((p, i) => (
              <Card key={p.id} className="overflow-hidden" style={{ borderColor: COLORS[i] + '44' }}>
                <div className="h-2" style={{ backgroundColor: COLORS[i] }} />
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.position} • Age {p.age}</div>
                    <div className="text-sm font-semibold text-primary mt-1">€{(p.marketValue/1e6).toFixed(0)}M</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card>
              <CardHeader><CardTitle>Attributes Radar</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    {selectedPlayers.map((p, i) => (
                      <Radar key={p.id} name={p.name} dataKey={p.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader><CardTitle>Season Statistics</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="stat" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    {selectedPlayers.map((p, i) => (
                      <Bar key={p.id} dataKey={p.name} fill={COLORS[i]} radius={[3,3,0,0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Stats Table */}
          <Card>
            <CardHeader><CardTitle>Head-to-Head Stats</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold text-muted-foreground">Metric</th>
                      {selectedPlayers.map((p, i) => (
                        <th key={p.id} className="text-center py-3 px-4 font-semibold" style={{ color: COLORS[i] }}>{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statRows.map(row => {
                      const vals = selectedPlayers.map(p => (p.statistics as unknown as Record<string,number>)?.[row.key] ?? 0)
                      const maxVal = Math.max(...vals)
                      return (
                        <tr key={row.key} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 pr-4 font-medium">{row.label}</td>
                          {vals.map((v, i) => (
                            <td key={i} className={`py-3 px-4 text-center font-bold ${v === maxVal && maxVal > 0 ? 'text-primary' : ''}`}>{v}</td>
                          ))}
                        </tr>
                      )
                    })}
                    {/* Market Value */}
                    <tr className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 pr-4 font-medium">Market Value</td>
                      {selectedPlayers.map((p, i) => (
                        <td key={i} className="py-3 px-4 text-center font-bold text-primary">€{(p.marketValue/1e6).toFixed(0)}M</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-3 pr-4 font-medium">Age</td>
                      {selectedPlayers.map((p, i) => (
                        <td key={i} className="py-3 px-4 text-center font-bold">{p.age}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { players, clubs } from "../data/demo"

const POSITIONS = ["All", "Striker", "Left Winger", "Right Winger", "Attacking Midfielder", "Central Midfielder", "Centre-Back"]
const LEAGUES = ["All", ...Array.from(new Set(clubs.map(c => c.league)))]

export default function TransferMarket() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posFilter, setPosFilter] = useState("All")
  const [leagueFilter, setLeagueFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'value' | 'age' | 'goals'>('value')

  let filtered = players.filter(player => {
    const matchName = !searchQuery || player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPos = posFilter === "All" || player.position === posFilter
    const club = clubs.find(c => c.id === player.currentClubId)
    const matchLeague = leagueFilter === "All" || club?.league === leagueFilter
    return matchName && matchPos && matchLeague
  })

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'value') return b.marketValue - a.marketValue
    if (sortBy === 'age') return a.age - b.age
    if (sortBy === 'goals') return (b.statistics?.goals ?? 0) - (a.statistics?.goals ?? 0)
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Transfer Market</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} players available</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search players..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-lg border bg-card">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Position</label>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={posFilter} onChange={e => setPosFilter(e.target.value)}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">League</label>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={leagueFilter} onChange={e => setLeagueFilter(e.target.value)}>
              {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Sort By</label>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="value">Highest Value</option>
              <option value="age">Youngest</option>
              <option value="goals">Most Goals</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(player => {
          const club = clubs.find(c => c.id === player.currentClubId)
          return (
            <Link key={player.id} to={`/players/${player.id}`}>
              <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {player.imageUrl ? (
                    <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                    €{(player.marketValue / 1e6).toFixed(0)}M
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">{player.name}</div>
                  <div className="text-sm text-muted-foreground flex justify-between items-center mt-1">
                    <span>{player.position}</span>
                    <span>{player.age} yrs</span>
                  </div>
                  {player.statistics && (
                    <div className="mt-3 pt-3 border-t flex justify-between text-xs text-muted-foreground">
                      <span>{player.statistics.goals} Goals</span>
                      <span>{player.statistics.assists} Assists</span>
                      <span>{player.statistics.appearances} Apps</span>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white overflow-hidden p-0.5">
                      {club?.logoUrl && <img src={club.logoUrl} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />}
                    </div>
                    <span className="text-sm font-medium">{club?.name || "Unknown"}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground">No players found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

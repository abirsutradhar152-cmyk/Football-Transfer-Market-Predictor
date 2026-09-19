import { useState, useEffect } from "react"
import { players, clubs, rumours } from "../data/demo"
import type { Player, TransferRumour } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Bookmark, BookmarkCheck, TrendingUp, Users, Bell, Trash2 } from "lucide-react"

// Watchlist persisted to localStorage
const STORAGE_KEY = "transferiq_watchlist"

type WatchlistItem = { type: 'player' | 'rumour', id: string, addedAt: string }

function loadWatchlist(): WatchlistItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}
function saveWatchlist(items: WatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(loadWatchlist)

  function toggle(type: WatchlistItem['type'], id: string) {
    setItems(prev => {
      const exists = prev.find(i => i.type === type && i.id === id)
      const next = exists ? prev.filter(i => !(i.type === type && i.id === id)) : [...prev, { type, id, addedAt: new Date().toISOString() }]
      saveWatchlist(next)
      return next
    })
  }

  function isWatched(type: WatchlistItem['type'], id: string) {
    return items.some(i => i.type === type && i.id === id)
  }

  function remove(type: WatchlistItem['type'], id: string) { toggle(type, id) }

  return { items, toggle, isWatched, remove }
}

export default function Watchlist() {
  const { items, remove, isWatched } = useWatchlist()

  const watchedPlayers = items.filter(i => i.type === 'player').map(i => players.find(p => p.id === i.id)).filter(Boolean) as Player[]
  const watchedRumours = items.filter(i => i.type === 'rumour').map(i => rumours.find(r => r.id === i.id)).filter(Boolean) as TransferRumour[]

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">Track players and rumours you're following.</p>
        </div>
        <div className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''} tracked</div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border rounded-xl border-dashed space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <div>
            <h3 className="font-semibold text-lg">Your watchlist is empty</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Add players and rumours from their pages using the <strong>Bookmark</strong> button.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/players'}>Browse Players</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Watched Players */}
          {watchedPlayers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Players ({watchedPlayers.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {watchedPlayers.map(p => {
                  const club = clubs.find(c => c.id === p.currentClubId)
                  return (
                    <Card key={p.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.position}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {club?.logoUrl && <img src={club.logoUrl} alt="" className="w-3.5 h-3.5" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />}
                            <span className="text-xs text-muted-foreground">{club?.name}</span>
                          </div>
                          <div className="text-sm font-bold text-primary mt-1">€{(p.marketValue/1e6).toFixed(0)}M</div>
                        </div>
                        <button onClick={() => remove('player', p.id)} className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Watched Rumours */}
          {watchedRumours.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Rumours ({watchedRumours.length})
              </h2>
              <div className="grid gap-4">
                {watchedRumours.map(r => {
                  const player = players.find(p => p.id === r.playerId)
                  const toClub = clubs.find(c => c.id === r.interestedClubId)
                  const fromClub = clubs.find(c => c.id === r.currentClubId)
                  return (
                    <Card key={r.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                            {player?.imageUrl && <img src={player.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />}
                          </div>
                          <div>
                            <div className="font-bold">{player?.name}</div>
                            <div className="text-sm text-muted-foreground">{fromClub?.name} → {toClub?.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Probability</div>
                            <div className="font-bold text-primary">{r.transferProbability}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Status</div>
                            <div className="font-semibold text-sm">{r.status}</div>
                          </div>
                          <button onClick={() => remove('rumour', r.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

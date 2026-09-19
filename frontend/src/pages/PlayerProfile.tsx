import { useParams } from "react-router-dom"
import { players, clubs } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Target, TrendingUp, Activity, BarChart3, Shield } from "lucide-react"

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>()
  // If no id, just use first player for demo purposes if navigating to /players
  const player = id ? players.find(p => p.id === id) : players[0]
  
  if (!player) {
    return <div className="p-8 text-center text-muted-foreground">Player not found</div>
  }

  const club = clubs.find(c => c.id === player.currentClubId)
  const stats = player.statistics

  return (
    <div className="space-y-6 pb-8">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 max-w-sm rounded-xl overflow-hidden bg-muted border shadow-sm aspect-[4/5] relative">
          {player.imageUrl ? (
            <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
               No Image
             </div>
          )}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-bold shadow-sm">
            {player.shirtNumber}
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-muted-foreground mb-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {player.position}
              </span>
              <span>•</span>
              <span>{player.nationality}</span>
              <span>•</span>
              <span>{player.age} Years Old</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">{player.name}</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Market Value</div>
                <div className="text-2xl font-bold">€{(player.marketValue / 1000000).toFixed(0)}M</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Current Club</div>
                <div className="text-xl font-bold truncate flex items-center gap-2">
                  {club?.logoUrl && <img src={club.logoUrl} alt="" className="w-5 h-5" />}
                  {club?.name}
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Contract Expires</div>
                <div className="text-xl font-bold">{new Date(player.contractExpiry).getFullYear()}</div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Preferred Foot</div>
                <div className="text-xl font-bold">{player.preferredFoot}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <h2 className="text-2xl font-heading font-semibold mt-12 mb-4">Season Performance</h2>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="mr-2 h-4 w-4" /> Goals & Assists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.goals} / {stats.assists}</div>
              <p className="text-xs text-muted-foreground mt-1">in {stats.appearances} appearances</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" /> Expected (xG / xA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.xG} / {stats.xA}</div>
              <p className="text-xs text-green-500 mt-1 font-medium">Overperforming</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Activity className="mr-2 h-4 w-4" /> Passing Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.passAccuracy}%</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.passes} total passes</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" /> Progressive Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.progressivePasses}</div>
              <p className="text-xs text-muted-foreground mt-1">Passes & {stats.progressiveCarries} carries</p>
            </CardContent>
          </Card>
        </div>
      ) : (
         <Card>
           <CardContent className="p-8 text-center text-muted-foreground">
             Detailed statistics unavailable for this player.
           </CardContent>
         </Card>
      )}

      {/* Best Destinations */}
      <h2 className="text-2xl font-heading font-semibold mt-12 mb-4">Best Destinations</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {/* Demo destinations */}
         {[
           { name: "Arsenal FC", fit: 91, logo: clubs[0].logoUrl },
           { name: "Real Madrid", fit: 88, logo: clubs[1].logoUrl },
           { name: "Bayern Munich", fit: 82, logo: clubs[2].logoUrl },
         ].map((dest, i) => (
           <Card key={i}>
             <CardContent className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-muted p-1">
                   <img src={dest.logo} alt="" className="w-full h-full object-cover" />
                 </div>
                 <span className="font-semibold">{dest.name}</span>
               </div>
               <div className="text-primary font-bold">{dest.fit}% Fit</div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  )
}

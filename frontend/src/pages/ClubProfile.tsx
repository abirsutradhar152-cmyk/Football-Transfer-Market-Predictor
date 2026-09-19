import { useParams } from "react-router-dom"
import { clubs, players } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Users, Target, Activity } from "lucide-react"

export default function ClubProfile() {
  const { id } = useParams<{ id: string }>()
  const club = id ? clubs.find(c => c.id === id) : clubs[0]

  if (!club) {
    return <div className="p-8 text-center text-muted-foreground">Club not found</div>
  }

  const squad = players.filter(p => p.currentClubId === club.id)
  const squadValue = squad.reduce((total, p) => total + p.marketValue, 0)

  return (
    <div className="space-y-6 pb-8">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/4 max-w-[200px] rounded-xl overflow-hidden bg-white border shadow-sm aspect-square p-6 flex items-center justify-center">
          {club.logoUrl ? (
            <img src={club.logoUrl} alt={club.name} className="w-full h-full object-contain" />
          ) : (
             <div className="text-muted-foreground">No Logo</div>
          )}
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-muted-foreground mb-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {club.league}
              </span>
              <span>•</span>
              <span>{club.country}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">{club.name}</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Manager</div>
                <div className="text-xl font-bold truncate">{club.manager}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Stadium</div>
                <div className="text-xl font-bold truncate">{club.stadium}</div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Transfer Budget</div>
                <div className="text-xl font-bold text-primary">€{(club.estimatedBudget / 1000000).toFixed(0)}M</div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground">Tactical Style</div>
                <div className="text-sm font-bold truncate mt-1">{club.tacticalStyle}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Squad Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
             <CardTitle className="flex items-center">
               <Users className="mr-2 h-5 w-5 text-primary" />
               Current Squad
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {squad.length > 0 ? squad.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="font-bold w-6 text-center text-muted-foreground">{player.shirtNumber}</div>
                     <div>
                       <div className="font-semibold">{player.name}</div>
                       <div className="text-xs text-muted-foreground">{player.position}</div>
                     </div>
                   </div>
                   <div className="font-medium">€{(player.marketValue / 1000000).toFixed(0)}M</div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">Squad data unavailable</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center text-lg">
                 <Activity className="mr-2 h-5 w-5 text-primary" />
                 Squad Needs
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 text-sm">
                 <div className="flex justify-between items-center pb-2 border-b">
                   <span className="font-medium">Striker</span>
                   <span className="text-red-500 font-semibold bg-red-500/10 px-2 py-0.5 rounded">Critical</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b">
                   <span className="font-medium">Centre-back</span>
                   <span className="text-yellow-500 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded">Moderate</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b">
                   <span className="font-medium">Left-back</span>
                   <span className="text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded">Low</span>
                 </div>
               </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
               <CardTitle className="flex items-center text-lg">
                 <Target className="mr-2 h-5 w-5 text-primary" />
                 Recommended
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {[
                   { name: "Victor Osimhen", fit: 92, pos: "Striker" },
                   { name: "Ivan Toney", fit: 88, pos: "Striker" }
                 ].map((rec, i) => (
                   <div key={i} className="flex justify-between items-center">
                     <div>
                       <div className="font-medium text-sm">{rec.name}</div>
                       <div className="text-xs text-muted-foreground">{rec.pos}</div>
                     </div>
                     <div className="font-bold text-primary text-sm">{rec.fit}/100</div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

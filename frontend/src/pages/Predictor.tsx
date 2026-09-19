import { useState } from "react"
import { players, clubs } from "../data/demo"
import { api } from "../lib/api"

export interface PredictionFactor {
  name: string;
  weight: number;
  score: number;
  positive: boolean;
  description: string;
}

export interface PredictionResult {
  probability: number;
  confidence: number;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  difficulty: 'Low' | 'Moderate' | 'High' | 'Extreme';
  factors: PredictionFactor[];
}
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { ArrowRight, CheckCircle2, XCircle, Activity, Loader2 } from "lucide-react"


export default function Predictor() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("")
  const [targetClubId, setTargetClubId] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const steps = [
    "Analyzing player profile...",
    "Analyzing club needs...",
    "Checking financial feasibility...",
    "Evaluating tactical fit...",
    "Generating prediction..."
  ]

  const handlePredict = async () => {
    if (!selectedPlayerId || !targetClubId) return
    
    setIsAnalyzing(true)
    setResult(null)
    setAnalysisStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < steps.length) {
        setAnalysisStep(step)
      } else {
        clearInterval(interval)
      }
    }, 600)

    try {
      const data = await api.predictTransfer(selectedPlayerId, targetClubId)
      
      // Wait for the animation to finish if it hasn't already
      const remainingTime = Math.max(0, (steps.length * 600) - (step * 600))
      setTimeout(() => {
        setResult(data)
        setIsAnalyzing(false)
        clearInterval(interval)
        setAnalysisStep(steps.length)
      }, remainingTime)
      
    } catch (error) {
      console.error("Prediction failed:", error)
      setIsAnalyzing(false)
      clearInterval(interval)
    }
  }

  const selectedPlayer = players.find(p => p.id === selectedPlayerId)
  const currentClub = selectedPlayer ? clubs.find(c => c.id === selectedPlayer.currentClubId) : null
  const targetClub = clubs.find(c => c.id === targetClubId)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-heading font-extrabold tracking-tight">Transfer Predictor</h1>
        <p className="text-muted-foreground text-lg">AI-powered analysis of potential market moves</p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Player Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground">Select Player</label>
              <select 
                className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                <option value="">Choose a player...</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {selectedPlayer && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-muted rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                    {selectedPlayer.imageUrl && <img src={selectedPlayer.imageUrl} alt="" className="w-full h-full object-cover"/>}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedPlayer.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {currentClub?.logoUrl && <img src={currentClub.logoUrl} alt="" className="w-3 h-3"/>}
                      {currentClub?.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center hidden md:flex">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="text-primary w-6 h-6" />
              </div>
            </div>

            {/* Target Club Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground">Target Club</label>
              <select 
                className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                value={targetClubId}
                onChange={(e) => setTargetClubId(e.target.value)}
              >
                <option value="">Choose a destination...</option>
                {clubs.filter(c => c.id !== selectedPlayer?.currentClubId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {targetClub && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-muted rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden p-1">
                    {targetClub.logoUrl && <img src={targetClub.logoUrl} alt="" className="w-full h-full object-contain"/>}
                  </div>
                  <div>
                    <div className="font-semibold">{targetClub.name}</div>
                    <div className="text-xs text-muted-foreground">{targetClub.league}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              className="w-full md:w-auto md:min-w-[200px]"
              disabled={!selectedPlayerId || !targetClubId || isAnalyzing}
              onClick={handlePredict}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Analyze Transfer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="border-primary/50 bg-primary/5 animate-pulse">
          <CardContent className="p-8 text-center space-y-4">
            <Activity className="w-12 h-12 mx-auto text-primary animate-bounce" />
            <h3 className="text-xl font-semibold text-primary">{steps[analysisStep]}</h3>
            <div className="w-full max-w-md mx-auto bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((analysisStep + 1) / steps.length) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-gradient-to-br from-card to-muted border-primary/20">
              <CardContent className="p-8 text-center flex flex-col justify-center h-full space-y-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transfer Probability</div>
                <div className="text-7xl font-extrabold text-primary">{result.probability}%</div>
                <div className="flex justify-center gap-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-semibold">{result.confidence}/100 — {result.confidenceLabel}</div>
                  </div>
                  <div>
                     <div className="text-xs text-muted-foreground">Difficulty</div>
                     <div className="font-semibold">{result.difficulty}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
               <CardHeader>
                 <CardTitle>Analysis Breakdown</CardTitle>
                 <CardDescription>How the system reached this prediction</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    {result.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">{factor.name}</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${factor.positive ? 'bg-primary' : 'bg-destructive'}`} 
                            style={{ width: `${factor.score}%` }} 
                          />
                        </div>
                        <div className="w-12 text-right text-sm font-semibold">{factor.score}/100</div>
                      </div>
                    ))}
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Positive Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.factors.filter(f => f.positive).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 font-bold">✓</span> {f.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="mr-2 h-5 w-5" /> Negative Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.factors.filter(f => !f.positive).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold">⚠</span> {f.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from "react"
import { players } from "../data/demo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Calculator, TrendingDown, TrendingUp, Info } from "lucide-react"

function SliderField({ label, value, min, max, step = 1, onChange, format = (v: number) => String(v) }: {
  label: string, value: number, min: number, max: number, step?: number,
  onChange: (v: number) => void, format?: (v: number) => string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-bold text-primary">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

function FeeBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">€{(value / 1e6).toFixed(1)}M</span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
    </div>
  )
}

export default function FeeEstimator() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0].id)
  const [contractMonths, setContractMonths] = useState(24)
  const [performanceScore, setPerformanceScore] = useState(75)
  const [demand, setDemand] = useState(70)
  const [injuryHistory, setInjuryHistory] = useState(20) // % of seasons with significant injuries
  const [result, setResult] = useState<null | { min: number, expected: number, max: number, marketValue: number }>(null)

  const selectedPlayer = players.find(p => p.id === selectedPlayerId)!

  function estimate() {
    const base = selectedPlayer.marketValue
    // Contract factor: more time left = higher fee
    const contractFactor = 0.7 + (contractMonths / 60) * 0.6
    // Performance boost
    const performanceFactor = 0.8 + (performanceScore / 100) * 0.4
    // Demand boost
    const demandFactor = 0.9 + (demand / 100) * 0.3
    // Injury discount
    const injuryFactor = 1 - (injuryHistory / 100) * 0.25
    // Age factor (younger = premium)
    const ageFactor = selectedPlayer.age < 24 ? 1.15 : selectedPlayer.age < 28 ? 1.0 : selectedPlayer.age < 32 ? 0.85 : 0.65

    const expected = Math.round(base * contractFactor * performanceFactor * demandFactor * injuryFactor * ageFactor)
    const min = Math.round(expected * 0.82)
    const max = Math.round(expected * 1.25)
    setResult({ min, expected, max, marketValue: base })
  }

  const fmt = (v: number) => `€${(v / 1e6).toFixed(0)}M`

  return (
    <div className="space-y-6 pb-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Transfer Fee Estimator</h1>
        <p className="text-muted-foreground mt-1">Analytical model to estimate realistic transfer fees based on player profile and market conditions.</p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-blue-400">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>This is an <strong>analytical estimate</strong>, not a real valuation. Actual fees depend on negotiation, financial fair play, and real-time market conditions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /> Input Parameters</CardTitle>
            <CardDescription>Adjust factors to compute the fee estimate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Player</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedPlayerId}
                onChange={e => { setSelectedPlayerId(e.target.value); setResult(null) }}
              >
                {players.map(p => <option key={p.id} value={p.id}>{p.name} — €{(p.marketValue/1e6).toFixed(0)}M</option>)}
              </select>
              {selectedPlayer && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mt-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                    <img src={selectedPlayer.imageUrl} alt="" className="w-full h-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  </div>
                  <div>
                    <div className="font-semibold">{selectedPlayer.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedPlayer.position} • Age {selectedPlayer.age} • {selectedPlayer.nationality}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-muted-foreground">Market Value</div>
                    <div className="font-bold text-primary">€{(selectedPlayer.marketValue/1e6).toFixed(0)}M</div>
                  </div>
                </div>
              )}
            </div>

            <SliderField label="Contract Remaining (months)" value={contractMonths} min={1} max={60} onChange={v => { setContractMonths(v); setResult(null) }} format={v => `${v} months`} />
            <SliderField label="Recent Performance Score" value={performanceScore} min={0} max={100} onChange={v => { setPerformanceScore(v); setResult(null) }} format={v => `${v}/100`} />
            <SliderField label="Transfer Demand (club interest level)" value={demand} min={0} max={100} onChange={v => { setDemand(v); setResult(null) }} format={v => `${v}/100`} />
            <SliderField label="Injury History (% of seasons affected)" value={injuryHistory} min={0} max={80} onChange={v => { setInjuryHistory(v); setResult(null) }} format={v => `${v}%`} />

            <Button className="w-full" onClick={estimate}>
              <Calculator className="mr-2 h-4 w-4" /> Calculate Estimated Fee
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className={`transition-all duration-500 ${result ? 'border-primary/30 bg-primary/5' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Estimated Transfer Fee</CardTitle>
            <CardDescription>Breakdown based on your input parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Main expected fee */}
                <div className="text-center py-6 border rounded-xl bg-card">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Expected Transfer Fee</div>
                  <div className="text-5xl font-extrabold text-primary">€{(result.expected / 1e6).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground mt-2">Analytical estimate based on inputs</div>
                </div>

                {/* Fee range bars */}
                <div className="space-y-4 pt-2">
                  <FeeBar label="Market Value" value={result.marketValue} max={result.max * 1.1} color="bg-slate-400" />
                  <FeeBar label="Minimum Realistic Fee" value={result.min} max={result.max * 1.1} color="bg-blue-400" />
                  <FeeBar label="Expected Fee" value={result.expected} max={result.max * 1.1} color="bg-primary" />
                  <FeeBar label="Maximum Realistic Fee" value={result.max} max={result.max * 1.1} color="bg-yellow-400" />
                </div>

                {/* Comparison vs market value */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <div className="text-xs text-muted-foreground">vs. Market Value</div>
                    <div className="font-semibold">{result.expected > result.marketValue ? 'Premium' : 'Discount'}</div>
                  </div>
                  <div className={`flex items-center gap-1 font-bold text-lg ${result.expected > result.marketValue ? 'text-green-400' : 'text-red-400'}`}>
                    {result.expected > result.marketValue ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {((Math.abs(result.expected - result.marketValue) / result.marketValue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
                <Calculator className="w-12 h-12 opacity-20" />
                <p>Configure the parameters and click <strong>Calculate</strong> to see the estimated fee range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

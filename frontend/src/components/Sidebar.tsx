import { NavLink } from "react-router-dom"
import { 
  Home, 
  Search, 
  Activity, 
  Users, 
  Trophy, 
  TrendingUp,
  Bookmark,
  MessageSquare,
  BarChart3,
  Calculator,
  GitCompare,
  Gamepad2,
  DollarSign,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transfer Market", href: "/transfer-market", icon: Search },
  { name: "Predictor", href: "/predict", icon: Activity },
  { name: "Players", href: "/players", icon: Users },
  { name: "Clubs", href: "/clubs", icon: Trophy },
  { name: "Rumours", href: "/rumours", icon: TrendingUp },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Fee Estimator", href: "/fee-estimator", icon: DollarSign },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Simulator", href: "/simulator", icon: Gamepad2 },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
]

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-heading font-bold text-primary tracking-tight">TransferIQ</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <item.icon
              className="mr-3 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-muted-foreground">Demo Mode</span>
        </div>
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import TransferMarket from "./pages/TransferMarket"
import PlayerProfile from "./pages/PlayerProfile"
import ClubProfile from "./pages/ClubProfile"
import Predictor from "./pages/Predictor"
import Rumours from "./pages/Rumours"
import FeeEstimator from "./pages/FeeEstimator"
import Compare from "./pages/Compare"
import Analytics from "./pages/Analytics"
import Watchlist from "./pages/Watchlist"
import Simulator from "./pages/Simulator"
import Assistant from "./pages/Assistant"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="transfer-market" element={<TransferMarket />} />
          <Route path="predict" element={<Predictor />} />
          <Route path="players" element={<PlayerProfile />} />
          <Route path="players/:id" element={<PlayerProfile />} />
          <Route path="clubs" element={<ClubProfile />} />
          <Route path="clubs/:id" element={<ClubProfile />} />
          <Route path="rumours" element={<Rumours />} />
          <Route path="fee-estimator" element={<FeeEstimator />} />
          <Route path="compare" element={<Compare />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

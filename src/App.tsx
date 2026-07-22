import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Offers from './pages/Offers'
import Claimed from './pages/Claimed'
import AddOffer from './pages/AddOffer'
import Settings from './pages/Settings'

function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/new" element={<AddOffer />} />
            <Route path="/claimed" element={<Claimed />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppDataProvider>
  )
}

export default App

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'
import GlobalSearchModal from './components/GlobalSearchModal'
import QuoteModal from './components/QuoteModal'
import ToastContainer from './components/ToastContainer'
import HomePage from './pages/HomePage'
import FlightsPage from './pages/FlightsPage'
import FlightCheckoutPage from './pages/FlightCheckoutPage'
import PortalPage from './pages/PortalPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-page text-ink">
          <TopBar />
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/flights/checkout" element={<FlightCheckoutPage />} />
              <Route path="/account" element={<PortalPage mode="account" />} />
              <Route path="/agent" element={<PortalPage mode="agent" />} />
              <Route path="/admin" element={<PortalPage mode="admin" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <FloatingActions />
          <GlobalSearchModal />
          <QuoteModal />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { COPY, INITIAL_APPLICATIONS } from '../data/siteData'

const AppContext = createContext(null)

const STORAGE_KEY = 'lusan_travels_applications_v1'

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en')
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_APPLICATIONS
  })

  const [activeBookingTab, setActiveBookingTab] = useState('flight')
  const [selectedCountryId, setSelectedCountryId] = useState('romania')
  const [workPermitFormCountry, setWorkPermitFormCountry] = useState('Romania')

  // Cost Calculator state
  const [calcCountryId, setCalcCountryId] = useState('romania')
  const [calcJob, setCalcJob] = useState('Construction')
  const [calcExperience, setCalcExperience] = useState(3)
  const [calcIncludeTicket, setCalcIncludeTicket] = useState(true)

  // Modals & Track state
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quoteContext, setQuoteContext] = useState('')
  const [trackedResult, setTrackedResult] = useState(null)
  const [trackNotFound, setTrackNotFound] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    } catch {
      // ignore storage errors
    }
  }, [applications])

  // Keyboard shortcut Cmd/Ctrl+K for global live search
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addApplication = useCallback(({ prefix = 'LT-WP', applicant, phone, service, country, role }) => {
    const num = String(100 + Math.floor(Math.random() * 899)).padStart(5, '0')
    const id = `${prefix}-${num}`
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const newApp = {
      id,
      passport: 'PENDING',
      applicant: (applicant || 'Guest Applicant').toUpperCase(),
      phone: phone || '+880',
      service,
      country,
      role,
      officer: 'Assigned Desk Officer',
      submittedAt: today,
      currentStep: 0,
      statusLabel: 'Application Received — Assessment Queued',
      steps: [
        { title: 'File Received & Logged Online', date: today, done: true },
        { title: 'Document Verification & Officer Call', date: 'Within 24 hours', done: false, active: true },
        { title: 'Processing & Embassy / Airline Action', date: 'Pending', done: false },
        { title: 'Final Handover & Briefing', date: 'Pending', done: false },
      ],
    }
    setApplications((prev) => [newApp, ...prev])
    return newApp
  }, [])

  const trackApplication = useCallback(
    (query) => {
      const cleaned = query.trim().toLowerCase()
      if (!cleaned) {
        setTrackedResult(null)
        setTrackNotFound(false)
        return null
      }
      const found = applications.find(
        (app) =>
          app.id.toLowerCase() === cleaned ||
          (app.passport && app.passport.toLowerCase() === cleaned) ||
          app.phone.replace(/\s+/g, '').includes(cleaned.replace(/\s+/g, ''))
      )
      if (found) {
        setTrackedResult(found)
        setTrackNotFound(false)
      } else {
        setTrackedResult(null)
        setTrackNotFound(true)
      }
      return found || null
    },
    [applications]
  )

  const openQuoteModal = useCallback((ctx = '') => {
    setQuoteContext(ctx)
    setQuoteModalOpen(true)
  }, [])

  const t = COPY[lang]

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        applications,
        addApplication,
        activeBookingTab,
        setActiveBookingTab,
        selectedCountryId,
        setSelectedCountryId,
        workPermitFormCountry,
        setWorkPermitFormCountry,
        calcCountryId,
        setCalcCountryId,
        calcJob,
        setCalcJob,
        calcExperience,
        setCalcExperience,
        calcIncludeTicket,
        setCalcIncludeTicket,
        searchModalOpen,
        setSearchModalOpen,
        quoteModalOpen,
        setQuoteModalOpen,
        quoteContext,
        openQuoteModal,
        trackedResult,
        trackNotFound,
        trackApplication,
        setTrackedResult,
        setTrackNotFound,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

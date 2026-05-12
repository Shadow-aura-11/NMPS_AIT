import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

/* ──────────────────────────────────────────────
   MOCK USERS  (role → credentials → profile)
   ────────────────────────────────────────────── */
const USERS = [
  {
    id: 'ADM001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Rajesh Kumar',
    designation: 'System Administrator',
    email: 'admin@newmorningstar.edu.in',
    avatar: 'RK',
  },
]

/* ──────────────────────────────────────────────
   MOCK DATA  — shared across dashboards
   ────────────────────────────────────────────── */
export const MOCK_DATA = {
  /* ── students ── */
  students: [],

  /* ── attendance ── */
  attendanceLog: [],

  /* ── timetable ── */
  timetable: {
    'Monday':    [],
    'Tuesday':   [],
    'Wednesday': [],
    'Thursday':  [],
    'Friday':    [],
    'Saturday':  [],
  },
  periods: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'],

  /* ── exam types ── */
  examTypes: ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'],

  /* ── student detailed results ── */
  studentResults: {},

  /* ── homework (Educational) ── */
  homework: [],

  /* ── fees (Educational) ── */
  studentFees: {},

  /* ── notices (Feature Explanations) ── */
  notices: [],

  /* ── messages ── */
  messages: [],

  /* ── staff ── */
  staff: [],

  /* ── transport ── */
  transport: [],

  /* ── classes & sections ── */
  classesAndSections: [],
  availableClasses: ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
}

/* ──────────────────────────────────────────────
   SESSION UTILITIES
   ────────────────────────────────────────────── */

/** Dynamic list of academic sessions */
export function getStoredSessions() {
  const saved = localStorage.getItem('nms_sessions_list')
  return saved ? JSON.parse(saved) : ["2023-24", "2024-25", "2025-26"]
}

/** Fee localStorage key per session */
export const feeKey = (session) => `nms_fees_${session}`

/** General data localStorage key per session (homework, attendance, etc.) */
export const dataKey = (session) => `nms_data_${session}`

/** Get fees for a student in a specific session */
export function getSessionFees(studentId, session) {
  const stored = localStorage.getItem(feeKey(session))
  const data = stored ? JSON.parse(stored) : {}
  return data[studentId] || null
}

/** Get all data for a specific session */
export function getSessionStore(session) {
  const stored = localStorage.getItem(dataKey(session))
  if (stored) return JSON.parse(stored)

  return { 
    homework: [], 
    attendance: [], 
    results: {}, 
    notices: [],
    feeStats: { collected: 0, pending: 0, overdue: 0, total: 0 } 
  }
}

/** Save data for a specific session */
export function saveSessionStore(session, data) {
  localStorage.setItem(dataKey(session), JSON.stringify(data))
}

/** Save fees for a student in a specific session */
export function saveSessionFees(studentId, session, record, allRecords) {
  const key = feeKey(session)
  const updated = { ...allRecords, [studentId]: record }
  localStorage.setItem(key, JSON.stringify(updated))
  return updated
}


/* ──────────────────────────────────────────────
   AUTH PROVIDER
   ────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nms_user')
    return saved ? JSON.parse(saved) : null
  })
  const [sessions, setSessions] = useState(getStoredSessions)
  const [currentSession, setCurrentSession] = useState(() => {
    return localStorage.getItem('nms_session') || '2026-27'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) localStorage.setItem('nms_user', JSON.stringify(user))
    else localStorage.removeItem('nms_user')
  }, [user])

  useEffect(() => {
    localStorage.setItem('nms_sessions_list', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('nms_session', currentSession)

    // Also sync with CmsContext session field
    const cmsRaw = localStorage.getItem('nms_cms_content')
    if (cmsRaw) {
      try {
        const cms = JSON.parse(cmsRaw)
        cms.session = currentSession
        localStorage.setItem('nms_cms_content', JSON.stringify(cms))
      } catch (_) {}
    }
  }, [currentSession])

  const login = (username, password) => {
    setError('')
    const dynamicUsers = JSON.parse(localStorage.getItem('nms_dynamic_users') || '[]')
    const allUsers = [...USERS, ...dynamicUsers]
    
    const found = allUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )
    if (found) {
      const { password: _, ...safeUser } = found
      setUser(safeUser)
      return true
    }
    setError('Invalid username or password. Please try again.')
    return false
  }

  const logout = () => {
    setUser(null)
    setError('')
  }

  const updateSession = (year) => {
    setCurrentSession(year)
  }

  const addSession = (year) => {
    if (!sessions.includes(year)) {
      const newSessions = [...sessions, year].sort()
      setSessions(newSessions)
      
      // Initialize unique data for this session
      const initialData = {
        homework: [
          { id: Date.now(), subject: 'General', title: 'Welcome to ' + year, assignedBy: 'Admin', date: new Date().toISOString().split('T')[0], due: '', status: 'Pending', desc: 'Auto-initialized session.' }
        ],
        attendance: [],
        notices: [
          { id: 'start-' + year, title: 'New Academic Year Started: ' + year, date: new Date().toISOString().split('T')[0], category: 'General', priority: 'high', desc: 'All modules are now active for ' + year }
        ],
        results: {},
        feeStats: { collected: 0, pending: 0, overdue: 0, total: 2500000 }
      }
      localStorage.setItem(dataKey(year), JSON.stringify(initialData))

      // Carry over static configurations from currentSession
      const classData = localStorage.getItem(`nms_classes_${currentSession}`) || localStorage.getItem('nms_classes')
      if (classData) localStorage.setItem(`nms_classes_${year}`, classData)

      const transportData = localStorage.getItem(`nms_transport_${currentSession}`) || localStorage.getItem('nms_transport')
      if (transportData) localStorage.setItem(`nms_transport_${year}`, transportData)

      const feeConfigData = localStorage.getItem(`nms_global_fee_config_${currentSession}`) || localStorage.getItem('nms_global_fee_config')
      if (feeConfigData) localStorage.setItem(`nms_global_fee_config_${year}`, feeConfigData)

      return true
    }
    return false
  }

  const deleteSession = (year) => {
    if (year === currentSession) return false
    const newSessions = sessions.filter(s => s !== year)
    setSessions(newSessions)
    
    // Wipe session-specific data
    localStorage.removeItem(dataKey(year))
    localStorage.removeItem(feeKey(year))
    return true
  }

  const updateProfile = (data) => {
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    
    // Also update dynamic users list if this is a non-admin user
    const dynamicUsers = JSON.parse(localStorage.getItem('nms_dynamic_users') || '[]')
    const updatedList = dynamicUsers.map(u => u.id === user.id ? { ...u, ...data } : u)
    if (dynamicUsers.length > 0) {
      localStorage.setItem('nms_dynamic_users', JSON.stringify(updatedList))
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, error, setError, 
      currentSession, updateSession,
      sessions, addSession, deleteSession,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Compute total unpaid carry-forward from all previous sessions */
export function getPreviousSessionsDue(studentId, currentSession, allSessions) {
  const sessionsList = allSessions || getStoredSessions()
  const currentIndex = sessionsList.indexOf(currentSession)
  if (currentIndex <= 0) return []
  const pastSessions = sessionsList.slice(0, currentIndex)
  const dues = []
  for (const session of pastSessions) {
    const rec = getSessionFees(studentId, session)
    if (rec && rec.remaining > 0) {
      dues.push({ session, remaining: rec.remaining })
    }
  }
  return dues
}

/** Compute total unpaid carry-forward from all previous sessions for all students */
export function getTotalPastDues(currentSession, allSessions, students) {
  const sessionsList = allSessions || getStoredSessions()
  const currentIndex = sessionsList.indexOf(currentSession)
  if (currentIndex <= 0) return 0
  
  const pastSessions = sessionsList.slice(0, currentIndex)
  let total = 0
  
  for (const session of pastSessions) {
    const stored = localStorage.getItem(feeKey(session))
    if (!stored) continue
    const data = JSON.parse(stored)
    Object.values(data).forEach(rec => {
      if (rec && rec.remaining > 0) total += rec.remaining
    })
  }
  return total
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


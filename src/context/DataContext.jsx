import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth, getSessionStore, saveSessionStore, dataKey } from './AuthContext'

const DataContext = createContext(null)

const INITIAL_MOCK_STUDENTS = []
const INITIAL_MOCK_STAFF = []
const INITIAL_MOCK_TRANSPORT = []
const INITIAL_MOCK_VEHICLES = []

export function DataProvider({ children }) {
  const { currentSession } = useAuth()

  // 1. Centralized State
  const [students, setStudents] = useState(() => {
    // Initial load tries to get session specific
    const saved = localStorage.getItem(`nms_students_${currentSession}`)
    let loaded = [] // Start blank for new sessions
    try {
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) loaded = parsed
      } else {
        loaded = []
      }
    } catch (e) { console.error("Failed to parse students", e) }
    
    // Auto-migrate any cached Roman Numerals to the new standard pattern
    const classMap = { 'XII': '10th', 'XI': '10th', 'X': '10th', 'IX': '9th', 'VIII': '8th', 'VII': '7th', 'VI': '6th', 'V': '5th', 'IV': '4th', 'III': '3rd', 'II': '2nd', 'I': '1st' }
    let migrated = false
    loaded = loaded.map(s => {
      if (classMap[s.class]) { migrated = true; return { ...s, class: classMap[s.class] } }
      if (s.class && s.class.includes('-')) {
        let parts = s.class.split('-')
        let c = parts[0]
        if (classMap[c]) c = classMap[c]
        migrated = true; return { ...s, class: c, section: parts[1] || s.section }
      }
      return s
    })
    
    if (migrated && saved) localStorage.setItem(`nms_students_${currentSession}`, JSON.stringify(loaded))
    return loaded
  })

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('nms_staff')
    return saved ? JSON.parse(saved) : INITIAL_MOCK_STAFF
  })

  // Session specific states
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState({})
  const [homework, setHomework] = useState([])
  const [notices, setNotices] = useState([])
  const [feeStats, setFeeStats] = useState({ collected: 0, pending: 0, overdue: 0, total: 2500000 })
  const [holidays, setHolidays] = useState(['2026-01-26', '2026-08-15', '2026-10-02'])
  
  const [generalExpenses, setGeneralExpenses] = useState([])
  const [fleetLogs, setFleetLogs] = useState([])
  const [transportRoutes, setTransportRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [refreshTick, setRefreshTick] = useState(0)

  const [globalClasses, setGlobalClasses] = useState(() => {
    return JSON.parse(localStorage.getItem(`nms_classes_${currentSession}`) || localStorage.getItem('nms_classes') || JSON.stringify([
      { class: 'PG', sections: [{ name: 'A', teacher: '' }] },
      { class: 'LKG', sections: [{ name: 'A', teacher: '' }] },
      { class: 'UKG', sections: [{ name: 'A', teacher: '' }] },
      { class: '1st', sections: [{ name: 'A', teacher: '' }, { name: 'B', teacher: '' }] },
      { class: '2nd', sections: [{ name: 'A', teacher: '' }] },
      { class: '3rd', sections: [{ name: 'A', teacher: '' }] },
      { class: '4th', sections: [{ name: 'A', teacher: '' }] },
      { class: '5th', sections: [{ name: 'A', teacher: '' }] },
      { class: '6th', sections: [{ name: 'A', teacher: '' }] },
      { class: '7th', sections: [{ name: 'A', teacher: '' }] },
      { class: '8th', sections: [{ name: 'A', teacher: '' }] },
      { class: '9th', sections: [{ name: 'A', teacher: '' }] },
      { class: '10th', sections: [{ name: 'A', teacher: '' }, { name: 'B', teacher: '' }] }
    ]))
  })

  // Load data when session changes
  useEffect(() => {
    const store = getSessionStore(currentSession)
    
    // Update students for the selected session
    const savedStudents = localStorage.getItem(`nms_students_${currentSession}`)
    if (savedStudents) {
      try {
        setStudents(JSON.parse(savedStudents))
      } catch (e) { console.error("Failed to parse students for session", e) }
    } else if (currentSession === '2026-27' || currentSession === '2025-26') {
      const globalSaved = localStorage.getItem('nms_students')
      setStudents(globalSaved ? JSON.parse(globalSaved) : INITIAL_MOCK_STUDENTS)
    } else {
      setStudents([])
    }

    setAttendance(store.attendance || [])
    setMarks(store.results || {})
    setHomework(store.homework || [])
    setNotices(store.notices || [])
    
    // Load transport routes for session
    const savedRoutes = localStorage.getItem(`nms_transport_${currentSession}`)
    setTransportRoutes(savedRoutes ? JSON.parse(savedRoutes) : (currentSession.includes('2026') ? INITIAL_MOCK_TRANSPORT : []))
    
    const hSaved = localStorage.getItem('nms_holidays')
    if (hSaved) setHolidays(JSON.parse(hSaved))


    setGeneralExpenses(JSON.parse(localStorage.getItem(`nms_expenses_${currentSession}`) || localStorage.getItem('nms_expenses') || '[]'))
    setFleetLogs(JSON.parse(localStorage.getItem(`nms_fleet_logs_${currentSession}`) || localStorage.getItem('nms_fleet_logs') || '[]'))
    setVehicles(JSON.parse(localStorage.getItem('nms_vehicles') || JSON.stringify(INITIAL_MOCK_VEHICLES)))

    const cSaved = localStorage.getItem(`nms_classes_${currentSession}`) || localStorage.getItem('nms_classes')
    if (cSaved) setGlobalClasses(JSON.parse(cSaved))
  }, [currentSession])

  // 1.5. Dynamic Fee Statistics Calculation
  useEffect(() => {
    const feeKeyStr = `nms_fees_${currentSession}`
    const currentFees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    const globalFeeConfig = JSON.parse(localStorage.getItem('nms_global_fee_config') || '{"classFees":{},"transportFees":{}}')
    
    let totalCollected = 0
    let totalPending = 0
    let totalExpected = 0
    
    students.forEach(student => {
      const feeRecord = currentFees[student.id]
      
      if (feeRecord) {
        // Use explicit record if it exists
        totalCollected += Number(feeRecord.paid || 0)
        totalPending += Number(feeRecord.remaining || 0)
        totalExpected += (Number(feeRecord.total || 0) + Number(feeRecord.prevSessionDues || 0))
      } else {
        // Estimate based on global defaults if no record exists yet
        const classFee = Number(globalFeeConfig.classFees?.[student.class] || 40000)
        const transportFee = Number(globalFeeConfig.transportFees?.[student.transportRoute] || 0)
        const estimatedTotal = classFee + transportFee
        totalExpected += estimatedTotal
        totalPending += estimatedTotal
      }
    })
    
    setFeeStats({
      collected: totalCollected,
      pending: totalPending,
      total: totalExpected,
      overdue: totalPending // For now mapping pending to overdue as a proxy
    })
  }, [students, currentSession, refreshTick])

    const refreshData = useCallback(() => {
    // Force re-read of everything
    const savedStudents = localStorage.getItem(`nms_students_${currentSession}`) || localStorage.getItem('nms_students')
    if (savedStudents) setStudents(JSON.parse(savedStudents))

    const store = getSessionStore(currentSession)
    setAttendance(store.attendance || [])
    setMarks(store.results || {})
    setHomework(store.homework || [])
    setNotices(store.notices || [])
    
    const hSaved = localStorage.getItem('nms_holidays')
    if (hSaved) setHolidays(JSON.parse(hSaved))
    
    const sSaved = localStorage.getItem('nms_staff')
    if (sSaved) setStaff(JSON.parse(sSaved))

    setGeneralExpenses(JSON.parse(localStorage.getItem(`nms_expenses_${currentSession}`) || localStorage.getItem('nms_expenses') || '[]'))
    setFleetLogs(JSON.parse(localStorage.getItem(`nms_fleet_logs_${currentSession}`) || localStorage.getItem('nms_fleet_logs') || '[]'))
    
    const cSaved = localStorage.getItem(`nms_classes_${currentSession}`) || localStorage.getItem('nms_classes')
    if (cSaved) setGlobalClasses(JSON.parse(cSaved))

    setRefreshTick(t => t + 1)
  }, [currentSession])

  // 2. Storage Sync (Cross-Tab Support)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key || !e.key.startsWith('nms_')) return;
      
      if (e.key === `nms_students_${currentSession}`) setStudents(JSON.parse(e.newValue || '[]'))
      if (e.key === 'nms_staff') setStaff(JSON.parse(e.newValue || '[]'))
      if (e.key === dataKey(currentSession)) {
        const val = JSON.parse(e.newValue || '{}')
        setAttendance(val.attendance || [])
        setMarks(val.results || {})
        setHomework(val.homework || [])
        setNotices(val.notices || [])
      }
      if (e.key === `nms_classes_${currentSession}` || e.key === 'nms_classes') {
        setGlobalClasses(JSON.parse(e.newValue || '[]'))
      }
      if (e.key === `nms_transport_${currentSession}`) {
        setTransportRoutes(JSON.parse(e.newValue || '[]'))
      }
      
      // Always trigger a refresh tick on any nms_ storage change to recalculate dynamic stats
      setRefreshTick(t => t + 1)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [currentSession])

  // 3. Update Helpers
  const updateStudents = useCallback((newData) => {
    setStudents(newData)
    localStorage.setItem(`nms_students_${currentSession}`, JSON.stringify(newData))
  }, [currentSession])

  const updateStaff = useCallback((newData) => {
    setStaff(newData)
    localStorage.setItem('nms_staff', JSON.stringify(newData))
  }, [])

  const updateAttendance = useCallback((newData) => {
    setAttendance(newData)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, attendance: newData })
  }, [currentSession])

  const updateMarks = useCallback((newData) => {
    setMarks(newData)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, results: newData })
  }, [currentSession])

  const updateHomework = useCallback((newData) => {
    setHomework(newData)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, homework: newData })
  }, [currentSession])

  const updateNotices = useCallback((newData) => {
    setNotices(newData)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, notices: newData })
  }, [currentSession])

  const updateFeeStats = useCallback((newData) => {
    setFeeStats(newData)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, feeStats: newData })
  }, [currentSession])

  const updateHolidays = useCallback((newData) => {
    setHolidays(newData)
    localStorage.setItem('nms_holidays', JSON.stringify(newData))
  }, [])

  const updateExpenses = useCallback((newData) => {
    setGeneralExpenses(newData)
    localStorage.setItem(`nms_expenses_${currentSession}`, JSON.stringify(newData))
  }, [currentSession])

  const updateFleetLogs = useCallback((newData) => {
    setFleetLogs(newData)
    localStorage.setItem(`nms_fleet_logs_${currentSession}`, JSON.stringify(newData))
  }, [currentSession])

  const updateVehicles = useCallback((newData) => {
    setVehicles(newData)
    localStorage.setItem('nms_vehicles', JSON.stringify(newData))
  }, [])

  const updateGlobalClasses = useCallback((newData) => {
    setGlobalClasses(newData)
    localStorage.setItem(`nms_classes_${currentSession}`, JSON.stringify(newData))
    localStorage.setItem('nms_classes', JSON.stringify(newData))
  }, [currentSession])

  const updateTransportRoutes = useCallback((d) => {
    setTransportRoutes(d)
    localStorage.setItem(`nms_transport_${currentSession}`, JSON.stringify(d))
    localStorage.setItem('nms_transport', JSON.stringify(d))
  }, [currentSession])

  const value = {
    students, updateStudents,
    staff, updateStaff,
    globalClasses, updateGlobalClasses,
    attendance, updateAttendance,
    marks, updateMarks,
    homework, updateHomework,
    notices, updateNotices,
    feeStats, updateFeeStats,
    holidays, updateHolidays,
    generalExpenses, updateExpenses,
    fleetLogs, updateFleetLogs,
    vehicles, updateVehicles,
    transportRoutes, updateTransportRoutes,
    refreshData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}

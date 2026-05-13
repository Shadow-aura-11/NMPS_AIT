import { createContext, useContext, useState, useEffect, useCallback } from 'react'
<<<<<<< HEAD
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
=======
import { useAuth } from './AuthContext'
import { api } from '../utils/api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { currentSession, school } = useAuth()

  // 1. Centralized State
  const [students, setStudents] = useState([])
  const [staff, setStaff] = useState([])
  const [generalExpenses, setGeneralExpenses] = useState([])
  const [fleetLogs, setFleetLogs] = useState([])
  const [transportRoutes, setTransportRoutes] = useState([])
  const [loading, setLoading] = useState(true)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b

  // Session specific states
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState({})
  const [homework, setHomework] = useState([])
  const [notices, setNotices] = useState([])
  const [feeStats, setFeeStats] = useState({ collected: 0, pending: 0, overdue: 0, total: 2500000 })
  const [holidays, setHolidays] = useState(['2026-01-26', '2026-08-15', '2026-10-02'])
  
<<<<<<< HEAD
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
=======
  const [vehicles, setVehicles] = useState([])
  const [classes, setClasses] = useState([])
  const [refreshTick, setRefreshTick] = useState(0)

  // Tenant-aware storage keys
  const getPrefix = useCallback(() => school.key || 'default', [school.key])
  const getStoreKey = useCallback((type, session) => `erp_${getPrefix()}_${type}${session ? '_' + session : ''}`, [getPrefix])

  // Load data when session or school changes
  useEffect(() => {
    const loadData = async () => {
      if (!school?.key) return
      setLoading(true)
      
      try {
        // Fetch Students
        const serverStudents = await api.get('students', currentSession)
        setStudents(Array.isArray(serverStudents) ? serverStudents : [])

        // Fetch Staff
        const serverStaff = await api.get('staff')
        setStaff(Array.isArray(serverStaff) ? serverStaff : [])

        // Fetch Session specific data
        const serverSessionData = await api.get('session_data', currentSession)
        if (serverSessionData && !Array.isArray(serverSessionData)) {
          setAttendance(serverSessionData.attendance || [])
          setMarks(serverSessionData.results || {})
          setHomework(serverSessionData.homework || [])
          setNotices(serverSessionData.notices || [])
          setFeeStats(serverSessionData.feeStats || { collected: 0, pending: 0, overdue: 0, total: 2500000 })
        } else {
          // Fallback to local store logic
          const localData = JSON.parse(localStorage.getItem(getStoreKey('session_data', currentSession)) || '{}')
          setAttendance(localData.attendance || [])
          setMarks(localData.results || {})
          setHomework(localData.homework || [])
          setNotices(localData.notices || [])
          setFeeStats(localData.feeStats || { collected: 0, pending: 0, overdue: 0, total: 2500000 })
        }

        // Fetch Transport
        const serverRoutes = await api.get('transport', currentSession)
        let finalRoutes = []
        if (Array.isArray(serverRoutes) && serverRoutes.length > 0) {
          finalRoutes = serverRoutes
        } else {
          finalRoutes = JSON.parse(localStorage.getItem(getStoreKey('transport', currentSession)) || localStorage.getItem(getStoreKey('transport')) || '[]')
        }
        if (finalRoutes.length === 0) {
          finalRoutes = [{ route: 'Route 1', vehicle: 'Bus 01', driver: 'Driver A', phone: '9876543210' }]
          localStorage.setItem(getStoreKey('transport'), JSON.stringify(finalRoutes))
        }
        setTransportRoutes(finalRoutes)

        // Fetch Expenses & Fleet
        const serverExpenses = await api.get('expenses', currentSession)
        setGeneralExpenses(Array.isArray(serverExpenses) ? serverExpenses : [])
        
        const serverFleet = await api.get('fleet_logs', currentSession)
        setFleetLogs(Array.isArray(serverFleet) ? serverFleet : [])

        const serverVehicles = await api.get('vehicles')
        setVehicles(Array.isArray(serverVehicles) ? serverVehicles : [])

        // Fetch Classes
        const serverClasses = await api.get('classes', currentSession)
        let finalClasses = []
        if (Array.isArray(serverClasses) && serverClasses.length > 0) {
          finalClasses = serverClasses
        } else {
          finalClasses = JSON.parse(localStorage.getItem(getStoreKey('classes', currentSession)) || localStorage.getItem(getStoreKey('classes')) || '[]')
        }
        if (finalClasses.length === 0) {
          finalClasses = [
            { class: 'UKG', sections: [{ name: 'A', strength: 30 }], subjects: ['English', 'Hindi', 'Math'] },
            { class: '1st', sections: [{ name: 'A', strength: 30 }], subjects: ['English', 'Hindi', 'Math'] },
            { class: '2nd', sections: [{ name: 'A', strength: 30 }], subjects: ['English', 'Hindi', 'Math'] }
          ]
          localStorage.setItem(getStoreKey('classes'), JSON.stringify(finalClasses))
        }
        setClasses(finalClasses)
      } catch (error) {
        console.error("Data loading failed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentSession, school.key, getStoreKey])

  // 1.5. Dynamic Fee Statistics Calculation
  useEffect(() => {
    if (!school?.key) return
    const prefix = school.key;
    const feeKeyStr = `erp_${prefix}_fees_${currentSession}`
    const currentFees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    const globalFeeConfig = JSON.parse(localStorage.getItem(`erp_${prefix}_global_fee_config`) || '{"classFees":{},"transportFees":{}}')
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
    
    let totalCollected = 0
    let totalPending = 0
    let totalExpected = 0
    
    students.forEach(student => {
      const feeRecord = currentFees[student.id]
      
      if (feeRecord) {
<<<<<<< HEAD
        // Use explicit record if it exists
=======
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
        totalCollected += Number(feeRecord.paid || 0)
        totalPending += Number(feeRecord.remaining || 0)
        totalExpected += (Number(feeRecord.total || 0) + Number(feeRecord.prevSessionDues || 0))
      } else {
<<<<<<< HEAD
        // Estimate based on global defaults if no record exists yet
=======
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
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
<<<<<<< HEAD
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
=======
      overdue: totalPending
    })
  }, [students, currentSession, refreshTick, school.key])

  const refreshData = useCallback(async () => {
    if (!school?.key) return
    setLoading(true)
    const serverStudents = await api.get('students', currentSession)
    setStudents(Array.isArray(serverStudents) ? serverStudents : [])
    
    const serverStaff = await api.get('staff')
    setStaff(Array.isArray(serverStaff) ? serverStaff : [])
    
    setRefreshTick(t => t + 1)
    setLoading(false)
  }, [currentSession, school.key])

  // Cross-Tab Support
  useEffect(() => {
    if (!school?.key) return
    const handleStorageChange = (e) => {
      if (e.key === getStoreKey('students', currentSession)) setStudents(JSON.parse(e.newValue))
      if (e.key === getStoreKey('staff')) setStaff(JSON.parse(e.newValue))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [currentSession, school.key, getStoreKey])

  // Update Helpers
  const updateStudents = useCallback((newData) => {
    setStudents(newData)
    api.save('students', newData, currentSession)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }, [currentSession])

  const updateStaff = useCallback((newData) => {
    setStaff(newData)
<<<<<<< HEAD
    localStorage.setItem('nms_staff', JSON.stringify(newData))
=======
    api.save('staff', newData)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }, [])

  const updateAttendance = useCallback((newData) => {
    setAttendance(newData)
<<<<<<< HEAD
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
=======
    const currentData = { attendance: newData, results: marks, homework, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, marks, homework, notices, feeStats, getStoreKey])

  const updateMarks = useCallback((newData) => {
    setMarks(newData)
    const currentData = { attendance, results: newData, homework, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, homework, notices, feeStats, getStoreKey])

  const updateHomework = useCallback((newData) => {
    setHomework(newData)
    const currentData = { attendance, results: marks, homework: newData, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, notices, feeStats, getStoreKey])

  const updateNotices = useCallback((newData) => {
    setNotices(newData)
    const currentData = { attendance, results: marks, homework, notices: newData, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, homework, feeStats, getStoreKey])

  const updateFeeStats = useCallback((newData) => {
    setFeeStats(newData)
    const currentData = { attendance, results: marks, homework, notices, feeStats: newData }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, homework, notices, getStoreKey])

  const updateHolidays = useCallback((newData) => {
    setHolidays(newData)
    api.save('holidays', newData)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }, [])

  const updateExpenses = useCallback((newData) => {
    setGeneralExpenses(newData)
<<<<<<< HEAD
    localStorage.setItem(`nms_expenses_${currentSession}`, JSON.stringify(newData))
=======
    api.save('expenses', newData, currentSession)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }, [currentSession])

  const updateFleetLogs = useCallback((newData) => {
    setFleetLogs(newData)
<<<<<<< HEAD
    localStorage.setItem(`nms_fleet_logs_${currentSession}`, JSON.stringify(newData))
=======
    api.save('fleet_logs', newData, currentSession)
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }, [currentSession])

  const updateVehicles = useCallback((newData) => {
    setVehicles(newData)
<<<<<<< HEAD
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
=======
    api.save('vehicles', newData)
  }, [])

  const value = {
    students, updateStudents,
    staff, updateStaff,
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
    attendance, updateAttendance,
    marks, updateMarks,
    homework, updateHomework,
    notices, updateNotices,
    feeStats, updateFeeStats,
    holidays, updateHolidays,
    generalExpenses, updateExpenses,
    fleetLogs, updateFleetLogs,
    vehicles, updateVehicles,
<<<<<<< HEAD
    transportRoutes, updateTransportRoutes,
    refreshData
=======
    classes, updateClasses: (d) => { 
      setClasses(d); 
      api.save('classes', d, currentSession);
      localStorage.setItem(getStoreKey('classes', currentSession), JSON.stringify(d));
      localStorage.setItem(getStoreKey('classes'), JSON.stringify(d));
    },
    transportRoutes, updateTransportRoutes: (d) => { 
      setTransportRoutes(d);
      api.save('transport', d, currentSession); 
      localStorage.setItem(getStoreKey('transport', currentSession), JSON.stringify(d));
      localStorage.setItem(getStoreKey('transport'), JSON.stringify(d));
    },
    refreshData,
    loading
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
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

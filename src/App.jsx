import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Faculty from './pages/Faculty'
import StudentCorner from './pages/StudentCorner'
import MandatoryDisclosure from './pages/MandatoryDisclosure'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import ERPLogin from './pages/ERPDashboard'
import AdminCMS from './pages/AdminCMS'
import { ProtectedRoute, RoleDashboard } from './components/ERPRouter'
import StudentsPage from './pages/erp/StudentsPage'
import StaffPage from './pages/erp/StaffPage'
import FeesPage from './pages/erp/FeesPage'
import ExpensesPage from './pages/erp/ExpensesPage'
import AttendancePage from './pages/erp/AttendancePage'
import ExamsPage from './pages/erp/ExamsPage'
import TimetablePage from './pages/erp/TimetablePage'
import TransportPage from './pages/erp/TransportPage'
import LibraryPage from './pages/erp/LibraryPage'
import NoticesPage from './pages/erp/NoticesPage'
import MessagesPage from './pages/erp/MessagesPage'
import HomeworkPage from './pages/erp/HomeworkPage'
import SettingsPage from './pages/erp/SettingsPage'
import CertificateDesigner from './pages/erp/CertificateDesigner'
import IDCardDesigner from './pages/erp/IDCardDesigner'
import PromotionPage from './pages/erp/PromotionPage'
import MarkAttendancePage from './pages/erp/MarkAttendancePage'
import MyClassesPage from './pages/erp/MyClassesPage'
import StudentProfilePage from './pages/erp/StudentProfilePage'
import StaffAttendancePage from './pages/erp/StaffAttendancePage'
import {
  FiUsers, FiUser, FiDollarSign, FiClock, FiFileText,
  FiCalendar, FiTruck, FiBookOpen, FiBarChart2, FiSettings,
  FiBell, FiMessageCircle, FiBook, FiAward, FiClipboard, FiGrid, FiCheckSquare
} from 'react-icons/fi'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* Decides whether to show public header/footer or ERP layout */
function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isERP = location.pathname.startsWith('/erp')

  // ERP routes have their own layout (DashboardLayout via ProtectedRoute)
  // Public routes get Header + Footer
  return (
    <>
      <ScrollToTop />
      {isERP ? (
        <Routes>
          <Route path="/erp" element={<ERPLogin />} />
          <Route path="/erp/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          <Route path="/erp/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="/erp/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
          <Route path="/erp/fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
          <Route path="/erp/expenses" element={<ProtectedRoute role={['admin']}><ExpensesPage /></ProtectedRoute>} />
          <Route path="/erp/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
          <Route path="/erp/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="/erp/marks" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="/erp/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
          <Route path="/erp/transport" element={<ProtectedRoute><TransportPage /></ProtectedRoute>} />
          <Route path="/erp/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="/erp/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
          <Route path="/erp/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/erp/homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
          <Route path="/erp/results" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="/erp/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/erp/certificate-design" element={<ProtectedRoute role={['admin']}><CertificateDesigner /></ProtectedRoute>} />
          <Route path="/erp/id-card-design" element={<ProtectedRoute role={['admin']}><IDCardDesigner /></ProtectedRoute>} />
          <Route path="/erp/promotion" element={<ProtectedRoute role={['admin']}><PromotionPage /></ProtectedRoute>} />
          <Route path="/erp/mark-attendance" element={<ProtectedRoute role={['admin', 'teacher']}><MarkAttendancePage /></ProtectedRoute>} />
          <Route path="/erp/my-classes" element={<ProtectedRoute role={['teacher']}><MyClassesPage /></ProtectedRoute>} />
          <Route path="/erp/profile" element={<ProtectedRoute role={['student']}><StudentProfilePage /></ProtectedRoute>} />
          <Route path="/erp/children" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="/erp/reports" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="/erp/staff-attendance" element={<ProtectedRoute role={['admin', 'teacher']}><StaffAttendancePage /></ProtectedRoute>} />
        </Routes>
      ) : (
        <PublicLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/student-corner" element={<StudentCorner />} />
            <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/web-admin" element={<AdminCMS />} />
          </Routes>
        </PublicLayout>
      )}
    </>
  )
}

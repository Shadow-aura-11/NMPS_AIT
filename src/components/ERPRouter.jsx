import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import AdminDashboard from '../pages/erp/AdminDashboard'
import TeacherDashboard from '../pages/erp/TeacherDashboard'
import StudentDashboard from '../pages/erp/StudentDashboard'
import ExpensesPage from '../pages/erp/ExpensesPage'

/* Wrapper: redirects to login if not authenticated */
export function ProtectedRoute({ children }) {
<<<<<<< HEAD
  const { user } = useAuth()
  if (!user) return <Navigate to="/erp" replace />
=======
  const { user, school } = useAuth()
  if (!user) return <Navigate to={`/${school.key}/erp`} replace />
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  return <DashboardLayout>{children}</DashboardLayout>
}

/* Renders the correct dashboard based on user role */
export function RoleDashboard() {
<<<<<<< HEAD
  const { user } = useAuth()
=======
  const { user, school } = useAuth()
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  switch (user?.role) {
    case 'admin': return <AdminDashboard />
    case 'teacher': return <TeacherDashboard />
    case 'student': return <StudentDashboard />
<<<<<<< HEAD
    default: return <Navigate to="/erp" replace />
=======
    default: return <Navigate to={`/${school.key}/erp`} replace />
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  }
}

/* Generic placeholder for sub-pages that share layout */
export function ERPSubPage({ title, icon, children }) {
  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {icon} {title}
        </div>
        <div className="dash-page-subtitle">Coming soon — this module is under development</div>
      </div>
      {children || (
        <div style={{
          background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)',
          textAlign: 'center', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: 48, color: 'var(--gray-300)', marginBottom: 'var(--space-4)' }}>{icon}</div>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--gray-700)', marginBottom: 'var(--space-2)' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--gray-400)', maxWidth: 400, margin: '0 auto' }}>
            This module is part of the ERP system. Full functionality will be available upon backend integration.
          </p>
        </div>
      )}
    </div>
  )
}

import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi'
import { useCms } from '../context/CmsContext'
import './About.css'

export default function MandatoryDisclosure() {
  const { content } = useCms()
  const data = content.mandatoryDisclosure
  const session = content.session

  return (
    <>
      <Helmet>
        <title>Mandatory Public Disclosure - New Morning Star Public School (CBSE)</title>
        <meta name="description" content="CBSE Mandatory Public Disclosure for New Morning Star Public School - affiliation details, certificates, staff info, fee structure, and more." />
      </Helmet>

      <section className="page-banner" style={{ background: 'linear-gradient(135deg, #b45309, #78350f)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}>CBSE Compliance</span>
            <h1 className="page-banner-title">Mandatory Public Disclosure</h1>
            <p className="page-banner-desc">As per CBSE guidelines for transparency and accountability</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ background: 'var(--gold-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gold-200)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
            <FiAlertCircle style={{ color: 'var(--gold-600)', flexShrink: 0, marginTop: 2 }} />
            <span>This information is published as per CBSE Affiliation Bye-Laws and is updated annually. Last updated: April 2026.</span>
          </div>

          {/* General Information */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              A. General Information
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {(data?.general || []).map((item, i) => (
                    <tr key={i}><td style={{ fontWeight: 600, width: '40%' }}>{item.label}</td><td>{item.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trust/Society */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              B. Trust / Society Information
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {(data?.trust || []).map((item, i) => (
                    <tr key={i}><td style={{ fontWeight: 600, width: '40%' }}>{item.label}</td><td>{item.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificates */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              C. Certificates & Documents
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {(data?.certificates || []).map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, width: '40%' }}>{item.label}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-success"><FiCheckCircle size={12} style={{ marginRight: 4 }} />{item.value}</span>
                          {item.file && (
                            <a href={item.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary" style={{ padding: '2px 8px', fontSize: 10 }}>
                              <FiDownload size={12} /> View PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              D. Staff Details
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr><th>Category</th><th>No. of Staff</th><th>Qualifications</th></tr>
                </thead>
                <tbody>
                  {content.faculty && content.faculty.length > 0 ? (
                    <tr>
                      <td style={{ fontWeight: 600 }}>Total Teaching Staff</td>
                      <td>{content.faculty.length}</td>
                      <td>PGT/TGT/PRT Qualified</td>
                    </tr>
                  ) : (
                    <tr><td colSpan="3">Data not available</td></tr>
                  )}
                  {/* Since faculty is dynamic now, we can show a summary or keep the static detailed rows if needed */}
                  <tr style={{ background: 'var(--gray-50)', fontWeight: 700 }}>
                    <td>Status of Principal</td>
                    <td>1</td>
                    <td>Ph.D., M.Ed.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Infrastructure */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              E. Infrastructure Details
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {(data?.infrastructure || []).map((item, i) => (
                    <tr key={i}><td style={{ fontWeight: 600, width: '40%' }}>{item.label}</td><td>{item.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Structure */}
          <div style={{ marginBottom: 'var(--space-10)' }} id="fees">
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              F. Fee Structure (Session {session})
            </h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    {content.admissions.fees.headers.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {content.admissions.fees.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, ci) => <td key={ci} style={ci === 0 ? { fontWeight: 600 } : {}}>&#8377; {cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>
              G. Academic Results Toppers
            </h2>
            <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
               {content.results.slice(0, 4).map((r, i) => (
                 <div key={i} className="card" style={{ display: 'flex', padding: 'var(--space-4)', gap: 'var(--space-4)', alignItems: 'center' }}>
                   <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', overflow: 'hidden' }}>
                     {r.image ? <img src={r.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-500)', fontWeight: 800 }}>{r.name[0]}</div>}
                   </div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                     <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{r.year} | {r.class} | <span style={{ color: 'var(--accent-600)', fontWeight: 700 }}>{r.score}</span></div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


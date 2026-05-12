import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiArrowRight, FiAlertCircle, FiFileText, FiDollarSign, FiClipboard } from 'react-icons/fi'
import './Admissions.css'
import './About.css'
import { useCms } from '../context/CmsContext'

const steps = [
  { step: '01', title: 'Online Registration', desc: 'Fill the online application form with student and parent details.' },
  { step: '02', title: 'Document Submission', desc: 'Upload required documents including birth certificate, photos, and previous records.' },
  { step: '03', title: 'Interaction / Test', desc: 'Student interaction for primary and entrance test for higher classes.' },
  { step: '04', title: 'Selection & Payment', desc: 'Upon selection, complete fee payment and confirm admission.' },
]

export default function Admissions() {
  const { content } = useCms()
  const [formData, setFormData] = useState({
    studentName: '', dob: '', gender: '', classApplied: '',
    parentName: '', parentEmail: '', parentPhone: '',
    address: '', previousSchool: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const scriptUrl = content.admissions.googleSheetUrl
      if (!scriptUrl) {
        // Fallback for demo/missing config
        console.log('No Google Sheet URL configured. Data:', formData)
        setTimeout(() => {
          setSubmitted(true)
          setLoading(false)
        }, 1500)
        return
      }

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, timestamp: new Date().toLocaleString() })
      })
      
      setSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again or contact the school office.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Helmet>
        <title>Admissions {content.session || '2026-27'} - New Morning Star Public School</title>
        <meta name="description" content={`Apply for admission at New Morning Star Public School for session ${content.session || '2026-27'}.`} />
      </Helmet>

      <section className="page-banner admissions-banner">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}>Admissions Open</span>
            <h1 className="page-banner-title">Admissions {content.session || '2026-27'}</h1>
            <p className="page-banner-desc">Join the New Morning Star family</p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge"><FiClipboard size={14} /> Process</span>
            <h2 className="section-title">Admission Process</h2>
            <p className="section-subtitle">Simple 4-step process to secure your child's admission</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, idx) => (
              <motion.div key={idx} className="step-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}>
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {idx < steps.length - 1 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Criteria & Fees */}
      <section className="section bg-light">
        <div className="container">
          <div className="adm-criteria-grid">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-badge">Requirements</span>
              <h2 className="section-title">Admission Criteria</h2>
              <div className="criteria-list">
                <div className="criteria-group">
                  <h3>Age Criteria</h3>
                  {['Nursery: 3+ years', 'LKG: 4+ years', 'UKG: 5+ years', 'Class I: 6+ years (as on 31st March)'].map((item, i) => (
                    <div key={i} className="criteria-item"><FiCheckCircle /> <span>{item}</span></div>
                  ))}
                </div>
                <div className="criteria-group">
                  <h3>Required Documents</h3>
                  {['Birth Certificate', 'Aadhaar Card (Student & Parents)', 'Previous School TC', 'Report Card of Previous Class', '4 Passport-size Photographs', 'Address Proof'].map((item, i) => (
                    <div key={i} className="criteria-item"><FiCheckCircle /> <span>{item}</span></div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {[content.admissions.fees, content.admissions.transport].filter(t => t && t.headers && t.rows).map((table, tidx) => (
                <div key={tidx} style={{ marginBottom: tidx === 0 ? '3rem' : 0 }}>
                  <span className="section-badge"><FiDollarSign size={14} /> {table.title?.split(' ')[0] || 'Fees'}</span>
                  <h2 className="section-title">{table.title}</h2>
                  <div className="table-wrapper" style={{ marginTop: '1.5rem' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          {(table.headers || []).map((h, hi) => <th key={hi}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {(table.rows || []).map((row, ri) => (
                          <tr key={ri}>
                            {(row || []).map((cell, ci) => (
                              <td key={ci}>{ci === 0 ? <strong>{cell}</strong> : cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                <FiAlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Fee is subject to annual revision. Prices are indicative and may vary based on specific requirements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Online Form */}
      <section className="section" id="admission-form">
        <div className="container">
          <div className="section-header">
            <span className="section-badge"><FiFileText size={14} /> Apply Online</span>
            <h2 className="section-title">Online Admission Form</h2>
            <p className="section-subtitle">Fill in the details below to begin the admission process</p>
          </div>

          {submitted ? (
            <motion.div className="form-success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="success-icon"><FiCheckCircle /></div>
              <h3>Application Submitted!</h3>
              <p>Thank you for your interest. Our team will contact you within 2-3 business days.</p>
              <p><strong>Ref: NMS-2026-{Math.floor(Math.random() * 9000 + 1000)}</strong></p>
              <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Submit Another</button>
            </motion.div>
          ) : (
            <form className="admission-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="form-section-title">Student Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Student Full Name *</label>
                    <input className="form-input" name="studentName" required value={formData.studentName} onChange={handleChange} placeholder="Enter student's full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth *</label>
                    <input className="form-input" name="dob" type="date" required value={formData.dob} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-select" name="gender" required value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class Applied For *</label>
                    <select className="form-select" name="classApplied" required value={formData.classApplied} onChange={handleChange}>
                      <option value="">Select Class</option>
                      {['PG', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(c => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Parent/Guardian Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Parent/Guardian Name *</label>
                    <input className="form-input" name="parentName" required value={formData.parentName} onChange={handleChange} placeholder="Enter parent's name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" name="parentEmail" type="email" required value={formData.parentEmail} onChange={handleChange} placeholder="Enter email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" name="parentPhone" type="tel" required value={formData.parentPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous School</label>
                    <input className="form-input" name="previousSchool" value={formData.previousSchool} onChange={handleChange} placeholder="Previous school name" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Additional Details</h3>
                <div className="form-group">
                  <label className="form-label">Residential Address *</label>
                  <textarea className="form-textarea" name="address" required value={formData.address} onChange={handleChange} placeholder="Complete residential address" style={{ minHeight: '80px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Any Message / Special Requirements</label>
                  <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Additional information" style={{ minHeight: '80px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <input type="checkbox" id="consent" required style={{ width: 18, height: 18 }} />
                <label htmlFor="consent" style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  I agree to the terms and conditions and consent to the processing of personal data.
                </label>
              </div>

              {error && <div style={{ color: 'var(--error)', background: 'var(--error-50)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', border: '1px solid var(--error-100)' }}>{error}</div>}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Submitting Application...' : 'Submit Application'} {!loading && <FiArrowRight />}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

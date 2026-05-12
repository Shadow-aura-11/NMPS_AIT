import { useState } from 'react'
import { useCms } from '../context/CmsContext'
import { FiLayout, FiImage, FiInfo, FiMail, FiSave, FiLogOut, FiCheckCircle, FiLock, FiMonitor, FiCalendar, FiUsers, FiAward, FiSettings, FiShield, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminCMS() {
  const { content, updateContent } = useCms()
  const { sessions, addSession, deleteSession, currentSession, updateSession } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('nms_cms_auth') === 'true')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [saved, setSaved] = useState(false)
  const [newSessionInput, setNewSessionInput] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (pass === 'webadmin123') {
      setIsLoggedIn(true)
      localStorage.setItem('nms_cms_auth', 'true')
    } else {
      setError('Incorrect website admin password.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('nms_cms_auth')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const FileField = ({ label, value, onUpdate }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => onUpdate(reader.result)
        reader.readAsDataURL(file)
      }
    }

    return (
      <div style={{ marginBottom: 15, padding: 15, background: 'var(--gray-50)', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--gray-500)', textTransform: 'uppercase' }}>{label}</label>
          {value && <span style={{ fontSize: 10, color: 'var(--success-600)', fontWeight: 700 }}><FiCheckCircle /> Document Uploaded</span>}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} style={{ fontSize: 12, flex: 1 }} />
          {value && (
            <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '4px 12px' }}>View</a>
          )}
        </div>
      </div>
    )
  }

  const ImageField = ({ label, value, onUpdate }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => onUpdate(reader.result)
        reader.readAsDataURL(file)
      }
    }

    return (
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 8, textTransform: 'uppercase' }}>{label}</label>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 120, height: 80, borderRadius: 10, background: 'var(--gray-100)', overflow: 'hidden', border: '2px solid var(--gray-200)' }}>
            <img src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
          </div>
          <div style={{ flex: 1 }}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: 12 }} />
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 5 }}>Recommended: 1920x1080px for heroes, 800x600px for sections.</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
        <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}><FiLock /></div>
          <h2 style={{ marginBottom: 10 }}>Website Admin</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 30 }}>Enter password to manage website content</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Admin Password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="new-password" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--gray-200)', marginBottom: 15 }} />
            {error && <div style={{ color: 'var(--error)', fontSize: 12, marginBottom: 15 }}>{error}</div>}
            <button type="submit" className="btn btn-primary w-full">Login</button>
          </form>
          <Link to="/" style={{ display: 'block', marginTop: 20, fontSize: 13, color: 'var(--gray-400)' }}>Back to Website</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: 'white', borderRight: '1px solid var(--gray-100)', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary-600)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 20 }}>M</div>
          <div>
            <span style={{ fontWeight: 800, display: 'block', fontSize: 15 }}>CMS Panel</span>
            <span style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>NMS Public School</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {[
            { id: 'settings', label: 'General Settings', icon: <FiSettings /> },
            { id: 'home', label: 'Home Page', icon: <FiLayout /> },
            { id: 'about', label: 'About Us', icon: <FiInfo /> },
            { id: 'disclosure', label: 'Mandatory Disclosure', icon: <FiShield /> },
            { id: 'admissions', label: 'Admissions', icon: <FiCheckCircle /> },
            { id: 'faculty', label: 'Faculty Management', icon: <FiUsers /> },
            { id: 'results', label: 'Board Results', icon: <FiAward /> },
            { id: 'calendar', label: 'Academic Calendar', icon: <FiCalendar /> },
            { id: 'gallery', label: 'Media Gallery', icon: <FiImage /> },
            { id: 'contact', label: 'Contact Details', icon: <FiMail /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 12, background: activeTab === tab.id ? 'var(--primary-600)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--gray-500)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 600, transition: 'all 0.2s', textAlign: 'left', marginBottom: 6 }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 12, color: 'var(--error)', border: '1px solid var(--error-100)', background: 'var(--error-50)', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          <FiLogOut /> Logout Session
        </button>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
             <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-800)' }}>Editing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
             <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Update visuals and content for the public website</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            {saved && <span style={{ color: 'var(--success-600)', fontSize: 14, fontWeight: 700 }}><FiCheckCircle style={{ display: 'inline', marginRight: 6 }} />Published Successfully!</span>}
            <button onClick={handleSave} className="btn btn-primary btn-lg" style={{ padding: '12px 30px' }}><FiSave /> Save & Publish</button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.03)', border: '1px solid var(--gray-100)' }}>
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div>
                 <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Academic Session Configuration</h4>
                 <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 25 }}>Changing the session year here will update it across the entire public website (Admissions, Results, etc.)</p>
                 
                 <div className="form-group" style={{ maxWidth: 400 }}>
                   <label className="form-label">Current Academic Session</label>
                   <div style={{ display: 'flex', gap: 10 }}>
                     <input 
                       className="form-input" 
                       placeholder="e.g. 2026-27" 
                       value={content.session || '2026-27'} 
                       onChange={e => updateContent('session', e.target.value)} 
                     />
                   </div>
                   <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 10 }}>
                     Recommended format: YYYY-YY (e.g., 2026-27)
                   </p>
                 </div>
              </div>

              <div style={{ padding: 25, background: 'var(--accent-50)', borderRadius: 20, border: '1px solid var(--accent-100)' }}>
                 <div style={{ display: 'flex', gap: 15 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}><FiInfo /></div>
                    <div>
                       <div style={{ fontWeight: 800, color: 'var(--accent-700)', marginBottom: 4 }}>Note on Session Change</div>
                       <div style={{ fontSize: 13, color: 'var(--accent-600)', lineHeight: 1.5 }}>
                          Changing the session year is a major update. Make sure you have updated the Academic Calendar and Fee Structure for the new session before publishing.
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
          
          {activeTab === 'disclosure' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>A. General School Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                  {content.mandatoryDisclosure.general.map((item, i) => (
                    <div key={i} className="form-group">
                      <label className="form-label">{item.label}</label>
                      <input className="form-input" value={item.value} onChange={e => {
                        const data = { ...content.mandatoryDisclosure };
                        data.general[i].value = e.target.value;
                        updateContent('mandatoryDisclosure', data);
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>B. Trust / Society Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                  {content.mandatoryDisclosure.trust.map((item, i) => (
                    <div key={i} className="form-group">
                      <label className="form-label">{item.label}</label>
                      <input className="form-input" value={item.value} onChange={e => {
                        const data = { ...content.mandatoryDisclosure };
                        data.trust[i].value = e.target.value;
                        updateContent('mandatoryDisclosure', data);
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>C. Infrastructure Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                  {content.mandatoryDisclosure.infrastructure.map((item, i) => (
                    <div key={i} className="form-group">
                      <label className="form-label">{item.label}</label>
                      <input className="form-input" value={item.value} onChange={e => {
                        const data = { ...content.mandatoryDisclosure };
                        data.infrastructure[i].value = e.target.value;
                        updateContent('mandatoryDisclosure', data);
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>D. Official Certificates (PDF/Images)</h4>
                <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 25 }}>Upload the scanned copies of required documents as per CBSE affiliation requirements.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  {content.mandatoryDisclosure.certificates.map((item, i) => (
                    <div key={i}>
                      <div className="form-group" style={{ marginBottom: 10 }}>
                        <label className="form-label">{item.label} (Status/Ref)</label>
                        <input className="form-input" value={item.value} onChange={e => {
                          const data = { ...content.mandatoryDisclosure };
                          data.certificates[i].value = e.target.value;
                          updateContent('mandatoryDisclosure', data);
                        }} />
                      </div>
                      <FileField label="Upload Scanned Document" value={item.file} onUpdate={val => {
                        const data = { ...content.mandatoryDisclosure };
                        data.certificates[i].file = val;
                        updateContent('mandatoryDisclosure', data);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <ImageField label="Hero Banner Image" value={content.home.hero.image} onUpdate={val => updateContent('home.hero.image', val)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
                <div className="form-group">
                  <label className="form-label">Main Headline</label>
                  <input className="form-input" value={content.home.hero.title} onChange={e => updateContent('home.hero.title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Call to Action Text</label>
                  <input className="form-input" value={content.home.hero.cta} onChange={e => updateContent('home.hero.cta', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Hero Sub-headline</label>
                <textarea className="form-textarea" value={content.home.hero.subtitle} onChange={e => updateContent('home.hero.subtitle', e.target.value)} style={{ minHeight: 100 }} />
              </div>
              
              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 20 }}>School Statistics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
                  {(content.home?.stats || []).map((stat, i) => (
                    <div key={i} style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 15 }}>
                      <input style={{ width: '100%', marginBottom: 10, fontWeight: 800, fontSize: 18, border: 'none', background: 'transparent', textAlign: 'center' }} value={stat.value} onChange={e => {
                        const s = [...content.home.stats]; s[i].value = e.target.value; updateContent('home.stats', s)
                      }} />
                      <input style={{ width: '100%', fontSize: 11, fontWeight: 700, border: 'none', background: 'transparent', textAlign: 'center', color: 'var(--gray-400)', textTransform: 'uppercase' }} value={stat.label} onChange={e => {
                        const s = [...content.home.stats]; s[i].label = e.target.value; updateContent('home.stats', s)
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <ImageField label="About Section Image" value={content.about.image} onUpdate={val => updateContent('about.image', val)} />
              <div>
                <label className="form-label">About Page Title</label>
                <input className="form-input" value={content.about.title} onChange={e => updateContent('about.title', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Introduction Content</label>
                <textarea className="form-textarea" value={content.about.description} onChange={e => updateContent('about.description', e.target.value)} style={{ minHeight: 150 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
                <div>
                  <label className="form-label">Mission Statement</label>
                  <textarea className="form-textarea" value={content.about.mission} onChange={e => updateContent('about.mission', e.target.value)} style={{ minHeight: 100 }} />
                </div>
                <div>
                  <label className="form-label">Vision Statement</label>
                  <textarea className="form-textarea" value={content.about.vision} onChange={e => updateContent('about.vision', e.target.value)} style={{ minHeight: 100 }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Manage Teaching Staff</h4>
                  <button onClick={() => {
                    const fac = [...content.faculty];
                    fac.unshift({ name: 'New Faculty', role: 'Teacher', qual: 'B.Ed.', exp: '0 years', dept: 'General', image: '' });
                    updateContent('faculty', fac);
                  }} className="btn btn-secondary btn-sm"><FiUsers style={{marginRight: 6}} /> Add New Member</button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                 {(content.faculty || []).map((f, i) => (
                   <div key={i} style={{ padding: 25, background: 'var(--gray-50)', borderRadius: 24, border: '1px solid var(--gray-100)', position: 'relative' }}>
                     <button onClick={() => {
                        const fac = [...content.faculty]; fac.splice(i, 1); updateContent('faculty', fac);
                     }} style={{ position: 'absolute', top: 15, right: 15, width: 28, height: 28, borderRadius: '50%', background: 'var(--error-50)', color: 'var(--error)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiLogOut size={14} />
                     </button>
                     
                     <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 100, textAlign: 'center' }}>
                           <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', border: '2px solid var(--gray-200)', overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {f.image ? <img src={f.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUsers size={30} color="var(--gray-300)" />}
                           </div>
                           <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary-600)', cursor: 'pointer', textDecoration: 'underline' }}>
                              Upload Photo
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onloadend = () => {
                                    const fac = [...content.faculty]; fac[i].image = reader.result; updateContent('faculty', fac)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }} />
                           </label>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div><label className="form-label">Full Name</label><input className="form-input" style={{ fontSize: 13 }} value={f.name} onChange={e => { const fac = [...content.faculty]; fac[i].name = e.target.value; updateContent('faculty', fac) }} /></div>
                              <div><label className="form-label">Designation</label><input className="form-input" style={{ fontSize: 13 }} value={f.role} onChange={e => { const fac = [...content.faculty]; fac[i].role = e.target.value; updateContent('faculty', fac) }} /></div>
                           </div>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div><label className="form-label">Qualification</label><input className="form-input" style={{ fontSize: 13 }} value={f.qual} onChange={e => { const fac = [...content.faculty]; fac[i].qual = e.target.value; updateContent('faculty', fac) }} /></div>
                              <div><label className="form-label">Department</label><input className="form-input" style={{ fontSize: 13 }} value={f.dept} onChange={e => { const fac = [...content.faculty]; fac[i].dept = e.target.value; updateContent('faculty', fac) }} /></div>
                           </div>
                           <div><label className="form-label">Experience (e.g. 10 years)</label><input className="form-input" style={{ fontSize: 13 }} value={f.exp} onChange={e => { const fac = [...content.faculty]; fac[i].exp = e.target.value; updateContent('faculty', fac) }} /></div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
          {activeTab === 'admissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <ImageField label="Admission Banner Image" value={content.admissions.image} onUpdate={val => updateContent('admissions.image', val)} />
              
              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Google Sheets Integration</h4>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>Connect your admission form to a Google Sheet to collect responses automatically.</p>
                <div className="form-group">
                  <label className="form-label">Google Web App URL</label>
                  <input className="form-input" placeholder="https://script.google.com/macros/s/.../exec" value={content.admissions.googleSheetUrl} onChange={e => updateContent('admissions.googleSheetUrl', e.target.value)} />
                  <div style={{ marginTop: 10, padding: 15, background: 'var(--primary-50)', borderRadius: 12, fontSize: 12, color: 'var(--primary-700)', lineHeight: 1.5 }}>
                    <strong>How to setup:</strong><br />
                    1. Create a Google Sheet.<br />
                    2. Go to Extensions &gt; Apps Script.<br />
                    3. Paste the provided script and click "Deploy" as Web App.<br />
                    4. Set "Who has access" to "Anyone".<br />
                    5. Copy the Web App URL and paste it above.
                  </div>
                </div>
              </div>

              {[
                { key: 'fees', label: 'Academic Fee Structure' },
                { key: 'transport', label: 'Transport Fee Structure' }
              ].map(section => (
                <div key={section.key} style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Section Title</label>
                      <input className="form-input" style={{ fontWeight: 800, fontSize: 18 }} value={content.admissions[section.key].title} onChange={e => {
                        const data = { ...content.admissions[section.key] }; data.title = e.target.value; updateContent(`admissions.${section.key}`, data)
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 25, marginLeft: 20 }}>
                      <button onClick={() => {
                        const data = { ...content.admissions[section.key] };
                        data.headers.push('New Header');
                        data.rows = data.rows.map(row => [...row, '']);
                        updateContent(`admissions.${section.key}`, data);
                      }} className="btn btn-secondary btn-sm">+ Add Column</button>
                      <button onClick={() => {
                        const data = { ...content.admissions[section.key] };
                        data.rows.push(new Array(data.headers.length).fill(''));
                        updateContent(`admissions.${section.key}`, data);
                      }} className="btn btn-primary btn-sm">+ Add Row</button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto', background: 'var(--gray-50)', padding: 20, borderRadius: 20 }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '8px' }}>
                      <thead>
                        <tr>
                          {content.admissions[section.key].headers.map((h, hi) => (
                            <th key={hi} style={{ padding: '0 8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <input className="form-input" style={{ fontSize: 11, fontWeight: 900, background: 'var(--primary-50)', color: 'var(--primary-700)', textTransform: 'uppercase', textAlign: 'center' }} value={h} onChange={e => {
                                  const data = { ...content.admissions[section.key] }; data.headers[hi] = e.target.value; updateContent(`admissions.${section.key}`, data)
                                }} />
                                <button onClick={() => {
                                  const data = { ...content.admissions[section.key] };
                                  data.headers.splice(hi, 1);
                                  data.rows = data.rows.map(row => row.filter((_, idx) => idx !== hi));
                                  updateContent(`admissions.${section.key}`, data);
                                }} style={{ fontSize: 9, color: 'var(--error)', border: 'none', background: 'transparent', cursor: 'pointer' }}>Remove Column</button>
                              </div>
                            </th>
                          ))}
                          <th style={{ width: 40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.admissions[section.key].rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>
                                <input className="form-input" style={{ fontSize: 13, background: 'white' }} value={cell} onChange={e => {
                                  const data = { ...content.admissions[section.key] }; data.rows[ri][ci] = e.target.value; updateContent(`admissions.${section.key}`, data)
                                }} />
                              </td>
                            ))}
                            <td>
                              <button onClick={() => {
                                const data = { ...content.admissions[section.key] }; data.rows.splice(ri, 1); updateContent(`admissions.${section.key}`, data)
                              }} style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}><FiLogOut size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Manage Board Toppers</h4>
                  <button onClick={() => {
                    const res = [...content.results];
                    res.unshift({ year: '2026', class: 'Class X', name: 'Student Name', score: '0%', image: '' });
                    updateContent('results', res);
                  }} className="btn btn-secondary btn-sm"><FiAward style={{marginRight: 6}} /> Add New Topper</button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                 {(content.results || []).map((r, i) => (
                   <div key={i} style={{ padding: 25, background: 'var(--gray-50)', borderRadius: 24, border: '1px solid var(--gray-100)', position: 'relative' }}>
                     <button onClick={() => {
                        const res = [...content.results]; res.splice(i, 1); updateContent('results', res);
                     }} style={{ position: 'absolute', top: 15, right: 15, width: 28, height: 28, borderRadius: '50%', background: 'var(--error-50)', color: 'var(--error)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiLogOut size={14} />
                     </button>
                     
                     <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 100, textAlign: 'center' }}>
                           <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'white', border: '2px solid var(--gray-200)', overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {r.image ? <img src={r.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUsers size={30} color="var(--gray-300)" />}
                           </div>
                           <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary-600)', cursor: 'pointer', textDecoration: 'underline' }}>
                              Student Photo
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onloadend = () => {
                                    const res = [...content.results]; res[i].image = reader.result; updateContent('results', res)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }} />
                           </label>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div><label className="form-label">Batch Year</label><input className="form-input" style={{ fontSize: 13 }} value={r.year} onChange={e => { const res = [...content.results]; res[i].year = e.target.value; updateContent('results', res) }} /></div>
                              <div><label className="form-label">Class</label><input className="form-input" style={{ fontSize: 13 }} value={r.class} onChange={e => { const res = [...content.results]; res[i].class = e.target.value; updateContent('results', res) }} /></div>
                           </div>
                           <div><label className="form-label">Student Name</label><input className="form-input" style={{ fontSize: 13 }} value={r.name} onChange={e => { const res = [...content.results]; res[i].name = e.target.value; updateContent('results', res) }} /></div>
                           <div><label className="form-label">Percentage (e.g. 98.4%)</label><input className="form-input" style={{ fontSize: 13 }} value={r.score} onChange={e => { const res = [...content.results]; res[i].score = e.target.value; updateContent('results', res) }} /></div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
               <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>Manage Academic Events</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {content.calendar.map((item, i) => (
                      <div key={i} style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 20, border: '1px solid var(--gray-100)' }}>
                        <input className="form-input" style={{ marginBottom: 12, fontWeight: 800, fontSize: 14, color: 'var(--primary-600)' }} value={item.month} onChange={e => {
                          const cal = [...content.calendar]; cal[i].month = e.target.value; updateContent('calendar', cal)
                        }} />
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Events (Comma Separated)</label>
                        <textarea className="form-textarea" style={{ minHeight: 80, fontSize: 13 }} value={item.events} onChange={e => {
                          const cal = [...content.calendar]; cal[i].events = e.target.value; updateContent('calendar', cal)
                        }} placeholder="e.g. New Session, Annual Day..." />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'gallery' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Manage Gallery Collection</h4>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <FiImage style={{marginRight: 6}} /> Add New Image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const imgs = [...content.gallery.images];
                          imgs.unshift({ url: reader.result, caption: 'New Photo', category: 'General' });
                          updateContent('gallery.images', imgs);
                        }
                        reader.readAsDataURL(file)
                      }
                    }} />
                  </label>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                 {content.gallery.images.map((img, i) => (
                   <div key={i} style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 24, position: 'relative', border: '1px solid var(--gray-100)' }}>
                     <button onClick={() => {
                        const imgs = [...content.gallery.images]; imgs.splice(i, 1); updateContent('gallery.images', imgs);
                     }} style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: 'var(--error-50)', color: 'var(--error)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                        <FiLogOut size={12} />
                     </button>
                     <div style={{ height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 15, background: 'white', border: '1px solid var(--gray-200)' }}>
                       <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Image Caption</label>
                          <input className="form-input" style={{ fontSize: 13, height: 38, background: 'white' }} value={img.caption} onChange={e => {
                            const imgs = [...content.gallery.images]; imgs[i].caption = e.target.value; updateContent('gallery.images', imgs)
                          }} placeholder="What is this photo about?" />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Category</label>
                          <select className="form-input" style={{ fontSize: 13, height: 38, background: 'white' }} value={img.category || 'General'} onChange={e => {
                            const imgs = [...content.gallery.images]; imgs[i].category = e.target.value; updateContent('gallery.images', imgs)
                          }}>
                             {['General', 'Academic', 'Sports', 'Cultural', 'Events', 'Infrastructure', 'Faculty'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div style={{ marginTop: 5 }}>
                           <label className="btn btn-secondary btn-sm" style={{ width: '100%', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                              <FiImage size={14} /> Change Photo
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onloadend = () => {
                                    const imgs = [...content.gallery.images]; imgs[i].url = reader.result; updateContent('gallery.images', imgs)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }} />
                           </label>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div>
                <label className="form-label">School Physical Address</label>
                <input className="form-input" value={content.contact.address} onChange={e => updateContent('contact.address', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
                <div className="form-group"><label className="form-label">Phone Numbers</label><input className="form-input" value={content.contact.phone} onChange={e => updateContent('contact.phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Official Email</label><input className="form-input" value={content.contact.email} onChange={e => updateContent('contact.email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Facebook Link</label><input className="form-input" value={content.contact.facebook} onChange={e => updateContent('contact.facebook', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Instagram Link</label><input className="form-input" value={content.contact.instagram} onChange={e => updateContent('contact.instagram', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Twitter/X Link</label><input className="form-input" value={content.contact.twitter} onChange={e => updateContent('contact.twitter', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">YouTube Link</label><input className="form-input" value={content.contact.youtube} onChange={e => updateContent('contact.youtube', e.target.value)} /></div>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: 40, padding: 25, background: 'var(--primary-600)', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20, color: 'white' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}><FiMonitor /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Real-Time Synchronization Enabled</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Any visual or text changes you publish here will be instantly live for all website visitors.</div>
          </div>
          <Link to="/" target="_blank" style={{ background: 'white', padding: '12px 25px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: 'var(--primary-600)', textDecoration: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>View Live Site</Link>
        </div>
      </div>
      
      <style>{`
        .form-label { display: block; fontSize: 13px; fontWeight: 700; color: var(--gray-500); marginBottom: 8px; textTransform: uppercase; }
        .form-input { width: 100%; padding: 12px 16px; borderRadius: 12px; border: 1px solid var(--gray-200); fontSize: 14px; fontWeight: 600; transition: all 0.2s; }
        .form-input:focus { border-color: var(--primary-500); box-shadow: 0 0 0 4px var(--primary-50); outline: none; }
        .form-textarea { width: 100%; padding: 12px 16px; borderRadius: 12px; border: 1px solid var(--gray-200); fontSize: 14px; lineHeight: 1.6; fontFamily: inherit; resize: vertical; }
        .form-textarea:focus { border-color: var(--primary-500); box-shadow: 0 0 0 4px var(--primary-50); outline: none; }
      `}</style>
    </div>
  )
}

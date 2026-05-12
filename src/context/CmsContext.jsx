import { createContext, useContext, useState, useEffect } from 'react'

const CmsContext = createContext(null)

const INITIAL_CONTENT = {
  session: '2026-27',
  home: {
    hero: {
      title: 'Nurturing Minds, Building Future Leaders',
      subtitle: 'New Morning Star Public School provides a holistic environment where every child discovers their true potential and grows with values.',
      cta: 'Explore Admissions',
      image: 'https://images.unsplash.com/photo-1523050853064-909787c94541?auto=format&fit=crop&q=80'
    },
    stats: [
      { label: 'Academic Excellence', value: '100%', icon: 'Award' },
      { label: 'Experienced Faculty', value: '50+', icon: 'Users' },
      { label: 'Modern Labs', value: '10+', icon: 'Beaker' },
      { label: 'Sports & Arts', value: '25+', icon: 'Star' }
    ]
  },
  about: {
    title: 'About Our Institution',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80',
    description: 'Founded with a vision to provide quality education, New Morning Star Public School has been a beacon of learning for over two decades. We focus on academic excellence, character building, and physical development.',
    mission: 'To empower students with knowledge, skills, and values that enable them to succeed in a rapidly changing world.',
    vision: 'To be a globally recognized center of excellence in school education.'
  },
  admissions: {
    title: 'Join Our Community',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80',
    description: 'Admissions are open for the academic year 2026-27. We welcome students from all backgrounds to join our family.',
    process: 'Fill the inquiry form, attend an interaction session, and complete the documentation.',
    fees: {
      title: 'Standard Fee Structure',
      headers: ['Class', 'Admission Fee', 'Tuition Fee', 'Annual Charges'],
      rows: [
        ['Nursery - UKG', '25,000', '3,500/month', '8,000'],
        ['I - V', '30,000', '4,000/month', '10,000'],
        ['VI - VIII', '35,000', '4,500/month', '12,000'],
        ['IX - X', '40,000', '5,000/month', '14,000']
      ]
    },
    transport: {
      title: 'Transport Fee Structure',
      headers: ['Location / Zone', 'Monthly Transport Fee'],
      rows: [
        ['Subhash Nagar (Internal)', '1,200/month'],
        ['Rajouri Garden / Tagore Garden', '1,800/month'],
        ['Vikaspuri / Janakpuri', '2,500/month']
      ]
    },
    googleSheetUrl: ''
  },
  results: [],
  gallery: {
    title: 'Life at New Morning Star',
    images: []
  },
  calendar: [
    { month: 'April', events: 'New Academic Session Begins' },
    { month: 'May', events: 'Summer Vacation' },
    { month: 'July', events: 'School Reopens' },
  ],
  faculty: [],
  contact: {
    address: 'Near Main Road, Subhash Nagar, New Delhi - 110027',
    phone: '+91 11 2345 6789, +91 98765 43210',
    email: 'info@newmorningstar.edu.in',
    timings: 'Mon - Sat: 8:00 AM - 2:00 PM',
    facebook: 'https://facebook.com/newmorningstar',
    instagram: 'https://instagram.com/newmorningstar',
    twitter: 'https://twitter.com/newmorningstar',
    youtube: 'https://youtube.com/@newmorningstar'
  },
  mandatoryDisclosure: {
    general: [
      { label: 'Name of the School', value: 'New Morning Star Public School' },
      { label: 'Affiliation No.', value: '2730XXX' },
      { label: 'School Code', value: 'XXXXX' },
      { label: 'Address', value: 'Near Main Road, Subhash Nagar, New Delhi - 110027' },
      { label: 'State', value: 'Delhi' },
      { label: 'District', value: 'West Delhi' },
      { label: 'Pin Code', value: '110027' },
      { label: 'Phone', value: '+91 11 2345 6789' },
      { label: 'Email', value: 'info@newmorningstar.edu.in' },
      { label: 'Website', value: 'www.newmorningstar.edu.in' },
      { label: 'Year of Establishment', value: '1995' },
      { label: 'Status of Affiliation', value: 'Permanent / Regular' },
      { label: 'Affiliation Period', value: '2023 to 2028' },
    ],
    trust: [
      { label: 'Name of Trust/Society', value: 'Morning Star Educational Trust' },
      { label: 'Registration No.', value: 'DL/XXX/1995' },
      { label: 'Date of Registration', value: '15-01-1995' },
      { label: 'Members of Trust', value: 'Mr. R.K. Sharma (Chairman), Mrs. S. Sharma (Secretary), Mr. A. Kumar (Treasurer)' },
    ],
    certificates: [
      { label: 'NOC from State Government', value: 'Obtained - DL/EDU/NOC/1995/XXX', file: '' },
      { label: 'Recognition Certificate', value: 'Valid - RE/DEL/1995/XXX', file: '' },
      { label: 'Building Safety Certificate', value: 'Valid till 2028', file: '' },
      { label: 'Fire Safety Certificate', value: 'Valid till 2027', file: '' },
      { label: 'DEO Certificate', value: 'Obtained', file: '' },
      { label: 'Water & Sanitation Certificate', value: 'Valid - Health Dept. Certified', file: '' },
      { label: 'Health & Hygiene Certificate', value: 'Valid till 2027', file: '' },
    ],
    infrastructure: [
      { label: 'Total Campus Area', value: '2 Acres' },
      { label: 'Built-up Area', value: '25,000 sq. ft.' },
      { label: 'Number of Classrooms', value: '45' },
      { label: 'Smart Classrooms', value: '30' },
      { label: 'Science Labs', value: '4 (Physics, Chemistry, Biology, Computer)' },
      { label: 'Library', value: '1 (12,000+ books)' },
      { label: 'Playground', value: '1 Acre' },
      { label: 'Auditorium', value: '1 (400 seats)' },
    ]
  }
}

export function CmsProvider({ children }) {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('nms_cms_content')
    if (!saved) return INITIAL_CONTENT
    
    try {
      const parsed = JSON.parse(saved)
      // Migration: Ensure new sections exist
      const migrated = {
        ...INITIAL_CONTENT,
        ...parsed,
        home: { ...INITIAL_CONTENT.home, ...(parsed.home || {}) },
        about: { ...INITIAL_CONTENT.about, ...(parsed.about || {}) },
        contact: { ...INITIAL_CONTENT.contact, ...(parsed.contact || {}) },
        admissions: { ...INITIAL_CONTENT.admissions, ...(parsed.admissions || {}) },
        gallery: { ...INITIAL_CONTENT.gallery, ...(parsed.gallery || {}) },
        mandatoryDisclosure: { ...INITIAL_CONTENT.mandatoryDisclosure, ...(parsed.mandatoryDisclosure || {}) },
        calendar: parsed.calendar || INITIAL_CONTENT.calendar,
        faculty: parsed.faculty || INITIAL_CONTENT.faculty,
        results: parsed.results || INITIAL_CONTENT.results
      }
      
      // Ensure fees/transport are objects not arrays
      if (migrated.admissions && Array.isArray(migrated.admissions.fees)) {
        migrated.admissions.fees = INITIAL_CONTENT.admissions.fees;
      }
      if (migrated.admissions && Array.isArray(migrated.admissions.transport)) {
        migrated.admissions.transport = INITIAL_CONTENT.admissions.transport;
      }
      
      return migrated;
    } catch (e) {
      return INITIAL_CONTENT
    }
  })

  useEffect(() => {
    localStorage.setItem('nms_cms_content', JSON.stringify(content))
  }, [content])

  const updateContent = (path, value) => {
    const newContent = { ...content }
    const keys = path.split('.')
    let current = newContent
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setContent(newContent)
  }

  return (
    <CmsContext.Provider value={{ content, updateContent }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}

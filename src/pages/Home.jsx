import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  FiArrowRight, FiBookOpen, FiUsers, FiAward, FiTarget,
  FiCalendar, FiCheckCircle, FiStar, FiClock, FiMapPin,
  FiPhone, FiPlay, FiChevronRight
} from 'react-icons/fi'
import {
  FaGraduationCap, FaFlask, FaFutbol, FaPalette,
  FaLaptopCode, FaBookReader, FaBus, FaShieldAlt
} from 'react-icons/fa'
import './Home.css'

// heroSlides is defined inside the component (below) to access CMS content

const stats = [
  { value: '25+', label: 'Years of Excellence', icon: <FiAward /> },
  { value: '2500+', label: 'Happy Students', icon: <FiUsers /> },
  { value: '100%', label: 'Board Results', icon: <FiCheckCircle /> },
  { value: '120+', label: 'Qualified Faculty', icon: <FiBookOpen /> },
]

const features = [
  { icon: <FaGraduationCap />, title: 'CBSE Curriculum', desc: 'Comprehensive CBSE curriculum from Nursery to Class XII with focus on conceptual learning.' },
  { icon: <FaFlask />, title: 'Science Labs', desc: 'Well-equipped Physics, Chemistry, Biology, and Computer labs for hands-on experiments.' },
  { icon: <FaLaptopCode />, title: 'Smart Classrooms', desc: 'ICT-enabled classrooms with interactive boards and digital learning resources.' },
  { icon: <FaFutbol />, title: 'Sports Excellence', desc: 'Multi-sport facilities including cricket, football, basketball, and indoor games.' },
  { icon: <FaPalette />, title: 'Arts & Culture', desc: 'Music, dance, drama, and visual arts programs for creative expression.' },
  { icon: <FaBus />, title: 'Safe Transport', desc: 'GPS-tracked buses covering all major routes with trained staff on board.' },
  { icon: <FaBookReader />, title: 'Rich Library', desc: 'Extensive collection of books, journals, and digital resources for knowledge seekers.' },
  { icon: <FaShieldAlt />, title: 'CCTV & Safety', desc: 'Round-the-clock CCTV surveillance with secure campus environment.' },
]

const getNotices = (session) => [
  { date: 'Apr 20, 2026', title: `Admissions Open for ${session || '2026-27'} Academic Session`, type: 'admission' },
  { date: 'Apr 18, 2026', title: 'Annual Sports Day - Schedule Released', type: 'event' },
  { date: 'Apr 15, 2026', title: 'Parent-Teacher Meeting - Class IX & X', type: 'meeting' },
  { date: 'Apr 12, 2026', title: 'Summer Vacation Homework Guidelines', type: 'academic' },
  { date: 'Apr 10, 2026', title: 'Science Exhibition - Registration Open', type: 'event' },
  { date: 'Apr 08, 2026', title: 'Fee Payment Reminder - Last Date April 30', type: 'notice' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Parent of Class X Student',
    text: 'New Morning Star has been a second home for my daughter. The teachers are incredibly dedicated and the school provides a perfect balance of academics and extracurricular activities.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Parent of Class V Student',
    text: 'The school ERP system keeps us updated about our child progress in real-time. The infrastructure and teaching methodology are world-class.',
    rating: 5,
  },
  {
    name: 'Anita Verma',
    role: 'Alumni, Batch 2024',
    text: 'My years at New Morning Star shaped my personality and career. The school instilled values of discipline, hard work, and compassion that I carry with me every day.',
    rating: 5,
  },
]

const events = [
  { date: '25', month: 'Apr', title: 'Annual Sports Day', desc: 'Inter-house athletic competition', time: '8:00 AM' },
  { date: '28', month: 'Apr', title: 'Science Exhibition', desc: 'Student science projects showcase', time: '10:00 AM' },
  { date: '05', month: 'May', title: 'Parent-Teacher Meeting', desc: 'Classes VI to VIII', time: '9:00 AM' },
  { date: '12', month: 'May', title: 'Summer Camp Begins', desc: 'Art, sports and coding workshops', time: '8:30 AM' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { content } = useCms()

  const heroSlides = [
    {
      title: 'Nurturing Minds,\nShaping Futures',
      subtitle: 'CBSE Affiliated School of Excellence',
      desc: 'Where every child discovers their potential through holistic education, innovative learning, and nurturing mentorship.',
      cta: `Apply for ${content?.session || '2026-27'}`,
      ctaLink: '/admissions',
      image: 'linear-gradient(135deg, #1a56db 0%, #0f172a 100%)',
    },
    {
      title: 'World-Class\nInfrastructure',
      subtitle: 'State of the Art Facilities',
      desc: 'Smart classrooms, science labs, sports facilities, and digital learning platforms for 21st century education.',
      cta: 'Explore Campus',
      ctaLink: '/about#infrastructure',
      image: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
    },
    {
      title: 'Excellence in\nAcademics & Beyond',
      subtitle: '100% Board Results',
      desc: 'Consistently outstanding results in CBSE examinations with students excelling in sports, arts, and co-curricular activities.',
      cta: 'View Results',
      ctaLink: '/student-corner#results',
      image: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  // Use CMS content for the first slide
  const displayTitle = currentSlide === 0 ? content.home.hero.title : slide.title
  const displaySubtitle = currentSlide === 0 ? content.home.hero.subtitle : slide.desc
  const displayBadge = currentSlide === 0 ? "Academic Excellence" : slide.subtitle

  return (
    <>
      <Helmet>
        <title>New Morning Star Public School - CBSE Affiliated School of Excellence</title>
        <meta name="description" content={`New Morning Star Public School - A CBSE affiliated school dedicated to nurturing young minds with quality education, strong values, and holistic development. Admissions open for ${content?.session || '2026-27'}.`} />
      </Helmet>

      {/* ====== HERO SECTION ====== */}
      <section className="hero" id="hero" style={{ background: slide.image }}>
        <div className="hero-overlay" />
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="container">
          <div className="hero-content">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
              className="hero-text"
            >
              <span className="hero-badge">
                <FiStar size={14} /> {displayBadge}
              </span>
              <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{displayTitle}</h1>
              <p className="hero-desc">{displaySubtitle}</p>
              <div className="hero-actions">
                <Link to={slide.ctaLink} className="btn btn-primary btn-lg hero-cta">
                  {slide.cta} <FiArrowRight />
                </Link>
                <Link to="/about" className="btn btn-secondary btn-lg hero-cta-secondary">
                  Learn More
                </Link>
              </div>
            </motion.div>

            <div className="hero-visual">
              <div className="hero-card hero-card-1">
                <div className="hero-card-icon"><FiCheckCircle /></div>
                <div>
                  <strong>100% Results</strong>
                  <span>CBSE Board 2025</span>
                </div>
              </div>
              <div className="hero-card hero-card-2">
                <div className="hero-card-icon accent"><FiAward /></div>
                <div>
                  <strong>Top Rankers</strong>
                  <span>National Level</span>
                </div>
              </div>
              <div className="hero-card hero-card-3">
                <div className="hero-card-icon gold"><FiUsers /></div>
                <div>
                  <strong>2500+ Students</strong>
                  <span>Happy Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Wave Divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="stats-bar" id="stats">
        <div className="container">
          <div className="stats-grid">
            {(content.home.stats || stats).map((stat, idx) => (
              <motion.div
                key={idx}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="stat-icon">{stat.icon || stats[idx % stats.length].icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ABOUT PREVIEW ====== */}
      <section className="section about-preview" id="about-preview">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-image-col"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="about-image-stack">
                <div className="about-img about-img-main" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' }}>
                  <div className="about-img-placeholder">
                    <FaGraduationCap size={60} />
                    <span>School Campus</span>
                  </div>
                </div>
                <div className="about-img about-img-float" style={{ background: 'linear-gradient(135deg, var(--accent-100), var(--accent-200))' }}>
                  <div className="about-img-placeholder">
                    <FaFlask size={30} />
                    <span>Science Lab</span>
                  </div>
                </div>
                <div className="about-experience-badge">
                  <span className="exp-number">25+</span>
                  <span className="exp-text">Years of<br />Excellence</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="about-text-col"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">About Our School</span>
              <h2 className="section-title">A Legacy of Learning & Growth</h2>
              <p className="about-text">
                Founded over two decades ago, New Morning Star Public School has been a beacon of quality education in the community. 
                Our CBSE-affiliated institution provides a nurturing environment where academic excellence meets character development.
              </p>
              <p className="about-text">
                With state-of-the-art infrastructure, dedicated faculty, and a student-centric approach, we prepare young minds 
                for the challenges of tomorrow while instilling timeless values of integrity, compassion, and resilience.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <FiCheckCircle className="highlight-icon" />
                  <span>CBSE Affiliated Curriculum</span>
                </div>
                <div className="highlight-item">
                  <FiCheckCircle className="highlight-icon" />
                  <span>Experienced & Qualified Faculty</span>
                </div>
                <div className="highlight-item">
                  <FiCheckCircle className="highlight-icon" />
                  <span>Smart Classrooms & Digital Learning</span>
                </div>
                <div className="highlight-item">
                  <FiCheckCircle className="highlight-icon" />
                  <span>Focus on Holistic Development</span>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary">
                Know More About Us <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES / WHY CHOOSE US ====== */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">What Makes Us Different</h2>
            <p className="section-subtitle">
              We provide a comprehensive educational experience that prepares students for success in academics and life.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                className="feature-card card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="card-body">
                  <div className={`feature-icon color-${idx % 4}`}>
                    {feat.icon}
                  </div>
                  <h3 className="feature-title">{feat.title}</h3>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NOTICE BOARD + EVENTS ====== */}
      <section className="section notice-events-section" id="notices">
        <div className="container">
          <div className="ne-grid">
            {/* Notice Board */}
            <motion.div
              className="notice-board"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="ne-header">
                <h2 className="ne-title">
                  <FiCalendar /> Notice Board
                </h2>
                <Link to="/student-corner" className="ne-view-all">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="notice-list">
                {getNotices(content.session).map((notice, idx) => (
                  <div key={idx} className="notice-item">
                    <div className={`notice-type ${notice.type}`} />
                    <div className="notice-content">
                      <span className="notice-date">{notice.date}</span>
                      <p className="notice-title-text">{notice.title}</p>
                    </div>
                    <FiChevronRight className="notice-arrow" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Events */}
            <motion.div
              className="events-board"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="ne-header">
                <h2 className="ne-title">
                  <FiCalendar /> Upcoming Events
                </h2>
                <Link to="/gallery" className="ne-view-all">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="events-list">
                {events.map((event, idx) => (
                  <div key={idx} className="event-item">
                    <div className="event-date-box">
                      <span className="event-day">{event.date}</span>
                      <span className="event-month">{event.month}</span>
                    </div>
                    <div className="event-content">
                      <h4 className="event-title">{event.title}</h4>
                      <p className="event-desc">{event.desc}</p>
                      <span className="event-time"><FiClock size={12} /> {event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">What Parents Say</h2>
            <p className="section-subtitle">
              Hear from our school community about their experiences with New Morning Star.
            </p>
          </div>
          <div className="testimonials-carousel">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                className={`testimonial-card ${idx === activeTestimonial ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: idx === activeTestimonial ? 1 : 0.3,
                  scale: idx === activeTestimonial ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} fill="var(--gold-400)" color="var(--gold-400)" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`t-dot ${idx === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(idx)}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ====== ERP CTA ====== */}
      <section className="section erp-cta-section" id="erp-cta">
        <div className="container">
          <div className="erp-cta-card">
            <div className="erp-cta-content">
              <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}>
                Digital Campus
              </span>
              <h2 className="erp-cta-title">Complete School ERP System</h2>
              <p className="erp-cta-desc">
                Manage attendance, fees, exams, timetables, and more through our integrated digital platform. 
                Parents can track their child's progress in real-time through our mobile app.
              </p>
              <div className="erp-features-mini">
                <div className="erp-mini-item"><FiCheckCircle /> Student Information System</div>
                <div className="erp-mini-item"><FiCheckCircle /> Online Fee Payment</div>
                <div className="erp-mini-item"><FiCheckCircle /> Attendance Tracking</div>
                <div className="erp-mini-item"><FiCheckCircle /> Exam & Report Cards</div>
                <div className="erp-mini-item"><FiCheckCircle /> Parent-Teacher Messaging</div>
                <div className="erp-mini-item"><FiCheckCircle /> Mobile App Access</div>
              </div>
              <div className="erp-cta-btns">
                <Link to="/erp" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--primary-700)' }}>
                  Access ERP Portal <FiArrowRight />
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

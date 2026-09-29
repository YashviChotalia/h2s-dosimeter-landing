import { useEffect, useRef, useState, useCallback } from 'react'
import './index.css'

/* ── Scroll reveal hook (stationary entrance animation) ──── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .img-reveal-wrap')
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── Logo SVG ───────────────────────────────────────────── */
function LogoIcon({ size = 32, inverted = false }: { size?: number; inverted?: boolean }) {
  const fg = inverted ? '#4F7625' : '#FFFFFF'
  const bg = inverted ? '#FFFFFF' : '#4F7625'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" fill={bg} rx="2"/>
      <text x="4" y="20" fontSize="14" fontWeight="900" fill={fg} fontFamily="Roboto Mono, monospace">H₂S</text>
      <rect x="4" y="23" width="24" height="2" fill={fg} opacity="0.6"/>
    </svg>
  )
}

/* ── Icons ──────────────────────────────────────────────── */
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 1v8M3 7l3.5 3.5L10 7"/><path d="M1 12h11"/>
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10"/>
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════════ */
function Header({ onDownload }: { onDownload: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const lastY = useRef(0)
  const [hidden, setHidden] = useState(false)

  const navItems = ['The Problem', 'Comparison', 'Technology', 'Wristband', 'Digital System', 'Validation', 'Safety & Sectors']
  const navIds   = ['problem', 'differentiator', 'technology', 'wristband', 'app', 'validation', 'safety-sectors']

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      setHidden(y > lastY.current && y > 140)
      lastY.current = y

      const sections = ['top', ...navIds]
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(sections[i] === 'top' ? 'home' : sections[i])
            break
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <header className="utility-bar">
        <div className="utility-bar__left">
          <div className="utility-bar__logo-block">
            <img
              src="/images/ongc_mrpl_aura_logo.png"
              alt="ONGC MRPL × Aura partnership logo"
              className="utility-bar__partner-logo"
            />
            <div className="utility-bar__title">
              <span className="utility-bar__title-main">H₂S DOSIMETER</span>
              <span className="utility-bar__title-sub">MRPL–AuraOne · Occupational Exposure Monitoring</span>
            </div>
          </div>
        </div>
        <div className="utility-bar__right">
          <span className="utility-bar__tag">Research Prototype</span>
          <a 
            className="utility-bar__apk-btn" 
            href="/downloads/h2s-dosimeter.apk" 
            download="h2s-dosimeter.apk" 
            onClick={onDownload}
            id="utility-download-apk"
          >
            <DownloadIcon/>
            DOWNLOAD APP
          </a>
          <button 
            className={`navbar__burger${menuOpen ? ' open' : ''}`} 
            onClick={() => setMenuOpen(v => !v)} 
            aria-label="Toggle Navigation Menu"
            id="mobile-nav-toggle"
          >
            <span className="navbar__burger-line"/>
            <span className="navbar__burger-line"/>
            <span className="navbar__burger-line"/>
          </button>
        </div>
      </header>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`} aria-label="Main Navigation">
        <div className="navbar__inner">
          <a 
            className={`navbar__home${activeSection === 'home' ? ' active' : ''}`} 
            onClick={(e) => { e.preventDefault(); scrollTo('top') }} 
            href="#top"
          >
            Home
          </a>
          <div className="navbar__nav">
            {navItems.map((item, i) => (
              <a 
                key={item} 
                className={`navbar__item${activeSection === navIds[i] ? ' active' : ''}`} 
                onClick={(e) => { e.preventDefault(); scrollTo(navIds[i]) }} 
                href={`#${navIds[i]}`}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="navbar__cta">
            <a 
              className="navbar__cta-btn" 
              href="/downloads/h2s-dosimeter.apk" 
              download="h2s-dosimeter.apk" 
              onClick={onDownload}
              id="navbar-download-apk"
            >
              <DownloadIcon/> DOWNLOAD APP
            </a>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <a 
          className="mobile-menu__item" 
          onClick={(e) => { e.preventDefault(); scrollTo('top') }} 
          href="#top"
        >
          Home
        </a>
        {navItems.map((item, i) => (
          <a 
            key={item} 
            className="mobile-menu__item" 
            onClick={(e) => { e.preventDefault(); scrollTo(navIds[i]) }} 
            href={`#${navIds[i]}`}
          >
            {item}
          </a>
        ))}
        <a 
          className="mobile-menu__cta" 
          href="/downloads/h2s-dosimeter.apk" 
          download="h2s-dosimeter.apk" 
          onClick={onDownload}
          id="mobile-menu-download-apk"
        >
          ↓ DOWNLOAD APP (Android APK)
        </a>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   HERO SWIPE SLIDER (OFFICIAL MRPL-STYLE CAROUSEL)
   Smooth right-swipe gesture, auto-advance, prev/next buttons
══════════════════════════════════════════════════════════ */
function HeroSlider({ onDownload }: { onDownload: () => void }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const mouseStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const slides = [
    // ═══ MRPL (2 slides) ═══
    {
      img: '/images/refinery_bg.jpg',
      alt: 'MRPL Mangalore Refinery and Petrochemicals Limited — refinery at dusk',
      category: 'MRPL',
      eyebrow: 'Mangalore Refinery & Petrochemicals Ltd. · ONGC',
      headline: <>Make Invisible<br/>Exposure Visible.</>,
      subhead: 'A passive wearable dosimeter designed for MRPL refinery operations — recording cumulative H₂S exposure through colorimetric sensing.',
      tags: ['MRPL', 'ONGC', 'REFINERY SAFETY', 'H₂S MONITORING'],
      portrait: false,
    },
    {
      img: '/images/mrpl_aura_app_splash.png',
      alt: 'MRPL AuraOne occupational exposure monitoring — Safe People, Sustainable Operations',
      category: 'MRPL',
      eyebrow: 'MRPL × AuraOne · Safe People, Sustainable Operations',
      headline: <>Occupational Safety<br/>Redefined.</>,
      subhead: 'AuraOne Occupational Exposure Monitoring deployed at MRPL. Real-time passive H₂S dosimetry for every shift worker.',
      tags: ['AURAONE', 'MRPL DEPLOYMENT', 'PASSIVE DOSIMETRY', 'GOI MINISTRY'],
      portrait: true,
    },
    // ═══ INDUSTRY WORKERS (2 slides) ═══
    {
      img: '/images/wristband_wrist.jpg',
      alt: 'Refinery industry worker wearing DoseBand during shift operations',
      category: 'INDUSTRY WORKERS',
      eyebrow: 'Workforce Occupational Hygiene',
      headline: <>Engineered for<br/>Shift Operations.</>,
      subhead: 'Continuous personal exposure recording designed to integrate naturally with standard industrial PPE and flame-retardant workwear.',
      tags: ['WORKER CENTRIC', 'PPE COMPLIANT', 'ZERO MAINTENANCE', 'FREE-SIZE FIT'],
      portrait: false,
    },
    {
      img: '/images/lab_researcher_titration.png',
      alt: 'MRPL laboratory researcher performing titration analysis with DoseBand and AuraOne app',
      category: 'INDUSTRY WORKERS',
      eyebrow: 'MRPL Industrial Research Workforce',
      headline: <>Every Worker.<br/>Every Shift.</>,
      subhead: 'From refinery operators to laboratory researchers — DoseBand adapts to every industrial role requiring personal H₂S exposure monitoring.',
      tags: ['MRPL TEAM', 'LAB WORKERS', 'FIELD OPERATORS', 'FULL COVERAGE'],
      portrait: false,
    },
    // ═══ WORKING TEAM MEMBERS (2 slides) ═══
    {
      img: '/images/lab_researcher_solution.png',
      alt: 'MRPL research team member holding H2S reactive solution for dosimeter calibration',
      category: 'WORKING TEAM MEMBERS',
      eyebrow: 'MRPL Research & Development Team',
      headline: <>Built on Real<br/>Science.</>,
      subhead: 'Every calibration curve is backed by hands-on laboratory work — not simulation. The team validates each batch under real conditions.',
      tags: ['R&D TEAM', 'IN-HOUSE LAB', 'BATCH VALIDATION', 'REAL DATA'],
      portrait: false,
    },
    {
      img: '/images/lab_chemical_stirrer.png',
      alt: 'Laboratory chemical stirrer with H2S reactive solution in sealed chamber experiment',
      category: 'WORKING TEAM MEMBERS',
      eyebrow: 'Controlled Laboratory Characterisation',
      headline: <>Controlled Gas<br/>Chamber Testing.</>,
      subhead: 'Multi-concentration exposure experiments correlating colorimetric response with certified electrochemical reference detectors.',
      tags: ['SEALED CHAMBER', 'CALIBRATED H₂S', 'REFERENCE COMPARISON', 'BATCH TESTING'],
      portrait: false,
    },
    // ═══ APP (1 slide) ═══
    {
      img: '/images/app_screen_role_select.png',
      alt: 'AuraOne app — Select Your Role screen for Worker, HSE Officer, Supervisor, Management',
      category: 'APP',
      eyebrow: 'AuraOne · Five Role-Based Access Tiers',
      headline: <>Purpose-Built<br/>for Every Role.</>,
      subhead: 'Worker, HSE Officer, Supervisor, Management, and Administrator — a tailored dashboard for every stakeholder in the occupational safety chain.',
      tags: ['ROLE BASED', 'HSE OFFICER', 'SUPERVISOR', 'WORKER VIEW'],
      portrait: true,
    },
    // ═══ BAND (2 slides) ═══
    {
      img: '/images/actual_band.jpg',
      alt: 'Actual MRPL Chem-Strip DoseBand physical prototype showing serialized QR, single-use indicator and void protection',
      category: 'BAND',
      eyebrow: 'Actual MRPL Chem-Strip Prototype · Passive Transport',
      headline: <>Intrinsic Chemical<br/>Safety by Design.</>,
      subhead: 'Physical colorimetric Chem-Strip wristband with serialized QR tracking and tamper-evident void indicator. Zero ignition risk in explosive atmospheres.',
      tags: ['CHEM-STRIP', 'NO BATTERY', 'SERIALIZED QR', 'SINGLE-USE'],
      portrait: true,
    },
    {
      img: '/images/wristband_wrist.jpg',
      alt: 'Actual MRPL Chem-Strip DoseBand worn on wrist by refinery worker on shift',
      category: 'BAND',
      eyebrow: 'Real Field Operations · MRPL Refinery',
      headline: <>Real Refinery Deployment.<br/>Proven On-Site.</>,
      subhead: 'Worn by operators handling high-sulfur sour crude units. Zero interference with heavy tools, valves, or standard PPE.',
      tags: ['REAL BAND', 'MRPL DEPLOYED', '100% PASSIVE', 'FIELD PROVEN'],
      portrait: true,
    },
  ]

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-play interval
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [paused, nextSlide])

  // Touch Swipe Handlers (Right swipe = previous, Left swipe = next)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide() // swiped left -> show next
      } else {
        prevSlide() // swiped right -> show prev (right swipe)
      }
    }
    touchStartX.current = null
  }

  // Mouse Drag Swipe Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX
    isDragging.current = true
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return
    const diff = mouseStartX.current - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide() // right swipe
      }
    }
    isDragging.current = false
    mouseStartX.current = null
  }

  return (
    <section 
      className="hero-slider" 
      id="top" 
      aria-label="MRPL-Style Hero Showcase Slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); isDragging.current = false }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="hero-slider__track">
        {slides.map((s, index) => {
          let positionClass = 'next-slide'
          if (index === current) positionClass = 'active'
          else if (index === (current - 1 + slides.length) % slides.length) positionClass = 'prev-slide'

          return (
            <div key={index} className={`hero-slide ${positionClass}${s.portrait ? ' hero-slide--portrait' : ''}`}>
              {/* Category pill */}
              {'category' in s && (
                <div className="hero__category-pill">{s.category as string}</div>
              )}

              {s.portrait ? (
                <>
                  <div className="hero__portrait-overlay" aria-hidden="true"/>
                  <div className="hero__portrait-phone">
                    <div className="hero__portrait-frame">
                      <img src={s.img} alt={s.alt} loading="lazy"/>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img className="hero__bg" src={s.img} alt={s.alt} loading={index === 0 ? 'eager' : 'lazy'}/>
                  <div className="hero__overlay" aria-hidden="true"/>
                </>
              )}

              <div className="hero__content">
                <div className="hero__eyebrow">
                  <div className="hero__eyebrow-line"/>
                  <span className="hero__eyebrow-text">{s.eyebrow}</span>
                </div>
                <h1 className="hero__headline">{s.headline}</h1>
                <div className="hero__passive-badge">PASSIVE WEARABLE</div>
                <p className="hero__subhead">{s.subhead}</p>

                <div className="hero__tags">
                  {s.tags.map((t, ti) => (
                    <span key={ti} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span className="hero__tag">{t}</span>
                      {ti < s.tags.length - 1 && <span className="hero__tag-sep"/>}
                    </span>
                  ))}
                </div>

                <div className="hero__ctas">
                  <a className="btn-primary" href="#technology">
                    EXPLORE TECHNOLOGY <ArrowRight/>
                  </a>
                  <a
                    className="btn-secondary"
                    href="/downloads/h2s-dosimeter.apk"
                    download="h2s-dosimeter.apk"
                    onClick={onDownload}
                    id="hero-slider-download-apk"
                  >
                    <DownloadIcon/> DOWNLOAD APP
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Side Swipe Navigation Arrows */}
      <button 
        className="hero-slider__arrow hero-slider__arrow--prev" 
        onClick={prevSlide} 
        aria-label="Previous Slide (Swipe Right)"
      >
        <ChevronLeft/>
      </button>
      <button 
        className="hero-slider__arrow hero-slider__arrow--next" 
        onClick={nextSlide} 
        aria-label="Next Slide (Swipe Left)"
      >
        <ChevronRight/>
      </button>

      {/* Bottom Slider Footer Pagination (MRPL style) */}
      <div className="hero-slider__footer">
        <div className="hero-slider__footer-inner">
          <div className="hero-slider__dots">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`hero-slider__dot${i === current ? ' active' : ''}`} 
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="hero-slider__counter">
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · {slides[current]?.category}
          </div>
          <div className="hero-slider__swipe-hint">
            ⇄ Swipe / Drag to navigate
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   NEWS TICKER (MRPL-style)
══════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [
    'Research Prototype Under Laboratory Validation',
    'Passive Colorimetric H₂S Dosimeter Wristband',
    'AI-Based Quantitative Reading System',
    'Designed for Petroleum Refining & Industrial Safety',
    'Cumulative Exposure Recording via Colorimetric Sensing',
    'No Battery Required for Sensing Mechanism',
    'Field Android APK Available for Controlled Testing',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-label="Research updates">
      <div className="ticker__inner">
        {doubled.map((item, i) => (
          <span key={i} className="ticker__item">▸ {item}</span>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 01 — THE PROBLEM (Concise + Bold Key Features + Actual Band)
   Stationary layout without awkward horizontal drift
══════════════════════════════════════════════════════════ */
function ProblemSection() {
  return (
    <section className="section section--white" id="problem" aria-labelledby="problem-heading">
      <div className="editorial">
        <div className="editorial__image-col img-reveal-wrap">
          {/* Actual physical DoseBand in field context: stationary, crisp, perfectly framed */}
          <img 
            src="/images/wristband_wrist.jpg" 
            alt="Actual physical DoseBand worn on industrial worker's wrist in refinery environment"
          />
        </div>
        <div className="editorial__content-col">
          <p className="section-label reveal">01 — THE PROBLEM</p>
          <h2 className="section-heading reveal delay-1" id="problem-heading">
            H₂S Exposure Is Not Always Obvious.
          </h2>
          <p className="section-body reveal delay-2">
            Hydrogen sulfide exposure can occur across refinery and industrial environments, yet cumulative personal exposure is difficult to monitor continuously in a practical wearable format.
          </p>
          
          {/* BOLD, IMMEDIATELY SCANNABLE KEY FEATURES */}
          <div className="feature-grid reveal delay-3">
            <div className="feature-item">
              <div className="feature-keyword">PASSIVE</div>
              <p className="feature-desc">No battery required for the sensing mechanism.</p>
            </div>
            <div className="feature-item">
              <div className="feature-keyword">CUMULATIVE</div>
              <p className="feature-desc">Records exposure over the monitoring period.</p>
            </div>
            <div className="feature-item">
              <div className="feature-keyword">WEARABLE</div>
              <p className="feature-desc">Designed around the worker.</p>
            </div>
            <div className="feature-item">
              <div className="feature-keyword">COLORIMETRIC</div>
              <p className="feature-desc">Physical chemical response produces a visible signal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 02 — CONCEPT / TECHNOLOGY (KEEP AS IS)
══════════════════════════════════════════════════════════ */
function TechnologyConceptSection() {
  const steps = [
    { num: '01', label: 'Ambient H₂S', desc: 'Hydrogen sulfide present in refinery or industrial environment.' },
    { num: '02', label: 'Passive Diffusion', desc: 'Gas diffuses through a permeable membrane into the sensing element without any active pump or power.' },
    { num: '03', label: 'Colorimetric Reaction', desc: 'H₂S reacts with a chemical indicator to produce a visible color change proportional to cumulative exposure.' },
    { num: '04', label: 'Cumulative Response', desc: 'The color deepens progressively over the shift duration, providing an integrated exposure record.' },
    { num: '05', label: 'Smartphone Capture', desc: 'At end of shift, the worker photographs the sensing region using the companion application.' },
    { num: '06', label: 'AI Quantitative Reading', desc: 'Machine learning model interprets color data and returns an estimated cumulative exposure value.' },
  ]
  return (
    <section className="section section--tinted section--lg" id="concept" aria-labelledby="concept-heading">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="section-label reveal">02 — TECHNOLOGY</p>
            <h2 className="section-heading reveal delay-1" id="concept-heading">
              A Different Approach to Exposure Monitoring.
            </h2>
            <p className="section-body reveal delay-2">
              Rather than relying on electronic sensors that require power and calibration in the field, this approach uses the fundamental chemistry of colorimetric sensing — a well-established principle in industrial hygiene — paired with modern image analysis.
            </p>
          </div>
          <div className="process-flow reveal delay-2">
            {steps.map(s => (
              <div className="process-step" key={s.num}>
                <span className="process-step__number">{s.num}</span>
                <div className="process-step__content">
                  <div className="process-step__label">{s.label}</div>
                  <p className="process-step__desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 03 — DIFFERENTIATOR SECTION (OTHERS vs DOSEBAND)
══════════════════════════════════════════════════════════ */
function DifferentiatorSection() {
  const comparisons = [
    {
      parameter: 'MATERIAL',
      others: 'Material choice may raise compatibility or reactivity concerns in harsh chemical zones.',
      us: 'Safe, non-reactive material selection engineered specifically for hydrocarbon environments.'
    },
    {
      parameter: 'SIZE',
      others: 'Multiple fixed sizes requiring complex inventory management and fitting trials.',
      us: 'Free-size wearable design with adaptable strap for comfortable fit over PPE.'
    },
    {
      parameter: 'EXPERIENCE',
      others: 'More complex user interaction with button presses, charging routines and menu navigation.',
      us: 'User-friendly workflow: slip on at shift start, wear unobtrusively, photograph at shift end.'
    },
    {
      parameter: 'POWER / SENSING',
      others: 'Electronic sensor circuits demanding constant battery power and periodic bump calibration.',
      us: '100% passive sensing requiring zero battery power during the operational monitoring period.'
    },
    {
      parameter: 'COVERAGE',
      others: 'High per-unit capital cost frequently restricts personal allocation to select personnel.',
      us: 'Cost-effective scalable architecture capable of comprehensive workforce deployment.'
    },
  ]

  return (
    <section className="section section--white diff-section" id="differentiator" aria-labelledby="diff-heading">
      <div className="container">
        <p className="section-label reveal">03 — DIFFERENTIATORS</p>
        <h2 className="section-heading reveal delay-1" id="diff-heading">
          Others vs DoseBand.
        </h2>
        <p className="section-body reveal delay-2">
          A concise overview of deliberate engineering and design decisions that separate the DoseBand passive wearable approach from conventional industrial monitoring alternatives.
        </p>

        <div className="reveal delay-3" style={{ overflowX: 'auto' }}>
          <table className="diff-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>DIMENSION</th>
                <th style={{ width: '45%' }}>CONVENTIONAL APPROACHES</th>
                <th style={{ width: '45%' }}>DOSEBAND APPROACH</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(c => (
                <tr key={c.parameter}>
                  <td>{c.parameter}</td>
                  <td className="others-col">{c.others}</td>
                  <td className="us-col">{c.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 04 — TECHNOLOGY ARCHITECTURE
   Clean, uniform 3-card structural breakdown + technical specs bar
   No simulators, no gimmicks — authoritative industrial engineering
══════════════════════════════════════════════════════════ */
function TechnologySection() {
  const layers = [
    {
      step: 'LAYER 01',
      title: 'Selective Permeation',
      subtitle: 'Hydrophobic PTFE Barrier',
      desc: 'Fixed-geometry microporous membrane allows ambient H₂S gas to diffuse freely driven by molecular concentration gradient, while strictly blocking liquid aerosols, splashes, and particulate contaminants.',
      badge: 'Fickian Diffusion · Zero Pump',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      )
    },
    {
      step: 'LAYER 02',
      title: 'Chemisorption Matrix',
      subtitle: 'Immobilized Reactive Salt',
      desc: 'Target-specific reagent chemically binds H₂S gas into an insoluble, non-reversible metal sulfide chromophore. Color darkening develops monotonically with cumulative shift exposure dose.',
      badge: 'Stoichiometric · Non-Reversible',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )
    },
    {
      step: 'LAYER 03',
      title: 'Optical Fiducial Ring',
      subtitle: 'Lighting-Invariant Reference',
      desc: 'On-substrate multi-spectral reference targets surround the active sensing window. Enables companion smartphone vision algorithm to normalize illumination variations, glare, and lens angle.',
      badge: 'ΔE Normalization · Auto-Aligned',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
        </svg>
      )
    }
  ]

  const metrics = [
    { label: 'TARGET ANALYTE', val: 'Hydrogen Sulfide (H₂S)', sub: 'Gas-phase chemical detection' },
    { label: 'INTEGRATION LAW', val: 'Fickian Molecular Diffusion', sub: 'Zero active pump or suction' },
    { label: 'OPERATING RANGE', val: '1 – 100 ppm·h', sub: 'Cumulative 8–12 hr shift dosimeter' },
    { label: 'INTRINSIC SAFETY', val: 'ATEX Zone 0 / IECEx', sub: '100% passive · Zero spark risk' },
  ]

  return (
    <section className="section section--tinted" id="technology" aria-labelledby="tech-heading">
      <div className="container">
        <div className="section-header-compact">
          <p className="section-label reveal">04 — TECHNOLOGY ARCHITECTURE</p>
          <h2 className="section-heading reveal delay-1" id="tech-heading">
            Passive Colorimetric Chemisorption.
          </h2>
          <p className="section-body reveal delay-2">
            Engineered strictly around chemical thermodynamics and diffusion laws. A three-tier passive sensing architecture captures cumulative H₂S exposure without batteries, pumps, or active electronics.
          </p>
        </div>

        <div className="tech-cards-grid reveal delay-3">
          {layers.map(l => (
            <div className="tech-card" key={l.step}>
              <div className="tech-card__top">
                <span className="tech-card__step">{l.step}</span>
                <span className="tech-card__icon">{l.icon}</span>
              </div>
              <h3 className="tech-card__title">{l.title}</h3>
              <div className="tech-card__subtitle">{l.subtitle}</div>
              <p className="tech-card__desc">{l.desc}</p>
              <div className="tech-card__badge">{l.badge}</div>
            </div>
          ))}
        </div>

        <div className="tech-specs-bar reveal delay-4">
          {metrics.map(m => (
            <div className="tech-specs-col" key={m.label}>
              <div className="tech-specs-label">{m.label}</div>
              <div className="tech-specs-val">{m.val}</div>
              <div className="tech-specs-sub">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 06 — PHYSICAL HARDWARE & WEARABLE
   Compact, uniform 2-column layout:
   Left: Actual prototype band photo with technical badge
   Right: 6 scannable industrial specification cards
   Uniform height, clean industrial aesthetic
══════════════════════════════════════════════════════════ */
function PhysicalBandSection() {
  const specs = [
    {
      num: '01',
      title: 'Fluoroelastomer Strap',
      desc: 'Engineered from chemical-resistant, hypoallergenic polymer impervious to crude fractions, amines, and sulfur compounds.'
    },
    {
      num: '02',
      title: 'Recessed Well (1.8mm)',
      desc: 'Deep protective bevel prevents physical abrasion, tool contact, and direct liquid washdown from reaching the reactive strip.'
    },
    {
      num: '03',
      title: 'Serialized 2D Matrix',
      desc: 'High-contrast laser-etched QR identifier links the physical badge directly to the worker session and cloud audit trail.'
    },
    {
      num: '04',
      title: 'Universal PPE Clasp',
      desc: 'Ergonomic dual-lock clasp fits directly on bare wrists or securely over thick Nomex refinery coverall cuffs.'
    },
    {
      num: '05',
      title: '-10°C to +55°C Envelope',
      desc: 'Validated for 10%–95% RH non-condensing refinery microclimates, maintaining stable diffusion constants across seasonal shifts.'
    },
    {
      num: '06',
      title: 'Zero Poisoning & Drift',
      desc: '100% passive chemical mechanism is immune to catalytic bead sensor poisoning from airborne siloxanes, solvents, or lead.'
    },
  ]

  return (
    <section className="section section--white" id="wristband" aria-labelledby="wristband-heading">
      <div className="container">
        <div className="section-header-compact">
          <p className="section-label reveal">06 — PHYSICAL DOSEBAND</p>
          <h2 className="section-heading reveal delay-1" id="wristband-heading">
            Industrial Ergonomics & Integrity.
          </h2>
          <p className="section-body reveal delay-2">
            Engineered specifically around the industrial worker. The physical band contains no delicate wiring, no lithium cells, and requires zero field calibration during operational deployment.
          </p>
        </div>

        <div className="band-showcase-grid reveal delay-3">
          {/* LEFT: Clean product showcase card */}
          <div className="band-visual-card">
            <div className="band-visual-card__header">
              <span className="band-visual-card__meta">MRPL PILOT BATCH · REV 1.4</span>
              <span className="band-visual-card__pill">PASSIVE WEARABLE</span>
            </div>
            <div className="band-visual-card__img-wrap">
              <img 
                src="/images/actual_band.jpg" 
                alt="MRPL Chem-Strip passive H2S dosimeter prototype band"
                className="band-visual-card__img"
              />
            </div>
            <div className="band-visual-card__footer">
              <div className="band-micro-spec">
                <span className="band-micro-spec__dot" />
                <span>Zero Battery</span>
              </div>
              <div className="band-micro-spec">
                <span className="band-micro-spec__dot" />
                <span>12-Hour Shift Life</span>
              </div>
              <div className="band-micro-spec">
                <span className="band-micro-spec__dot" />
                <span>Tamper-Evident</span>
              </div>
              <div className="band-micro-spec">
                <span className="band-micro-spec__dot" />
                <span>ATEX Zone 0</span>
              </div>
            </div>
          </div>

          {/* RIGHT: 6 clean specification cards */}
          <div className="band-specs-grid">
            {specs.map(s => (
              <div className="band-spec-card" key={s.num}>
                <div className="band-spec-card__num">{s.num}</div>
                <div className="band-spec-card__title">{s.title}</div>
                <p className="band-spec-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 07 & 08 — APP / DIGITAL SYSTEM & VISUAL STORY
══════════════════════════════════════════════════════════ */
function AppSystemSection({ onDownload }: { onDownload: () => void }) {
  const roles = [
    {
      num: '01',
      title: 'WORKER',
      desc: 'Mobile field interface with serialized QR scan, pre-use verification, guided end-of-shift optical photo capture, and personal cumulative history.'
    },
    {
      num: '02',
      title: 'SUPERVISOR',
      desc: 'Shift oversight console tracking team badge activations, return statuses, completed reads, and immediate alerts for elevated exposure indications.'
    },
    {
      num: '03',
      title: 'HSE OFFICER',
      desc: 'Comprehensive compliance dashboard tracking plant-wide cumulative exposure patterns, audit verification records, and calibration traceability.'
    },
    {
      num: '04',
      title: 'MANAGEMENT',
      desc: 'Operational safety metrics, cross-shift risk summaries, and documented evidence supporting occupational hygiene reporting.'
    },
    {
      num: '05',
      title: 'SYSTEM ADMIN',
      desc: 'DoseBand serialized batch registry, badge expiration tracking, organizational permission tiers, and calibration curve profile management.'
    },
  ]

  const measurementSteps = [
    'Camera Guidance',
    'Badge Detection',
    'Fiducial Alignment',
    'Perspective Correction',
    'Reference Patches',
    'Lighting Normalization',
    'Sensor ROI Extraction',
    'Optical Feature Analysis',
    'Calibration Curve Lookup',
    'Result / Refusal Decision'
  ]

  return (
    <section className="section section--tinted section--lg" id="app" aria-labelledby="app-heading">
      <div className="container">
        <p className="section-label reveal">07 — DIGITAL ECOSYSTEM</p>
        <h2 className="section-heading reveal delay-1" id="app-heading">
          Occupational H₂S Monitoring System.
        </h2>
        <p className="section-body reveal delay-2">
          The companion application is not a standalone camera scanner. It connects the physical DoseBand into a rigorous industrial chain of custody: from serialized issue, through the monitoring shift, to verified optical record creation.
        </p>

        <div className="roles-grid reveal delay-3">
          {roles.map(r => (
            <div className="role-cell" key={r.num}>
              <div className="role-cell__num">ROLE {r.num}</div>
              <div className="role-cell__title">{r.title}</div>
              <p className="role-cell__desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="editorial editorial--reverse" style={{ marginTop: '80px' }}>
        <div className="editorial__image-col img-reveal-wrap">
          <img 
            src="/images/app_mockup.jpg" 
            alt="AuraOne H2S Dosimeter app on rugged Android phone scanning the MRPL Chem-Strip band, showing 0.8 ppm cumulative exposure readout"
          />
        </div>
        <div className="editorial__content-col">
          <p className="section-label reveal">08 — OPTICAL MEASUREMENT WORKFLOW</p>
          <h3 className="section-heading reveal delay-1" style={{ fontSize: '32px' }}>
            Rigorous Optical Verification.
          </h3>
          <p className="section-body reveal delay-2" style={{ fontSize: '15px' }}>
            Color measurement is never reduced to a naive average RGB calculation. The camera engine validates physical geometry and lighting against on-badge reference patches before colorimetric interpretation.
          </p>

          <div className="reveal delay-3" style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green-60)', marginBottom: '12px' }}>
              Sequential Measurement Pipeline:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {measurementSteps.map((step, idx) => (
                <div key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--green-05)', border: '1px solid var(--green-20)', padding: '6px 10px', borderRadius: '1px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green-60)' }}>{String(idx + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.3px' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quality-notice reveal delay-3">
            <div className="quality-notice__label">Image Quality Assurance Rule</div>
            <p className="quality-notice__text">
              Captures with excessive blur, glare reflection, geometric skew, poor lighting, or missing fiducials are automatically rejected for re-capture. <strong>A bad photograph does not equal a bad DoseBand.</strong>
            </p>
          </div>

          <div className="reveal delay-4" style={{ marginTop: '24px', padding: '16px 20px', border: '1px solid var(--green-20)', background: 'var(--white)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green-60)', marginBottom: '4px' }}>
              Target Measurand & Scientific Output
            </div>
            <div style={{ fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 }}>
              Quantifies cumulative external H₂S exposure: <strong>D = ∫ C(t)dt</strong> expressed in <strong>ppm·h</strong>. Does not estimate inhaled or biological dose.
            </div>
            <div style={{ marginTop: '8px', fontSize: '11.5px', fontStyle: 'italic', color: 'var(--green-70)' }}>
              "Optical measurement completed. Quantitative H₂S calibration is not available for this configuration."
            </div>
          </div>

          <div className="reveal delay-4" style={{ marginTop: '32px' }}>
            <a 
              className="btn-primary" 
              href="/downloads/h2s-dosimeter.apk" 
              download="h2s-dosimeter.apk" 
              onClick={onDownload}
              id="app-section-download-apk"
            >
              <DownloadIcon/> DOWNLOAD APP (ANDROID APK)
            </a>
            <div style={{ marginTop: '8px', fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--green-60)', letterSpacing: '1px' }}>
              Direct APK download · Compatible with Android 10+
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 08B — APP SCREENSHOTS (PHONE MOCKUP SHOWCASE)
   Three real AuraOne screens inside CSS phone frames,
   interactive tab-select, feature callouts on each side.
══════════════════════════════════════════════════════════ */
function AppScreenshotsSection() {
  const [active, setActive] = useState(1)

  const screens = [
    {
      id: 0,
      img: '/images/app_screen_role_select.png',
      alt: 'AuraOne app – Select Your Role screen showing Worker, HSE Officer, Supervisor, Management, Administrator roles',
      label: 'Role Selection',
      tag: 'ROLE ONBOARDING',
      desc: 'Tailored access for every stakeholder in the occupational safety chain — from the field worker wearing the band to the HSE officer reviewing compliance data.',
      features: [
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
          text: 'Worker — DoseBand monitoring, shift history, safety info'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
          text: 'HSE Officer — Compliance review, exposure records'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>,
          text: 'Supervisor — Team monitoring, operational exceptions'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
          text: 'Management — De-identified summary trends & reports'
        },
      ]
    },
    {
      id: 1,
      img: '/images/app_screen_home.png',
      alt: 'AuraOne app – Home screen showing Scan new DoseBand CTA and step-by-step monitoring instructions',
      label: 'Home · Scan',
      tag: 'SCAN & ASSIGN',
      desc: 'The worker\u2019s primary interface. Guides through the complete DoseBand workflow \u2014 from taking an unused band from the store to confirming the shift and wearing it.',
      features: [
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
          text: 'Scan QR code printed on each serialized DoseBand'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
          text: 'Pre-use photograph check before assignment'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
          text: 'Instant digital linkage to worker identity & shift'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M7 20V8l5 4V4l7 6v10"/></svg>,
          text: 'Wear as instructed by site safety protocol'
        },
      ]
    },
    {
      id: 2,
      img: '/images/app_screen_history.png',
      alt: 'AuraOne app – History screen showing 7-day and 30-day monitoring period filter with no records state',
      label: 'History',
      tag: 'AUDIT TRAIL',
      desc: 'Every completed monitoring period becomes a permanent, tamper-evident record. 7-day and 30-day filters give supervisors and HSE officers instant traceability.',
      features: [
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
          text: '7-day and 30-day period filters for rapid review'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
          text: 'Each record locked at final scan — no edits permitted'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
          text: 'Records kept individually; no dose accumulation'
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
          text: 'Custom date range for targeted HSE audit periods'
        },
      ]
    },
  ]

  return (
    <section className="app-screenshots-section" id="app-screenshots" aria-labelledby="screenshots-heading">
      {/* Header */}
      <div className="container">
        <div className="app-screenshots__header reveal">
          <div>
            <p className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>08B — AURAONE APP · REAL SCREENSHOTS</p>
            <h2 className="section-heading" id="screenshots-heading" style={{ color: 'var(--white)', letterSpacing: '-0.5px' }}>
              Purpose-Built Industrial<br/>Monitoring App.
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '520px', marginTop: '12px' }}>
              Designed for MRPL refinery workers and HSE teams. Five role-based access tiers. Zero learning curve.
            </p>
          </div>
          <div className="app-screenshots__tab-row">
            {screens.map(s => (
              <button
                key={s.id}
                className={`app-screenshots__tab${active === s.id ? ' active' : ''}`}
                onClick={() => setActive(s.id)}
                aria-label={`View ${s.label} screenshot`}
              >
                <span className="app-screenshots__tab-tag">{s.tag}</span>
                <span className="app-screenshots__tab-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phones + callouts */}
      <div className="container">
        <div className="app-screenshots__stage reveal delay-2">

          {/* Left callout */}
          <div className="app-screenshots__callouts app-screenshots__callouts--left">
            {screens[active].features.slice(0, 2).map((f, i) => (
              <div key={i} className="app-callout app-callout--left">
                <div className="app-callout__icon">{f.icon}</div>
                <div className="app-callout__text">{f.text}</div>
              </div>
            ))}
          </div>

          {/* Three phone frames */}
          <div className="app-screenshots__phones">
            {screens.map((s, idx) => {
              const offset = idx - active
              return (
                <div
                  key={s.id}
                  className={`phone-frame${active === s.id ? ' phone-frame--active' : ''}${Math.abs(offset) === 1 ? ' phone-frame--side' : ''}${Math.abs(offset) >= 2 ? ' phone-frame--far' : ''}`}
                  onClick={() => setActive(s.id)}
                  style={{
                    '--phone-offset': offset,
                  } as React.CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${s.label} screen`}
                  onKeyDown={e => e.key === 'Enter' && setActive(s.id)}
                >
                  {/* Phone body */}
                  <div className="phone-frame__body">
                    <div className="phone-frame__notch"/>
                    <div className="phone-frame__screen">
                      <img src={s.img} alt={s.alt} loading="lazy"/>
                    </div>
                    <div className="phone-frame__home-bar"/>
                  </div>
                  {/* Label beneath */}
                  <div className="phone-frame__label">
                    <span className="phone-frame__label-tag">{s.tag}</span>
                    <span className="phone-frame__label-name">{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right callout */}
          <div className="app-screenshots__callouts app-screenshots__callouts--right">
            {screens[active].features.slice(2, 4).map((f, i) => (
              <div key={i} className="app-callout app-callout--right">
                <div className="app-callout__text">{f.text}</div>
                <div className="app-callout__icon">{f.icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active screen description */}
        <div className="app-screenshots__desc-row reveal delay-3">
          <div className="app-screenshots__desc-badge">{screens[active].tag}</div>
          <p className="app-screenshots__desc-text">{screens[active].desc}</p>
          <div className="app-screenshots__dots">
            {screens.map(s => (
              <button
                key={s.id}
                className={`app-screenshots__dot${active === s.id ? ' active' : ''}`}
                onClick={() => setActive(s.id)}
                aria-label={`Go to ${s.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 09 — LAB VALIDATION (ACTUAL LAB CHAMBER IMAGE)
══════════════════════════════════════════════════════════ */
function LabValidationSection() {
  const parameters = [
    { name: 'Controlled Exposure Chamber', status: 'Active Rig Validation', desc: 'Sealed exposure chamber delivering calibrated H₂S flow concentrations.' },
    { name: 'Substrate Response Repeatability', status: 'Under Laboratory Validation', desc: 'Batch-to-batch colorimetric consistency across standardized exposure intervals.' },
    { name: 'Optical Drift Compensation', status: 'Under Laboratory Validation', desc: 'Correction algorithms addressing ambient smartphone illumination variance.' },
    { name: 'Environmental Cross-Sensitivity', status: 'Under Laboratory Validation', desc: 'Characterization in the presence of ambient humidity, SO₂, and hydrocarbon vapors.' },
    { name: 'Analytical Reference Comparison', status: 'Under Laboratory Validation', desc: 'Direct correlation with certified electrochemical reference instrumentation.' },
  ]

  return (
    <section className="section section--white section--lg" id="validation" aria-labelledby="validation-heading">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="section-label reveal">09 — LABORATORY VALIDATION</p>
            <h2 className="section-heading reveal delay-1" id="validation-heading">
              Evidence-Based Validation.
            </h2>
            <p className="section-body reveal delay-2">
              Controlled exposure experiments are conducted inside sealed environmental chambers using calibrated H₂S gas blends. Physical chemical responses are recorded against reference instruments before calibration curves are established.
            </p>

            <div className="reveal delay-3" style={{ marginTop: '36px', borderLeft: '4px solid var(--green)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)' }}>
                Experimental Progression
              </div>
              <div style={{ fontSize: '14px', color: 'var(--green-80)', marginTop: '6px', lineHeight: 1.6 }}>
                Controlled Exposure → Physical Response → Optical Reading → Quantitative Calibration
              </div>
            </div>

            <div className="disclaimer-box reveal delay-4" style={{ marginTop: '32px' }}>
              <div className="disclaimer-box__label">Scientific Transparency Notice</div>
              <p className="disclaimer-box__text">
                All performance metrics presented represent active laboratory investigation. No synthetic data, fabricated ppm curves, or simulated operational claims are published prior to peer-reviewed calibration signoff.
              </p>
            </div>
          </div>

          <div className="reveal delay-2">
            <div className="img-reveal-wrap" style={{ marginBottom: '16px', border: '1px solid var(--green-20)' }}>
              <img 
                src="/images/lab_researcher_solution.png" 
                alt="MRPL researcher holding yellow H2S reactive solution beaker during laboratory characterisation"
                style={{ width: '100%', display: 'block' }}
              />
              <div style={{ padding: '12px 16px', background: 'var(--green-05)', borderTop: '1px solid var(--green-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green-70)' }}>
                  LABORATORY VALIDATION · MRPL IN-HOUSE
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--green-60)' }}>
                  Chemical Analysis · AuraOne Research
                </span>
              </div>
            </div>
            <div className="img-reveal-wrap" style={{ marginBottom: '28px', border: '1px solid var(--green-20)' }}>
              <img 
                src="/images/lab_chemical_stirrer.png" 
                alt="Laboratory magnetic stirrer with H2S reactive solution beaker for calibration experiment"
                style={{ width: '100%', display: 'block' }}
              />
              <div style={{ padding: '12px 16px', background: 'var(--green-05)', borderTop: '1px solid var(--green-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green-70)' }}>
                  CONTROLLED STIRRER EXPERIMENT
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--green-60)' }}>
                  Controlled Atmosphere Test Rig
                </span>
              </div>
            </div>

            <table className="validation-table">
              <thead>
                <tr>
                  <th>Validation Dimension</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map(p => (
                  <tr key={p.name}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--green-70)', marginTop: '2px' }}>{p.desc}</div>
                    </td>
                    <td><span className="badge--pending">⏳ {p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SECTION 10 + 11 — MRPL-STYLE STORY SWIPE SLIDER
   Interactive swipe carousel with right-swipe transition,
   tab navigation & prev/next buttons (NO vertical scroll hijacking!)
══════════════════════════════════════════════════════════ */
function StorySwipeSlider() {
  const [activeTab, setActiveTab] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const mouseStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const stories = [
    {
      tabLabel: '01 · Safety Protocol',
      sectionLabel: '10 — OCCUPATIONAL SAFETY',
      title: 'Built for Hazardous Environments.',
      desc: 'Refinery safety mandates extreme reliability. DoseBand removes electrical ignition risks entirely from personal dosimetry through passive chemical transport.',
      img: '/images/mrpl_aura_app_splash.png',
      alt: 'MRPL Mangalore Refinery with AuraOne occupational monitoring deployment',
      points: [
        { label: 'Zero Battery Risk', text: 'No electronic circuits or cells deployed in explosive hydrocarbon atmospheres.' },
        { label: 'Human Visual Signal', text: 'Direct color change provides immediate visible verification without device boot delay.' },
        { label: 'PPE Compatibility', text: 'Seamlessly accommodates heavy flame-retardant sleeves and protective gloves.' },
        { label: 'Human In The Loop', text: 'Optical readings serve decision-support functions under qualified supervisor oversight.' },
      ]
    },
    {
      tabLabel: '02 · Refining Operations',
      sectionLabel: '11 — REFINING PROCESS UNITS',
      title: 'Target Operational Process Areas.',
      desc: 'Continuous and turnaround coverage across critical processing units with documented sour gas hazards and variable ambient concentrations.',
      img: '/images/lab_researcher_titration.png',
      alt: 'MRPL laboratory researcher performing titration with DoseBand monitoring on tablet',
      points: [
        { label: 'Distillation Columns', text: 'Crude and vacuum distillation towers handling sour crude feeds with volatile fractions.' },
        { label: 'Sulfur Recovery (SRU)', text: 'Claus units and tail gas treatment where high-concentration H₂S is converted to elemental sulfur.' },
        { label: 'Hydrotreating Units', text: 'Catalytic hydrodesulfurization (HDS) reactors operating at elevated temperatures and pressures.' },
        { label: 'Sour Water Strippers', text: 'Stripping columns concentrating hydrogen sulfide off sour condensate streams.' },
      ]
    },
    {
      tabLabel: '03 · Industrial Sectors',
      sectionLabel: '11 — DIVERSE SECTORS',
      title: 'Broader Industrial Deployment.',
      desc: 'Engineered for scalability across midstream oil & gas, petrochemical crackers, wastewater handling, and permit-required confined spaces.',
      img: '/images/lab_researcher_solution.png',
      alt: 'MRPL researcher holding H2S reactive solution — broader industrial application',
      points: [
        { label: 'Petrochemical Plants', text: 'Ethylene and aromatic units processing hydrocarbon feedstocks with sulfur contaminants.' },
        { label: 'Upstream & Gathering', text: 'Sour gas wellheads, pigging stations, and pipeline valve inspection routines.' },
        { label: 'Wastewater & Utilities', text: 'Biological sludge treatment and anaerobic digestion tanks generating biogenic H₂S.' },
        { label: 'Confined Spaces', text: 'Cumulative exposure audit trails supporting permit-to-work protocols in vessels and sumps.' },
      ]
    },
    {
      tabLabel: '04 · Laboratory Rigor',
      sectionLabel: 'LABORATORY RIGOR',
      title: 'Methodology & Characterization.',
      desc: 'Experimental testing protocols designed to isolate optical response curves across temperature ranges, gas mixtures, and exposure durations.',
      img: '/images/lab_chemical_stirrer.png',
      alt: 'Laboratory magnetic stirrer with H2S reactive solution for controlled dosimeter calibration',
      points: [
        { label: 'Sealed Chamber Testing', text: 'Calibrated mass flow controllers delivering precise H₂S concentrations from certified cylinders.' },
        { label: 'Spectrophotometric Baseline', text: 'Direct comparison between smartphone camera RGB extraction and benchtop spectrophotometers.' },
        { label: 'Interference Testing', text: 'Evaluation against sulfur dioxide, volatile organics, and variable relative humidity levels.' },
        { label: 'Batch Reproducibility', text: 'Statistical validation across production batches ensuring uniform diffusion rates.' },
      ]
    },
  ]

  const nextStory = useCallback(() => {
    setActiveTab(prev => (prev + 1) % stories.length)
  }, [stories.length])

  const prevStory = useCallback(() => {
    setActiveTab(prev => (prev - 1 + stories.length) % stories.length)
  }, [stories.length])

  // Touch Swipe Handlers (Right swipe = previous, Left swipe = next)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextStory()
      else prevStory() // right swipe
    }
    touchStartX.current = null
  }

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX
    isDragging.current = true
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return
    const diff = mouseStartX.current - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextStory()
      else prevStory() // right swipe
    }
    isDragging.current = false
    mouseStartX.current = null
  }

  return (
    <section 
      className="section section--white story-slider" 
      id="safety-sectors" 
      aria-label="Safety & Industrial Sectors Showcase"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="container">
        <p className="section-label reveal">SAFETY & OPERATIONAL REACH</p>
        <h2 className="section-heading reveal delay-1">
          Safety Protocols & Field Deployment.
        </h2>
        <p className="section-body reveal delay-2">
          Explore the design parameters, industrial process units, and laboratory methodology governing the DoseBand system. <em>Swipe or click tabs to explore.</em>
        </p>
      </div>

      {/* MRPL-style Tab Navigation Bar */}
      <div className="story-slider__tabs" style={{ marginTop: '40px' }}>
        {stories.map((s, index) => (
          <button 
            key={index} 
            className={`story-slider__tab${index === activeTab ? ' active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {s.tabLabel}
          </button>
        ))}
      </div>

      {/* Swipeable Viewport */}
      <div className="container" style={{ position: 'relative' }}>
        <div className="story-slider__viewport">
          {stories.map((s, index) => {
            let posClass = 'next-slide'
            if (index === activeTab) posClass = 'active'
            else if (index === (activeTab - 1 + stories.length) % stories.length) posClass = 'prev-slide'

            return (
              <div key={index} className={`story-slide ${posClass}`}>
                <div>
                  <p className="section-label">{s.sectionLabel}</p>
                  <h3 style={{ fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 800, color: 'var(--green)', lineHeight: 1.15, marginBottom: '16px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--green-80)', lineHeight: 1.7, marginBottom: '28px' }}>
                    {s.desc}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {s.points.map(pt => (
                      <div key={pt.label} style={{ borderLeft: '2px solid var(--green)', paddingLeft: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--green)' }}>
                          {pt.label}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--green-70)', marginTop: '4px', lineHeight: 1.5 }}>
                          {pt.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="story-slide__img-wrap">
                  <img src={s.img} alt={s.alt}/>
                </div>
              </div>
            )
          })}
        </div>

        {/* Swipe Controls and Indicator */}
        <div className="story-slider__footer-nav">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>
            TOPIC 0{activeTab + 1} / 0{stories.length} · {stories[activeTab].tabLabel}
          </div>
          <div className="story-slider__nav-btns">
            <button 
              className="story-slider__nav-btn" 
              onClick={prevStory} 
              aria-label="Previous Topic (Swipe Right)"
            >
              <ChevronLeft/>
            </button>
            <button 
              className="story-slider__nav-btn" 
              onClick={nextStory} 
              aria-label="Next Topic (Swipe Left)"
            >
              <ChevronRight/>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}


/* ══════════════════════════════════════════════════════════
   FINAL CTA SECTION
══════════════════════════════════════════════════════════ */
function FinalCTA({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="container">
        <p className="section-label reveal" style={{ color: 'var(--white-60)', justifyContent: 'center', opacity: 1 }}>
          H₂S DOSIMETER WRISTBAND
        </p>
        <h2 className="cta-section__headline reveal delay-1" id="cta-heading">
          Make Invisible<br/>Exposure Visible.
        </h2>
        <p className="cta-section__body reveal delay-2">
          A passive wearable approach connecting chemical sensing, quantitative image analysis and practical industrial safety workflows.
        </p>
        <div className="cta-section__buttons reveal delay-3">
          <a className="btn-white" href="#technology">EXPLORE TECHNOLOGY <ArrowRight/></a>
          <a 
            className="btn-outline-white" 
            href="/downloads/h2s-dosimeter.apk" 
            download="h2s-dosimeter.apk" 
            onClick={onDownload}
            id="final-download-apk"
          >
            <DownloadIcon/> DOWNLOAD APP
          </a>
        </div>
        <div className="reveal delay-4" style={{ marginTop: '48px', fontSize: '11px', fontWeight: 600, color: 'var(--white-40)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          Android APK · Direct Download · Research Build
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FOOTER (MRPL-style)
══════════════════════════════════════════════════════════ */
function Footer({ onDownload }: { onDownload: () => void }) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__brand-logo">
                <LogoIcon size={40} inverted={false}/>
                <div>
                  <div className="footer__brand-name">H₂S Dosimeter</div>
                  <div className="footer__brand-sub">Research Prototype</div>
                </div>
              </div>
              <p className="footer__brand-desc">
                Passive Colorimetric H₂S Exposure-Dosimeter Wristband with AI-Based Quantitative Reading. A research initiative in passive personal gas dosimetry for industrial safety applications.
              </p>
              <a 
                className="btn-outline-white" 
                href="/downloads/h2s-dosimeter.apk" 
                download="h2s-dosimeter.apk" 
                onClick={onDownload} 
                style={{ marginTop: '8px', padding: '10px 20px', fontSize: '11px', display: 'inline-flex' }}
                id="footer-download-apk"
              >
                <DownloadIcon/> DOWNLOAD APP
              </a>
            </div>

            <div>
              <div className="footer__col-title">Architecture</div>
              <div className="footer__links">
                {['The Problem', 'Comparison', 'Technology', 'Wristband', 'Digital System'].map(l => (
                  <a 
                    key={l} 
                    className="footer__link" 
                    href={`#${l.toLowerCase().replace(/\s+/g, '-').replace('₂', '2')}`}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="footer__col-title">Validation</div>
              <div className="footer__links">
                {['Chamber Setup', 'Validation Criteria', 'Optical Pipeline', 'Lab Testing'].map(l => (
                  <span key={l} className="footer__link">{l}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="footer__col-title">Safety & Contact</div>
              <div className="footer__links">
                {['Safety Protocol', 'Prototype Notice', 'About Research', 'Refinery Deployment'].map(l => (
                  <span key={l} className="footer__link">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            H₂S Exposure-Dosimeter Wristband · Research Prototype · © 2026
          </div>
          <div className="footer__bottom-right">
            Not a certified industrial life-safety monitoring device.<br/>
            For occupational research and validation purposes only.
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════
   DOWNLOAD TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
function DownloadToast({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <div className={`download-toast${show ? ' show' : ''}`} role="alert" aria-live="polite">
      <div>
        <div className="download-toast__title">Starting App Package Download</div>
        <div className="download-toast__sub">h2s-dosimeter.apk · Research Build v1.0.4 (Android 10+)</div>
      </div>
      <button className="download-toast__close" onClick={onClose} aria-label="Close notification">✕</button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════ */
export default function App() {
  useReveal()
  const [downloadToast, setDownloadToast] = useState(false)

  const handleDownload = () => {
    setDownloadToast(true)
    setTimeout(() => {
      setDownloadToast(false)
    }, 4500)
  }

  return (
    <>
      <Header onDownload={handleDownload}/>
      <main>
        <HeroSlider onDownload={handleDownload}/>
        <Ticker/>
        <ProblemSection/>
        <TechnologyConceptSection/>
        <DifferentiatorSection/>
        <TechnologySection/>
        <PhysicalBandSection/>
        <AppSystemSection onDownload={handleDownload}/>
        <AppScreenshotsSection/>
        <LabValidationSection/>
        <StorySwipeSlider/>
        <FinalCTA onDownload={handleDownload}/>
      </main>
      <Footer onDownload={handleDownload}/>
      <DownloadToast show={downloadToast} onClose={() => setDownloadToast(false)}/>
    </>
  )
}

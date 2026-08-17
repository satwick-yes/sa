import { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleGenAI } from '@google/genai'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hls from 'hls.js'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const HLS_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

// ─────────────────────────────────────────────────────────────────
// HLS VIDEO BACKGROUND
// ─────────────────────────────────────────────────────────────────
function HLSVideo({ className = '', style = {}, flipped = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
    }
  }, [])
  return (
    <video
      ref={ref}
      autoPlay muted loop playsInline
      className={className}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        minWidth: '100%', minHeight: '100%',
        objectFit: 'cover',
        transform: `translate(-50%, -50%) ${flipped ? 'scaleY(-1)' : ''}`,
        ...style
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const words = ['Clarity', 'Purpose', 'Direction']
  const duration = 2700

  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * 100))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 400)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => Math.min(i + 1, words.length - 1)), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'hsl(var(--bg))',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 40
      }}
    >
      {/* Top-left label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: 32, left: 32,
          fontSize: 11, color: 'var(--muted-raw)',
          textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 500
        }}
      >
        Zero Confusion
      </motion.div>

      {/* Center — rotating words */}
      <div style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(40px, 8vw, 80px)',
              fontFamily: 'Instrument Serif, serif',
              fontStyle: 'italic',
              color: 'rgba(245,245,245,0.75)',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute', bottom: 48, right: 48,
          fontSize: 'clamp(48px, 10vw, 96px)',
          fontFamily: 'Instrument Serif, serif',
          color: 'hsl(var(--text))',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1
        }}
      >
        {String(count).padStart(3, '0')}
      </motion.div>

      {/* Bottom progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: 'rgba(255,255,255,0.06)'
      }}>
        <div
          className="accent-gradient"
          style={{
            height: '100%',
            transform: `scaleX(${count / 100})`,
            transformOrigin: 'left',
            transition: 'transform 0.05s linear',
            boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)'
          }}
        />
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function Navbar({ activeSection, onNav }) {
  const [scrolled, setScrolled] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = ['Home', 'Clarity', 'About']

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 50, display: 'flex', justifyContent: 'center',
      paddingTop: 20, paddingInline: 16
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        borderRadius: 9999,
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(20,20,20,0.7)',
        padding: '8px 8px',
        gap: 4,
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        transition: 'box-shadow 0.3s ease'
      }}>
        {/* Logo */}
        <div
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{
            position: 'relative',
            width: 36, height: 36,
            borderRadius: '50%',
            cursor: 'pointer',
            transform: logoHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
        >
          {/* Gradient ring */}
          <div style={{
            position: 'absolute', inset: -2,
            borderRadius: '50%',
            background: logoHovered
              ? 'linear-gradient(270deg, #89AACC 0%, #4E85BF 100%)'
              : 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
            transition: 'background 0.4s ease'
          }} />
          {/* Inner */}
          <div style={{
            position: 'absolute', inset: 2,
            borderRadius: '50%',
            background: 'hsl(var(--bg))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 13, fontWeight: 400,
            color: 'hsl(var(--text))'
          }}>ZC</div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--stroke-raw)', margin: '0 4px' }} />

        {/* Nav links */}
        {links.map(link => (
          <button
            key={link}
            onClick={() => onNav(link.toLowerCase())}
            style={{
              fontSize: 13, fontWeight: 500,
              borderRadius: 9999,
              padding: '6px 16px',
              border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              background: activeSection === link.toLowerCase() ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeSection === link.toLowerCase() ? 'hsl(var(--text))' : 'var(--muted-raw)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { if (activeSection !== link.toLowerCase()) { e.currentTarget.style.color = 'hsl(var(--text))'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
            onMouseLeave={e => { if (activeSection !== link.toLowerCase()) { e.currentTarget.style.color = 'var(--muted-raw)'; e.currentTarget.style.background = 'transparent' } }}
          >
            {link}
          </button>
        ))}

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--stroke-raw)', margin: '0 4px' }} />

        {/* Say hi */}
        <div className="gradient-border-wrap" style={{ borderRadius: 9999 }}>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              position: 'relative', zIndex: 1,
              fontSize: 13, fontWeight: 500,
              borderRadius: 9999,
              padding: '6px 16px',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              background: 'rgba(20,20,20,0.8)',
              backdropFilter: 'blur(8px)',
              color: 'hsl(var(--text))',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            Get Clarity <span style={{ fontSize: 12 }}>↗</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────
function Hero({ onGetStarted }) {
  const nameRef = useRef(null)
  const blurRefs = useRef([])
  const [roleIndex, setRoleIndex] = useState(0)
  const roles = ['Idea-Stage Founder', 'First-Time Entrepreneur', 'Aspiring Builder', 'New Business Owner']

  useEffect(() => {
    // GSAP entrance
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(nameRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )
    tl.fromTo(blurRefs.current.filter(Boolean),
      { opacity: 0, filter: 'blur(10px)', y: 20 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
      '-=0.8'
    )
  }, [])

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="home" style={{
      position: 'relative', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* BG Video */}
      <HLSVideo />

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.20)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 760 }}>
        {/* Eyebrow */}
        <div
          ref={el => blurRefs.current[0] = el}
          style={{ opacity: 0, fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, marginBottom: 32 }}
        >
          Clarity-First · India's Business Platform
        </div>

        {/* Name / Headline */}
        <h1
          ref={nameRef}
          style={{
            opacity: 0,
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(52px, 9vw, 96px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--text))',
            marginBottom: 28
          }}
        >
          Zero Confusion
        </h1>

        {/* Role line */}
        <div
          ref={el => blurRefs.current[1] = el}
          style={{ opacity: 0, fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--muted-raw)', marginBottom: 48, fontWeight: 300 }}
        >
          Built for the{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                display: 'inline-block',
                fontFamily: 'Instrument Serif, serif',
                fontStyle: 'italic',
                color: 'hsl(var(--text))'
              }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
          {' '}in India.
        </div>

        {/* Description */}
        <p
          ref={el => blurRefs.current[2] = el}
          style={{ opacity: 0, fontSize: 15, color: 'var(--muted-raw)', maxWidth: 440, margin: '0 auto 44px', lineHeight: 1.7 }}
        >
          You don't need to know what you need. Tell us what you're trying to do — we'll give you a clear, honest plan for what to do next.
        </p>

        {/* CTAs */}
        <div
          ref={el => blurRefs.current[3] = el}
          style={{ opacity: 0, display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <div className="gradient-border-wrap" style={{ borderRadius: 9999 }}>
            <button
              className="btn-solid"
              onClick={onGetStarted}
              style={{ padding: '14px 32px', fontSize: 14 }}
            >
              Find My Next Step
            </button>
          </div>
          <button
            className="btn-outline"
            onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 32px', fontSize: 14 }}
          >
            How it works
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10
      }}>
        <span style={{ fontSize: 10, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'var(--stroke-raw)', overflow: 'hidden', position: 'relative' }}>
          <div
            className="animate-scroll-down accent-gradient"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%' }}
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// HOW IT WORKS (Journey Map — Section 2 of landing)
// ─────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', icon: '\uD83D\uDDE3\uFE0F', title: 'Tell us your idea', desc: 'Describe what you want to build in plain English. No business vocabulary required. No forms to fill.' },
    { num: '02', icon: '\u2702\uFE0F', title: 'We cut the noise', desc: "Our AI filters out everything you don't need right now — and gives you a frank, expert take on your idea." },
    { num: '03', icon: '\uD83C\uDFAF', title: 'You get a clear next step', desc: 'A detailed, India-specific 10-step execution plan. Exactly how, where, and what it costs.' },
  ]

  return (
    <section id="how" style={{ background: 'hsl(var(--bg))', padding: 'clamp(80px, 10vw, 140px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 80 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: 'var(--stroke-raw)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>The Journey</span>
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, color: 'hsl(var(--text))', marginBottom: 16 }}>
            From <em>confused</em> to clear.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-raw)', maxWidth: 440, lineHeight: 1.7 }}>
            A simple three-step process that takes you from not knowing what you need to knowing exactly what to do next.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-60px' }}
              style={{
                background: 'hsl(var(--surface))',
                border: '1px solid var(--stroke-raw)',
                borderRadius: 24,
                padding: 32,
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ borderColor: 'rgba(137,170,204,0.35)', transition: { duration: 0.2 } }}
            >
              {/* Step number background */}
              <div style={{
                position: 'absolute', top: -10, right: 16,
                fontFamily: 'Instrument Serif, serif',
                fontSize: 100, fontStyle: 'italic',
                color: 'rgba(255,255,255,0.03)',
                lineHeight: 1, userSelect: 'none'
              }}>{step.num}</div>

              <div style={{ fontSize: 32, marginBottom: 20 }}>{step.icon}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10 }}>Step {step.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'hsl(var(--text))', marginBottom: 12, lineHeight: 1.2 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted-raw)', lineHeight: 1.7 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// THE CLARITY ENGINE (Interactive 3-Screen Flow)
// ─────────────────────────────────────────────────────────────────

// ── Screen A: Input ──
function InputScreen({ onSubmit }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [placeholder, setPlaceholder] = useState('')

  const examples = [
    'I want to start a D2C skincare brand using Ayurvedic ingredients...',
    'I have an app idea but don\'t know how to register a company in India...',
    'I want to open a cloud kitchen in Bengaluru — where do I even start?',
    'I want to sell handmade jewelry online in India...',
  ]

  useEffect(() => {
    setPlaceholder(examples[0])
    if (focused) return
    let i = 0
    const id = setInterval(() => { i = (i + 1) % examples.length; setPlaceholder(examples[i]) }, 3500)
    return () => clearInterval(id)
  }, [focused])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 600, margin: '0 auto', width: '100%' }}
    >
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, marginBottom: 14 }}>
          The Clarity Engine
        </div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15, color: 'hsl(var(--text))', marginBottom: 10 }}>
          What are you trying to build?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted-raw)', lineHeight: 1.6 }}>
          Describe your idea in plain English. No jargon, no forms — just tell us what you're trying to do.
        </p>
      </div>

      <div className="zc-input">
        <textarea
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--stroke-raw)' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
            {value.length > 0 ? `${value.length} characters` : 'Plain English — no business jargon needed'}
          </span>
          <div className="gradient-border-wrap" style={{ borderRadius: 9999 }}>
            <button
              className="btn-solid"
              disabled={value.trim().length < 10}
              onClick={() => onSubmit(value.trim())}
              style={{ padding: '11px 24px', fontSize: 13, position: 'relative', zIndex: 1 }}
            >
              Analyze my idea
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[['🇮🇳', 'India-specific'], ['🔒', 'Private'], ['⚡', '< 60 seconds']].map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
            {icon} {label}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Screen B: Loading ──
function LoadingScreen2({ progress }) {
  const r = 44
  const circ = r * 2 * Math.PI
  const offset = circ - (progress / 100) * circ
  const msgs = ['Reading your idea...', 'Cutting through the noise...', 'Building your roadmap...', 'Almost done...']
  const msg = msgs[Math.min(Math.floor(progress / 25), 3)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 20, textAlign: 'center' }}
    >
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" className="ring">
          <circle cx="55" cy="55" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
          <circle
            cx="55" cy="55" r={r}
            stroke="url(#progress-grad)" strokeWidth="3" fill="none"
            strokeLinecap="round"
            className="ring-track"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#89AACC" />
              <stop offset="100%" stopColor="#4E85BF" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: 'hsl(var(--text))' }}>{progress}%</div>
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 500, color: 'hsl(var(--text))', marginBottom: 6 }}>Thinking...</div>
        <div style={{ fontSize: 14, color: 'var(--muted-raw)' }}>{msg}</div>
      </div>
    </motion.div>
  )
}

// ── Screen C: Reveal (split) ──
function RevealScreen({ aiData, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, minHeight: 420 }}
    >
      {/* Left */}
      <div style={{ paddingRight: 40, paddingBottom: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>
          What you don't need yet
        </div>
        <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', marginBottom: 24, lineHeight: 1.2 }}>
          Forget all of this — for now.
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {aiData.notNowList.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.04)',
                opacity: 0.45
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-raw)" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 13, color: 'var(--muted-raw)', textDecoration: 'line-through' }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ background: 'var(--stroke-raw)', margin: '0 0' }} />

      {/* Right */}
      <div style={{ paddingLeft: 40, paddingBottom: 8, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: 'hsl(var(--text))', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>
          A genuine take
        </div>
        <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic', color: 'hsl(var(--text))', marginBottom: 24, lineHeight: 1.2 }}>
          Here's what we think.
        </h3>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 28, flex: 1 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--stroke-raw)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>💡</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Expert View</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text))' }}>Is this viable?</div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', borderLeft: '2px solid rgba(137,170,204,0.4)', paddingLeft: 16 }}>
            "{aiData.genuineOpinion}"
          </p>
        </div>

        <div className="gradient-border-wrap" style={{ borderRadius: 9999 }}>
          <button
            className="btn-solid"
            style={{ width: '100%', padding: '14px 24px', fontSize: 14, position: 'relative', zIndex: 1 }}
            onClick={() => onNext(aiData)}
          >
            Show me my 10-step plan
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Screen D: Roadmap ──
function RoadmapScreen({ aiData, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}
    >
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-raw)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confused</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-raw)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 11, color: 'var(--muted-raw)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Clarity</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-raw)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 11, color: 'hsl(var(--text))', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Plan</span>
        </div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.1, color: 'hsl(var(--text))', marginBottom: 10 }}>
          Here's what to do — in order.
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted-raw)', lineHeight: 1.65 }}>
          10 specific steps with how, where, and estimated cost for India.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 56 }}>
        {aiData.roadmap.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            style={{ display: 'flex', gap: 18, paddingBottom: i < aiData.roadmap.length - 1 ? 28 : 0 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div className="step-badge">{step.stepNumber}</div>
              {i < aiData.roadmap.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'var(--stroke-raw)', marginTop: 8 }} />
              )}
            </div>
            <div style={{ paddingTop: 2, paddingBottom: i < aiData.roadmap.length - 1 ? 8 : 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'hsl(var(--text))', marginBottom: 12, lineHeight: 1.3 }}>{step.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 5 }}>How</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{step.howTo}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140, flexShrink: 0 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 4 }}>Where</div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{step.whereTo}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 4 }}>Est. Cost</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text))' }}>{step.estimatedCost}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-outline" style={{ fontSize: 13, padding: '10px 24px' }} onClick={onReset}>
          ← Try a different idea
        </button>
      </div>
    </motion.div>
  )
}

// ── AI Processor ──
function AIProcessor({ userInput, onSuccess, onError }) {
  const [progress, setProgress] = useState(0)
  const [aiData, setAiData] = useState(null)
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    let mounted = true
    const interval = setInterval(() => setProgress(p => p < 90 ? p + 1 : p), 140)

    const run = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY')
        const client = new GoogleGenAI({ apiKey })
        const schema = {
          type: 'object',
          required: ['stage', 'genuineOpinion', 'notNowList', 'roadmap'],
          properties: {
            stage: { type: 'string' },
            genuineOpinion: { type: 'string' },
            notNowList: { type: 'array', items: { type: 'string' }, minItems: 6, maxItems: 8 },
            roadmap: {
              type: 'array',
              items: {
                type: 'object',
                required: ['stepNumber', 'title', 'howTo', 'whereTo', 'estimatedCost'],
                properties: {
                  stepNumber: { type: 'integer' },
                  title: { type: 'string' },
                  howTo: { type: 'string' },
                  whereTo: { type: 'string' },
                  estimatedCost: { type: 'string' }
                }
              }
            }
          }
        }
        const interaction = await client.interactions.create({
          model: 'gemini-3.6-flash',
          input: `You are a sharp, honest Indian business consultant. A first-time founder says: "${userInput}". Give a genuineOpinion (frank, 2-3 sentences). List 6-8 notNowList items (things they don't need yet). Build a 10-step execution roadmap with how/where/INR cost per step. Be specific and honest. Return valid JSON.`,
          response_format: { type: 'text', mime_type: 'application/json', schema }
        })
        if (!mounted) return
        const parsed = JSON.parse(interaction.output_text)
        setAiData(parsed)
        setProgress(100)
        clearInterval(interval)
        setTimeout(() => { if (mounted) setPhase('reveal') }, 700)
      } catch (err) {
        console.error(err)
        if (mounted) onError(err.message)
        clearInterval(interval)
      }
    }
    run()
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  if (phase === 'loading') return <LoadingScreen2 progress={progress} />
  return <RevealScreen aiData={aiData} onNext={onSuccess} />
}

// ── Main Clarity Section ──
function ClarityEngine() {
  const [flow, setFlow] = useState('input')
  const [userInput, setUserInput] = useState('')
  const [aiData, setAiData] = useState(null)
  const [error, setError] = useState('')

  const reset = () => { setFlow('input'); setUserInput(''); setAiData(null); setError('') }

  return (
    <section id="clarity" style={{
      background: 'hsl(var(--bg))',
      padding: 'clamp(80px, 10vw, 120px) 24px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: 'var(--stroke-raw)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>Try It Now</span>
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, color: 'hsl(var(--text))' }}>
            The <em>Clarity</em> Engine.
          </h2>
        </motion.div>

        <div style={{
          background: 'hsl(var(--surface))',
          border: '1px solid var(--stroke-raw)',
          borderRadius: 28,
          padding: 'clamp(32px, 5vw, 56px)',
          minHeight: 480
        }}>
          <AnimatePresence mode="wait">
            {flow === 'input' && <InputScreen key="input" onSubmit={(t) => { setUserInput(t); setFlow('processing') }} />}
            {flow === 'processing' && <AIProcessor key="ai" userInput={userInput} onSuccess={(d) => { setAiData(d); setFlow('result') }} onError={(e) => { setError(e); setFlow('error') }} />}
            {flow === 'result' && aiData && <RoadmapScreen key="result" aiData={aiData} onReset={reset} />}
            {flow === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'hsl(var(--text))', marginBottom: 10 }}>Couldn't generate your plan</div>
                <p style={{ fontSize: 14, color: 'var(--muted-raw)', marginBottom: 24 }}>{error}</p>
                <button className="btn-solid" style={{ padding: '12px 28px', fontSize: 13 }} onClick={reset}>Try again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// ABOUT / PRINCIPLES SECTION
// ─────────────────────────────────────────────────────────────────
function About() {
  const principles = [
    { title: 'Clarity before catalog', desc: 'We never ask you to choose a service before we understand your situation.' },
    { title: 'No jargon, ever', desc: 'ROC, MCA, DIN — you don\'t need to know these terms to get started with us.' },
    { title: 'One step at a time', desc: 'We hide future steps until the current one is clear. No decision paralysis.' },
    { title: 'Genuine, not generic', desc: 'Every plan is tailored to your specific idea, situation, and the Indian market.' },
  ]

  return (
    <section id="about" style={{ background: 'hsl(var(--bg))', padding: 'clamp(80px, 10vw, 140px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'start' }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: 'var(--stroke-raw)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>About</span>
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.1, color: 'hsl(var(--text))', marginBottom: 20 }}>
            We exist for <em>one reason.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-raw)', lineHeight: 1.75, marginBottom: 16 }}>
            Starting or growing a business in India shouldn't require you to already know what you need. But every existing platform assumes you do.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted-raw)', lineHeight: 1.75 }}>
            Zero Confusion is different. You describe what you're trying to achieve. We do the thinking for you — and tell you exactly what your next step should be.
          </p>
        </motion.div>

        {/* Right — principles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-40px' }}
              style={{
                display: 'flex', gap: 20, padding: 24,
                background: 'hsl(var(--surface))',
                border: '1px solid var(--stroke-raw)',
                borderRadius: 18
              }}
              whileHover={{ borderColor: 'rgba(137,170,204,0.3)', transition: { duration: 0.2 } }}
            >
              <div className="step-badge" style={{ flexShrink: 0, marginTop: 2 }}>0{i + 1}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text))', marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted-raw)', lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: '100%', label: 'Confusion eliminated' },
    { value: '< 60s', label: 'To your execution plan' },
    { value: '₹0', label: 'To get started' },
  ]

  return (
    <section style={{
      background: 'hsl(var(--surface))',
      borderTop: '1px solid var(--stroke-raw)',
      borderBottom: '1px solid var(--stroke-raw)',
      padding: 'clamp(48px, 8vw, 80px) 24px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: '-40px' }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1, color: 'hsl(var(--text))', marginBottom: 10 }}>{item.value}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-raw)', fontWeight: 500 }}>{item.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// CONTACT / FOOTER
// ─────────────────────────────────────────────────────────────────
function Contact() {
  const marqueeRef = useRef(null)

  useEffect(() => {
    if (!marqueeRef.current) return
    // CSS animation fallback since GSAP marquee needs plugin
    marqueeRef.current.style.animation = 'marquee 35s linear infinite'
  }, [])

  return (
    <section id="contact" style={{ position: 'relative', overflow: 'hidden', paddingTop: 120, paddingBottom: 80 }}>
      {/* BG Video */}
      <HLSVideo flipped style={{ opacity: 0.25 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, hsl(var(--bg)), transparent)' }} />

      {/* Marquee */}
      <div style={{ position: 'relative', zIndex: 5, overflow: 'hidden', marginBottom: 80, height: 80, display: 'flex', alignItems: 'center' }}>
        <div ref={marqueeRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {Array(12).fill('CLARITY STARTS HERE • ').map((text, i) => (
            <span key={i} style={{
              fontFamily: 'Instrument Serif, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(40px, 6vw, 64px)',
              color: 'rgba(255,255,255,0.06)',
              paddingRight: 40,
              lineHeight: 1
            }}>{text}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: 'var(--muted-raw)', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, marginBottom: 24 }}>
          Ready to start?
        </div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.1, color: 'hsl(var(--text))', marginBottom: 24 }}>
          Book a Clarity Call.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted-raw)', lineHeight: 1.7, marginBottom: 40, maxWidth: 380, margin: '0 auto 40px' }}>
          A 30-minute 1-on-1 with an expert who will review your idea and tell you exactly what to do next.
        </p>
        <div className="gradient-border-wrap" style={{ borderRadius: 9999, display: 'inline-block', marginBottom: 16 }}>
          <button
            className="btn-solid"
            style={{ padding: '16px 40px', fontSize: 15, position: 'relative', zIndex: 1 }}
            onClick={() => alert('Booking flow would go here.')}
          >
            Book a Clarity Call ↗
          </button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted-raw)' }}>30 minutes · ₹499 · No hidden fees</div>
      </div>

      {/* Footer bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1100, margin: '80px auto 0',
        padding: '32px 24px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'hsl(var(--text))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 11, fontWeight: 400, color: 'hsl(var(--bg))' }}>ZC</div>
          <span style={{ fontSize: 13, color: 'var(--muted-raw)' }}>Zero Confusion © 2026</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
              animation: 'pulse-dot 2s ease-in-out infinite'
            }} />
            <span style={{ fontSize: 12, color: 'var(--muted-raw)', fontWeight: 500 }}>Taking on new clients</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Twitter', 'LinkedIn'].map(s => (
              <a
                key={s}
                href="#"
                style={{ fontSize: 12, color: 'var(--muted-raw)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(var(--text))' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-raw)' }}
              >{s}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  const scrollToClarity = useCallback(() => {
    document.getElementById('clarity')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleNav = useCallback((section) => {
    setActiveSection(section)
    const el = document.getElementById(section === 'home' ? 'home' : section)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id || 'home')
        })
      },
      { threshold: 0.4 }
    )
    ;['home', 'how', 'clarity', 'about', 'contact'].forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isLoading])

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar activeSection={activeSection} onNav={handleNav} />
          <main>
            <Hero onGetStarted={scrollToClarity} />
            <HowItWorks />
            <ClarityEngine />
            <Stats />
            <About />
            <Contact />
          </main>
        </>
      )}
    </>
  )
}

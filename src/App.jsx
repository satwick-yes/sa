import { useState, useEffect, useRef } from 'react'
import './index.css'

/* ─── Screen 1: Anti-Landing Page ─── */
function AntiLandingPage({ onNext }) {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const examples = [
    "I want to sell coffee online but don't know about licenses...",
    "I have a tutoring idea but unsure how to register it...",
    "I want to start a clothing brand but scared of legal stuff...",
  ]
  const [exampleIdx, setExampleIdx] = useState(0)

  useEffect(() => {
    if (!focused && text === '') {
      const timer = setInterval(() => {
        setExampleIdx(i => (i + 1) % examples.length)
      }, 3500)
      return () => clearInterval(timer)
    }
  }, [focused, text])

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)', top: -100, right: -100 }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,106,247,0.06) 0%, transparent 70%)', bottom: -50, left: -100 }} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c6af7, #9b59f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color: 'white', letterSpacing: '-0.5px'
          }}>ZC</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Zero Confusion</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>by i-SmokeStack</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Trusted by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1,200+</span> Indian founders
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div style={{ maxWidth: 720, width: '100%' }}>

          <div className="animate-fade-up opacity-0-init" style={{ marginBottom: 24 }}>
            <span className="tag">India's Clarity-First Platform</span>
          </div>

          <h1
            className="animate-fade-up opacity-0-init delay-100"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 20,
              color: 'var(--text-primary)',
            }}
          >
            Don't know what you need?{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7c6af7, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              That's exactly where we start.
            </span>
          </h1>

          <p
            className="animate-fade-up opacity-0-init delay-200"
            style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 560, lineHeight: 1.7 }}
          >
            Tell us what you're trying to build in India, and we'll tell you your exact next step — nothing more, nothing less.
          </p>

          {/* Input area */}
          <div
            className="animate-fade-up opacity-0-init delay-300"
            style={{
              background: 'var(--bg-card)',
              border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-subtle)'}`,
              borderRadius: 20,
              padding: '4px 4px 4px 20px',
              transition: 'all 0.3s',
              boxShadow: focused ? '0 0 0 4px var(--accent-dim)' : 'none',
              position: 'relative',
            }}
          >
            <textarea
              ref={textareaRef}
              id="idea-input"
              className="input-primary"
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={examples[exampleIdx]}
              rows={4}
              style={{
                width: '100%', background: 'transparent',
                border: 'none', outline: 'none', padding: '16px 0',
                resize: 'none', fontSize: 16, lineHeight: 1.7,
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {text.length > 0 ? `${text.length} characters` : 'Write in plain language — no jargon needed'}
              </span>
              <button
                id="find-next-step-btn"
                className="btn-accent"
                disabled={text.trim().length < 10}
                onClick={() => onNext(text)}
                style={{ padding: '12px 28px', borderRadius: 14, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Find My Next Step
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Trust signals */}
          <div className="animate-fade-up opacity-0-init delay-400" style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Private & secure' },
              { icon: '⚡', text: 'Answer in under 60 seconds' },
              { icon: '🇮🇳', text: 'India-specific guidance' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom section — Part 01 & 02 answers */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px 32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <DesignRationalePreview />
      </div>
    </div>
  )
}

/* Inline Part 01 + 02 preview at bottom */
function DesignRationalePreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Part 01 — User Persona</div>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          The Idea-Stage Founder
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          This is someone with a concrete business idea but zero clarity on how to legally or operationally bring it to life in India. They represent the highest level of <em>decision paralysis</em> — they Google "how to start a business in India" and get 40 conflicting answers. They don't need a service catalog; they need a trusted voice that says: <strong style={{ color: 'var(--text-primary)' }}>"Here is the one thing you do next."</strong> They are the perfect starting point for Zero Confusion because solving for maximum confusion creates a product that works for every user downstream.
        </p>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Part 02 — Journey Map</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: '1. Arrive', desc: 'Calm, conversational interface — no menus', icon: '🌅' },
              { step: '2. Brain Dump', desc: '"I want to sell coffee online..."', icon: '💬' },
              { step: '3. Sorting Hat', desc: 'System identifies: Idea Phase', icon: '🎯' },
              { step: '4. Clarity Reveal', desc: 'ONE next step surfaced, rest hidden', icon: '✨' },
              { step: '5. Action', desc: 'Book a Clarity Call to execute it', icon: '📞' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <div>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 600, fontSize: 12 }}>{item.step}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}> → {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            The logic is linear on purpose: we prevent choice overload by revealing information sequentially, not simultaneously. Users only see what they need to act on right now.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen 2: Clarity Assessment (Loading + Split) ─── */
function ClarityAssessment({ userInput, onNext }) {
  const [phase, setPhase] = useState('loading') // loading | reveal
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Reading your situation...')

  const steps = [
    { text: 'Reading your situation...', pct: 15 },
    { text: 'Mapping your idea to Indian business stages...', pct: 40 },
    { text: 'Filtering out what doesn\'t matter yet...', pct: 65 },
    { text: 'Identifying your one critical next step...', pct: 85 },
    { text: 'Done. Your clarity report is ready.', pct: 100 },
  ]

  useEffect(() => {
    let stepIdx = 0
    const timer = setInterval(() => {
      if (stepIdx < steps.length) {
        setLoadingText(steps[stepIdx].text)
        setProgress(steps[stepIdx].pct)
        stepIdx++
      } else {
        clearInterval(timer)
        setTimeout(() => setPhase('reveal'), 600)
      }
    }, 900)
    return () => clearInterval(timer)
  }, [])

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ position: 'relative', zIndex: 1 }}>
        <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,106,247,0.1) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="animate-scale-in" style={{ textAlign: 'center', maxWidth: 480 }}>
          {/* Spinner */}
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 32px' }}>
            <svg style={{ animation: 'spin-slow 2s linear infinite', width: 80, height: 80 }} viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-subtle)" strokeWidth="3" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="url(#grad)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="60 154"
                strokeDashoffset="-20"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c6af7" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent-light)' }}>
              {progress}%
            </div>
          </div>

          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            Analysing your situation
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, minHeight: 24, transition: 'all 0.4s' }}>
            {loadingText}
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 20, textAlign: 'left', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>YOUR INPUT</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
              "{userInput.slice(0, 140)}{userInput.length > 140 ? '...' : ''}"
            </div>
          </div>

          {/* Progress */}
          <div className="progress-bar" style={{ marginTop: 32 }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #7c6af7, #c084fc)',
              borderRadius: 2,
              width: `${progress}%`,
              transition: 'width 0.8s ease-out',
            }} />
          </div>
        </div>
      </div>
    )
  }

  // Reveal: split screen
  const notNow = [
    'GST Registration',
    'Build a website / app',
    'Hire your first employee',
    'Open a bank account',
    'Create a pitch deck',
    'Find co-founders',
    'Register a trademark',
    'Plan your marketing',
    'Set up social media',
    'Price your product',
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
      {/* Top bar */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c6af7, #9b59f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'white' }}>ZC</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Zero Confusion</span>
        </div>
        <div className="tag">Stage Identified: Idea Phase 💡</div>
      </div>

      {/* Split */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 89px)' }}>

        {/* LEFT — Not now */}
        <div
          className="animate-slide-left opacity-0-init"
          style={{
            borderRight: '1px solid var(--border-subtle)',
            padding: '48px 40px',
            background: 'rgba(255,255,255,0.01)',
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div className="section-label" style={{ color: 'var(--text-muted)', marginBottom: 10 }}>What you think you need</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1.3 }}>
              All of this?
              <span style={{ display: 'block', fontSize: 15, fontWeight: 400, marginTop: 6 }}>
                Forget it — for now.
              </span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notNow.map((item, i) => (
              <div
                key={i}
                className="animate-fade-up opacity-0-init"
                style={{
                  animationDelay: `${i * 60}ms`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  opacity: 1 - (i * 0.06),
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1, textDecoration: 'line-through', textDecorationColor: 'rgba(86,86,91,0.6)' }}>{item}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            These are all valid. But doing them before your entity is structured is like decorating a house before laying the foundation.
          </p>
        </div>

        {/* RIGHT — The one thing */}
        <div
          className="animate-slide-right opacity-0-init"
          style={{
            padding: '48px 40px',
            background: 'rgba(124, 106, 247, 0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>What you actually need to do right now</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              Just this.
              <span style={{ display: 'block', fontSize: 15, fontWeight: 400, color: 'var(--text-secondary)', marginTop: 6 }}>
                One decision. One step.
              </span>
            </h2>
          </div>

          {/* The card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,106,247,0.12), rgba(192,132,252,0.06))',
            border: '1.5px solid rgba(124,106,247,0.3)',
            borderRadius: 20,
            padding: '32px 28px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(124,106,247,0.08)', filter: 'blur(30px)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,106,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🏛️
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-light)', marginBottom: 2 }}>Priority Action</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Structure Your Business Entity</div>
              </div>
            </div>

            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>
              Before anything else, you need to decide: <strong style={{ color: 'var(--text-primary)' }}>LLP or Private Limited Company?</strong> This one decision affects your taxes, liability, fundraising ability, and compliance load for years to come.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Determines how you\'re taxed in India',
                'Shields you from personal financial liability',
                'Unlocks the ability to raise funding',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div className="check-circle">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button
              id="continue-to-action-btn"
              className="btn-accent"
              onClick={onNext}
              style={{ width: '100%', padding: '16px 24px', borderRadius: 14, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              Show Me My Action Plan
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
              Free to view • Talk to an expert to execute it
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen 3: Action Plan ─── */
function ActionPlan({ onReset }) {
  const [showRationale, setShowRationale] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
      <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,106,247,0.1) 0%, transparent 70%)', top: -80, right: -80 }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)', bottom: -40, left: -60 }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c6af7, #9b59f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'white' }}>ZC</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Zero Confusion</span>
        </div>
        <button
          onClick={onReset}
          style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Start over
        </button>
      </nav>

      <div style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '60px 32px' }}>

        {/* Breadcrumb */}
        <div className="animate-fade-up opacity-0-init" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {['Confusion', 'Clarity', 'Action'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '4px 14px', borderRadius: 100,
                background: i === 2 ? 'rgba(124,106,247,0.15)' : 'transparent',
                border: `1px solid ${i === 2 ? 'rgba(124,106,247,0.4)' : 'var(--border-subtle)'}`,
                fontSize: 12, fontWeight: 600,
                color: i === 2 ? 'var(--accent-light)' : 'var(--text-muted)',
              }}>
                {step}
              </div>
              {i < 2 && <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>}
            </div>
          ))}
        </div>

        {/* Main headline */}
        <div className="animate-fade-up opacity-0-init delay-100" style={{ marginBottom: 8 }}>
          <span className="tag">Your Next Step</span>
        </div>
        <h1
          className="animate-fade-up opacity-0-init delay-200"
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            marginTop: 12,
          }}
        >
          Your next step is:{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7c6af7, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Structuring your entity.
          </span>
        </h1>

        {/* Context card */}
        <div
          className="animate-fade-up opacity-0-init delay-300 glass-card"
          style={{ padding: 32, marginBottom: 28, borderColor: 'rgba(124,106,247,0.15)' }}
        >
          <p style={{ fontSize: 16.5, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
            Forget about marketing and web design for a moment.{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              Based on your idea, you need to decide between an LLP and a Pvt Ltd before doing anything else.
            </strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{
              padding: '20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: 'var(--text-primary)' }}>LLP</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Lower compliance burden. Good if you're bootstrapping and want simplicity. Cannot raise equity funding easily.
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--accent-light)', fontWeight: 600 }}>
                ₹5,000–₹8,000 to incorporate
              </div>
            </div>
            <div style={{
              padding: '20px', borderRadius: 14,
              background: 'rgba(124,106,247,0.06)',
              border: '1.5px solid rgba(124,106,247,0.25)',
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Pvt Ltd
                <span style={{ fontSize: 10, background: 'rgba(124,106,247,0.2)', color: 'var(--accent-light)', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>Recommended</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Standard for scalable businesses. Required for most investors. Slightly higher annual compliance.
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--accent-light)', fontWeight: 600 }}>
                ₹10,000–₹15,000 to incorporate
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="animate-fade-up opacity-0-init delay-400" style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
            After this step, you'll unlock
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { emoji: '🏦', text: 'Open a dedicated business bank account' },
              { emoji: '📜', text: 'Register for GST (when applicable)' },
              { emoji: '💻', text: 'Build your product and start selling' },
              { emoji: '📢', text: 'Plan your marketing and brand' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                opacity: 0.6 + i * 0.02,
              }}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.text}</span>
                <div style={{ marginLeft: 'auto' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="var(--border-medium)" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fade-up opacity-0-init delay-500">
          <button
            id="book-clarity-call-btn"
            className="btn-accent animate-bounce-subtle"
            style={{
              width: '100%', padding: '20px 32px', borderRadius: 18,
              fontSize: 18, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Book a Clarity Call to Sort This Out
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
            30-minute call with an expert • ₹499 • No hidden fees
          </p>
        </div>

        {/* Part 04 Design Rationale */}
        <div style={{ marginTop: 60 }}>
          <button
            onClick={() => setShowRationale(!showRationale)}
            style={{
              background: 'none', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              padding: '12px 20px', borderRadius: 10, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              width: '100%', justifyContent: 'center',
            }}
          >
            {showRationale ? '▲ Hide' : '▼ View'} Part 04: Design Rationale
          </button>

          {showRationale && <DesignRationale />}
        </div>

      </div>
    </div>
  )
}

/* ─── Part 04: Design Rationale ─── */
function DesignRationale() {
  const points = [
    {
      q: 'Why did you design it this way?',
      a: `Traditional service menus force users to self-diagnose. "Do I need GST? A trademark? A company?" — someone at Idea Stage has no context to answer these questions. We flipped the model: start with their goals in plain language, then let the system do the diagnosis. The conversational, input-first approach removes the cognitive load from the user entirely. They don't choose a service — the platform surfaces the right one automatically.`,
      icon: '🎨',
    },
    {
      q: 'What decisions did you make for the user?',
      a: `We decided to hide everything except the one next action. All business jargon (MCA, ROC, DIN, DSC) is invisible to the user in early screens. We also decided not to show pricing, timelines, or competing options until the user has committed to understanding their one step. The comparison of LLP vs Pvt Ltd is shown only after the user reaches Screen 3 — after emotional buy-in has been established.`,
      icon: '🧠',
    },
    {
      q: 'What did you intentionally leave out?',
      a: `We left out: a navigation menu, a service catalog, pricing pages, testimonials (on Screen 1), success stories, FAQs, and footer links. All of these are noise for a user in "confusion mode." Even the logo is minimal — it should feel like a calm conversation, not a SaaS product page. We also left out multiple CTAs — there is exactly one button per screen, always pointing forward.`,
      icon: '✂️',
    },
    {
      q: 'How does your experience reduce confusion?',
      a: `By enforcing a sequential, single-focus flow: the user can only see what's relevant to them right now. The "Confusion → Clarity → Action" breadcrumb makes them feel in control of a process, not lost in a product. The split screen in Screen 2 is especially deliberate — visually demonstrating that we're filtering noise for them. The user feels understood, not overwhelmed. One step. One call. That's it.`,
      icon: '🔍',
    },
  ]

  return (
    <div className="animate-fade-up" style={{ marginTop: 24 }}>
      <div className="glass-card" style={{ padding: '32px 28px' }}>
        <div className="section-label" style={{ marginBottom: 20 }}>Part 04 — Design Rationale</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {points.map((item, i) => (
            <div key={i} style={{ paddingBottom: i < points.length - 1 ? 24 : 0, borderBottom: i < points.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 8 }}>
                    {i + 1}. {item.q}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main App ─── */
export default function App() {
  const [screen, setScreen] = useState(1) // 1, 2, 3
  const [userInput, setUserInput] = useState('')

  const handleScreen1Next = (text) => {
    setUserInput(text)
    setScreen(2)
    window.scrollTo(0, 0)
  }
  const handleScreen2Next = () => {
    setScreen(3)
    window.scrollTo(0, 0)
  }
  const handleReset = () => {
    setScreen(1)
    setUserInput('')
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="noise-overlay" />

      {/* Step indicator */}
      {screen !== 2 && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, alignItems: 'center',
          background: 'rgba(15,15,17,0.85)',
          backdropFilter: 'blur(20px)',
          padding: '10px 18px', borderRadius: 100,
          border: '1px solid var(--border-subtle)',
          zIndex: 100,
        }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`nav-dot ${screen === s ? 'active' : ''}`}
              onClick={() => screen > s && setScreen(s)}
              style={{ cursor: screen > s ? 'pointer' : 'default' }}
            />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontWeight: 600 }}>
            {screen}/3
          </span>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {screen === 1 && <AntiLandingPage onNext={handleScreen1Next} />}
        {screen === 2 && <ClarityAssessment userInput={userInput} onNext={handleScreen2Next} />}
        {screen === 3 && <ActionPlan onReset={handleReset} />}
      </div>
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { apiFetch } from '../utils/api'

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra & Nagar Haveli',
  'Daman & Diu','Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry'
]

const OCCUPATIONS = [
  { value: 'farmer', label: '👨‍🌾 Farmer / Agricultural Worker' },
  { value: 'laborer', label: '👷 Daily Wage Laborer' },
  { value: 'employed', label: '💼 Salaried Employee' },
  { value: 'self-employed', label: '🏪 Self-Employed / Trader' },
  { value: 'business owner', label: '🏢 Business Owner' },
  { value: 'student', label: '📚 Student' },
  { value: 'unemployed', label: '🔍 Unemployed / Job Seeker' },
  { value: 'artisan', label: '🎨 Artisan / Craftsperson' },
  { value: 'fisherman', label: '🎣 Fisherman' },
  { value: 'weaver', label: '🧵 Weaver / Textile Worker' },
]

const CATEGORIES = [
  { value: 'General', label: 'General', desc: 'Not belonging to SC, ST, or OBC' },
  { value: 'OBC', label: 'OBC', desc: 'Other Backward Class' },
  { value: 'SC', label: 'SC', desc: 'Scheduled Caste' },
  { value: 'ST', label: 'ST', desc: 'Scheduled Tribe' },
]

const STEPS = [
  { id: 1, title: 'Your Age', icon: '🎂', desc: 'How old are you?' },
  { id: 2, title: 'Annual Income', icon: '💰', desc: 'Household annual income' },
  { id: 3, title: 'State', icon: '📍', desc: 'Where do you live?' },
  { id: 4, title: 'Occupation', icon: '👔', desc: 'What do you do?' },
  { id: 5, title: 'Category & Gender', icon: '🪪', desc: 'Social category' },
]

export default function EligibilityForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const [form, setForm] = useState({
    age: '',
    income: '',
    state: '',
    occupation: '',
    category: '',
    gender: 'all',
  })

  // Voice input setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.lang = 'en-IN'
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim()
        setListening(false)
        handleVoiceInput(transcript)
      }
      recognitionRef.current.onerror = () => setListening(false)
      recognitionRef.current.onend = () => setListening(false)
    }
  }, [step])

  function handleVoiceInput(transcript) {
    const lower = transcript.toLowerCase()
    if (step === 1) {
      const num = lower.match(/\d+/)
      if (num) setForm(f => ({ ...f, age: num[0] }))
    } else if (step === 2) {
      const num = lower.replace(/[^0-9]/g, '')
      if (num) setForm(f => ({ ...f, income: num }))
    } else if (step === 3) {
      const match = INDIA_STATES.find(s => lower.includes(s.toLowerCase()))
      if (match) setForm(f => ({ ...f, state: match }))
    }
  }

  function startVoice() {
    if (recognitionRef.current) {
      setListening(true)
      recognitionRef.current.start()
    }
  }

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  function validate() {
    if (step === 1) {
      if (!form.age || parseInt(form.age) < 0 || parseInt(form.age) > 120)
        return 'Please enter a valid age between 0 and 120'
    }
    if (step === 2) {
      if (!form.income || parseInt(form.income) < 0)
        return 'Please enter a valid annual household income'
    }
    if (step === 3 && !form.state) return 'Please select your state'
    if (step === 4 && !form.occupation) return 'Please select your occupation'
    if (step === 5 && !form.category) return 'Please select your category'
    return ''
  }

  function next() {
    const err = validate()
    if (err) { setError(err); return }
    if (step < 5) setStep(s => s + 1)
    else submit()
  }

  function prev() {
    if (step > 1) setStep(s => s - 1)
  }

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/eligible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      navigate('/results', { state: { schemes: data.schemes, profile: form, count: data.count } })
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  const progress = (step / 5) * 100

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
              Check Your <span className="gradient-text">Eligibility</span>
            </h1>
            <p className="text-slate-400">Answer 5 quick questions to find your matching schemes</p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map(s => (
                <motion.div
                  key={s.id}
                  className="flex flex-col items-center gap-1"
                  animate={{ opacity: s.id <= step ? 1 : 0.4 }}
                >
                  <motion.div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      s.id < step ? 'step-done' :
                      s.id === step ? 'step-active' : 'step-pending'
                    }`}
                    animate={s.id === step ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {s.id < step ? '✓' : s.icon}
                  </motion.div>
                  <span className="text-xs text-slate-500 hidden sm:block">{s.title}</span>
                </motion.div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#FF9933,#138808)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-3xl p-8 min-h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{STEPS[step - 1].icon}</span>
                  <div>
                    <p className="text-xs text-[#FF9933] font-semibold uppercase tracking-widest">
                      Step {step} of 5
                    </p>
                    <h2 className="font-display text-xl font-bold text-white">{STEPS[step - 1].title}</h2>
                    <p className="text-slate-400 text-sm">{STEPS[step - 1].desc}</p>
                  </div>
                </div>

                {/* STEP 1 — Age */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="0" max="120"
                        placeholder="Enter your age (e.g. 28)"
                        value={form.age}
                        onChange={e => update('age', e.target.value)}
                        className="input-field text-2xl font-bold text-center h-16"
                        onKeyDown={e => e.key === 'Enter' && next()}
                        autoFocus
                      />
                    </div>
                    <VoiceButton listening={listening} onStart={startVoice} />
                  </div>
                )}

                {/* STEP 2 — Income */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Annual household income"
                        value={form.income}
                        onChange={e => update('income', e.target.value)}
                        className="input-field text-xl font-bold pl-8 h-16"
                        onKeyDown={e => e.key === 'Enter' && next()}
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: '< ₹1L', value: '100000' },
                        { label: '₹1–3L', value: '200000' },
                        { label: '₹3–6L', value: '500000' },
                        { label: '₹6–12L', value: '900000' },
                        { label: '₹12–18L', value: '1500000' },
                        { label: '> ₹18L', value: '2500000' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => update('income', opt.value)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            form.income === opt.value
                              ? 'text-white border-[#FF9933]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          style={form.income === opt.value
                            ? { background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.5)' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <VoiceButton listening={listening} onStart={startVoice} />
                  </div>
                )}

                {/* STEP 3 — State */}
                {step === 3 && (
                  <div>
                    <select
                      value={form.state}
                      onChange={e => update('state', e.target.value)}
                      className="input-field h-14 text-base"
                    >
                      <option value="" className="bg-slate-900">Select your state / UT</option>
                      {INDIA_STATES.map(s => (
                        <option key={s} value={s} className="bg-slate-900">{s}</option>
                      ))}
                    </select>
                    <VoiceButton listening={listening} onStart={startVoice} className="mt-4" />
                  </div>
                )}

                {/* STEP 4 — Occupation */}
                {step === 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OCCUPATIONS.map(occ => (
                      <motion.button
                        key={occ.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => update('occupation', occ.value)}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          form.occupation === occ.value
                            ? 'text-white'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        style={form.occupation === occ.value
                          ? { background: 'rgba(255,153,51,0.2)', border: '1.5px solid rgba(255,153,51,0.6)' }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                      >
                        {occ.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* STEP 5 — Category + Gender */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-slate-400 mb-3">Social Category</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {CATEGORIES.map(cat => (
                          <motion.button
                            key={cat.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => update('category', cat.value)}
                            className="py-4 rounded-xl text-center transition-all duration-200"
                            style={form.category === cat.value
                              ? { background: 'rgba(255,153,51,0.2)', border: '1.5px solid rgba(255,153,51,0.6)' }
                              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
                            }
                          >
                            <div className={`font-bold text-lg ${form.category === cat.value ? 'text-[#FF9933]' : 'text-white'}`}>
                              {cat.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{cat.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-3">Gender (for gender-specific schemes)</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'all', label: '⚧ Any' },
                          { value: 'male', label: '♂ Male' },
                          { value: 'female', label: '♀ Female' },
                        ].map(g => (
                          <motion.button
                            key={g.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => update('gender', g.value)}
                            className="py-3 rounded-xl text-sm font-medium transition-all duration-200"
                            style={form.gender === g.value
                              ? { background: 'rgba(255,153,51,0.2)', border: '1.5px solid rgba(255,153,51,0.6)', color: '#FF9933' }
                              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
                            }
                          >
                            {g.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-red-400 text-sm flex items-center gap-2"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={prev}
              className={`btn-secondary px-6 py-3 ${step === 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              ← Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={next}
              disabled={loading}
              className="btn-primary px-8 py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding schemes...
                </span>
              ) : step === 5 ? (
                '🔍 Find My Schemes'
              ) : (
                'Next →'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function VoiceButton({ listening, onStart, className = '' }) {
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  if (!supported) return null
  return (
    <motion.button
      onClick={onStart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${className}`}
      style={{
        background: listening ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
        border: listening ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
        color: listening ? '#f87171' : '#94a3b8',
      }}
    >
      <span className={listening ? 'voice-pulse' : ''}>🎤</span>
      {listening ? 'Listening...' : 'Speak your answer'}
    </motion.button>
  )
}

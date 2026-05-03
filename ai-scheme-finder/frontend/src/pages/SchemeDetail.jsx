import { useState, useEffect } from 'react'
import { apiFetch } from '../utils/api'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-display font-semibold text-white">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-400 text-sm"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SchemeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/api/schemes/${id}`)
      .then(setScheme)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-2xl px-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-2xl shimmer" />
            ))}
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !scheme) {
    return (
      <PageWrapper>
        <div className="min-h-screen pt-24 flex items-center justify-center text-center px-4">
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="font-display text-2xl text-white mb-4">Scheme Not Found</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const eligText = []
  if (scheme.eligibility.min_age > 0 || scheme.eligibility.max_age < 100)
    eligText.push(`Age: ${scheme.eligibility.min_age}–${scheme.eligibility.max_age} years`)
  if (scheme.eligibility.max_income < 999999990)
    eligText.push(`Income: up to ₹${(scheme.eligibility.max_income / 100000).toFixed(1)}L/year`)
  if (scheme.eligibility.states !== 'all')
    eligText.push(`States: ${Array.isArray(scheme.eligibility.states) ? scheme.eligibility.states.join(', ') : scheme.eligibility.states}`)
  if (scheme.eligibility.occupations !== 'all')
    eligText.push(`Occupation: ${Array.isArray(scheme.eligibility.occupations) ? scheme.eligibility.occupations.join(', ') : scheme.eligibility.occupations}`)
  if (scheme.eligibility.categories !== 'all')
    eligText.push(`Category: ${Array.isArray(scheme.eligibility.categories) ? scheme.eligibility.categories.join(', ') : scheme.eligibility.categories}`)
  if (scheme.eligibility.gender !== 'all')
    eligText.push(`Gender: ${scheme.eligibility.gender}`)

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to Results
          </motion.button>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
              style={{ background: 'radial-gradient(circle,#FF9933,transparent 70%)' }} />
            
            <div className="relative">
              {/* Ministry badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                style={{ background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.25)', color: '#FF9933' }}>
                🏛️ {scheme.ministry}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                {scheme.name}
              </h1>
              <p className="text-slate-300 leading-relaxed mb-6">{scheme.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {scheme.tags.map(tag => (
                  <span key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={{ background: 'rgba(255,153,51,0.1)', border: '1px solid rgba(255,153,51,0.2)', color: '#FB923C' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Apply link */}
              {scheme.link && (
                <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                  >
                    🌐 Apply on Official Portal →
                  </motion.button>
                </a>
              )}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-4">

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <CollapsibleSection title="Benefits & What You Get" icon="🎁" defaultOpen={true}>
                <ul className="space-y-3">
                  {scheme.benefits.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-3 text-slate-300 text-sm"
                    >
                      <span className="text-[#FF9933] mt-0.5 flex-shrink-0">✓</span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </CollapsibleSection>
            </motion.div>

            {/* Eligibility */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <CollapsibleSection title="Who Can Apply" icon="✅" defaultOpen={true}>
                {eligText.length > 0 ? (
                  <ul className="space-y-2">
                    {eligText.map((e, i) => (
                      <li key={i} className="flex gap-3 text-slate-300 text-sm">
                        <span className="text-emerald-400 flex-shrink-0">→</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300 text-sm">Open to all Indian citizens.</p>
                )}
              </CollapsibleSection>
            </motion.div>

            {/* Documents */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <CollapsibleSection title="Required Documents" icon="📄">
                <ul className="space-y-2">
                  {scheme.documents.map((doc, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 text-sm">
                      <span className="text-blue-400 flex-shrink-0">📎</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            </motion.div>

            {/* Steps to apply */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <CollapsibleSection title="How to Apply — Step by Step" icon="🚀">
                <ol className="space-y-4">
                  {scheme.apply_steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#FF9933,#ff6b35)' }}>
                        {i + 1}
                      </div>
                      <p className="text-slate-300 text-sm pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </CollapsibleSection>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button onClick={() => navigate(-1)} className="btn-secondary flex-1">
              ← Back to Results
            </button>
            <Link to="/check" className="flex-1">
              <button className="btn-primary w-full">🔍 Check More Schemes</button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

import { useState, useMemo } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import SchemeCard from '../components/SchemeCard'

const CATEGORY_FILTERS = [
  'All', 'agriculture', 'housing', 'health', 'education', 'business',
  'employment', 'women', 'pension', 'skill', 'insurance', 'food',
]

function buildWhatsAppText(schemes, profile) {
  const top3 = schemes.slice(0, 3).map(s => `• ${s.name}`).join('\n')
  const link = window.location.origin + '/check'
  return encodeURIComponent(
    `🇮🇳 I found ${schemes.length} government schemes I'm eligible for!\n\nTop matches:\n${top3}\n\n👉 Check yours free at: ${link}`
  )
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { schemes = [], profile = {}, count = 0 } = location.state || {}

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  // Redirect if no data
  if (!location.state) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-display text-2xl text-white mb-4">No results yet</h2>
            <p className="text-slate-400 mb-6">Please complete the eligibility form first.</p>
            <Link to="/check">
              <button className="btn-primary">Check Eligibility</button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const filtered = useMemo(() => {
    let result = schemes
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeFilter !== 'All') {
      result = result.filter(s =>
        s.category_tags.includes(activeFilter) || s.tags.includes(activeFilter)
      )
    }
    return result
  }, [schemes, search, activeFilter])

  const profileLabels = {
    age: `${profile.age} yrs`,
    income: `₹${parseInt(profile.income).toLocaleString('en-IN')}/yr`,
    state: profile.state,
    occupation: profile.occupation,
    category: profile.category,
    gender: profile.gender !== 'all' ? profile.gender : null,
  }

  const whatsappUrl = `https://wa.me/?text=${buildWhatsAppText(schemes, profile)}`

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            {count > 0 ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-4"
                  style={{ background: 'rgba(19,136,8,0.15)', border: '1px solid rgba(19,136,8,0.3)', color: '#4ade80' }}
                >
                  🎉 {count} Schemes Found for You!
                </motion.div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                  Your Eligible <span className="gradient-text">Government Schemes</span>
                </h1>
                <p className="text-slate-400">Based on your profile — click any card to expand, or view full details.</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h1 className="font-display text-3xl font-bold text-white mb-2">No Schemes Found</h1>
                <p className="text-slate-400 mb-6">
                  Try adjusting your profile — some schemes have narrow criteria.
                </p>
              </>
            )}
          </motion.div>

          {/* Profile summary chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 justify-center mb-8"
          >
            {Object.entries(profileLabels).map(([k, v]) => v && (
              <span key={k}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}
              >
                {v}
              </span>
            ))}
            <button
              onClick={() => navigate('/check')}
              className="px-3 py-1 rounded-full text-xs font-medium text-[#FF9933] hover:underline"
              style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)' }}
            >
              ✏️ Edit Profile
            </button>
          </motion.div>

          {count > 0 && (
            <>
              {/* Search + Filter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                  <input
                    type="text"
                    placeholder="Search within results..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                {/* WhatsApp share */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap w-full sm:w-auto justify-center"
                    style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Share on WhatsApp
                  </motion.button>
                </a>
              </motion.div>

              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
                {CATEGORY_FILTERS.map(f => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(f)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize"
                    style={activeFilter === f
                      ? { background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.5)', color: '#FF9933' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
                    }
                  >
                    {f}
                  </motion.button>
                ))}
              </div>

              {/* Results count */}
              <div className="text-sm text-slate-400 mb-6">
                Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
                <span className="text-[#FF9933] font-semibold">{count}</span> schemes
                {search && ` matching "${search}"`}
              </div>
            </>
          )}

          {/* Cards Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((scheme, i) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    showEligibilityReason
                    index={i}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔎</div>
                <h3 className="font-display text-xl text-white mb-2">No matching schemes</h3>
                <p className="text-slate-400 mb-6">Try clearing the search or changing the filter.</p>
                <button
                  onClick={() => { setSearch(''); setActiveFilter('All') }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom actions */}
          {count > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/check">
                <button className="btn-secondary w-full sm:w-auto">← Check Again</button>
              </Link>
              <Link to="/schemes">
                <button className="btn-secondary w-full sm:w-auto">Browse All Schemes</button>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="btn-primary w-full" style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
                  📲 Share Results on WhatsApp
                </button>
              </a>
            </motion.div>
          )}

          {/* No results suggestions */}
          {count === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-8 max-w-xl mx-auto text-center mt-8"
            >
              <h3 className="font-display text-lg text-white mb-4">💡 Suggestions</h3>
              <ul className="text-slate-300 text-sm space-y-2 text-left">
                <li>→ Some schemes require BPL status — try a lower income</li>
                <li>→ State-specific schemes exist — make sure your state is correct</li>
                <li>→ Your occupation or category might unlock additional schemes</li>
                <li>→ Browse all schemes to find what might apply</li>
              </ul>
              <div className="flex gap-3 justify-center mt-6">
                <Link to="/check">
                  <button className="btn-primary text-sm">Try Again</button>
                </Link>
                <Link to="/schemes">
                  <button className="btn-secondary text-sm">Browse All</button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

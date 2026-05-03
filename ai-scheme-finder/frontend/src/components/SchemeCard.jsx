import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const categoryEmoji = {
  agriculture: '🌾', farmer: '👨‍🌾', housing: '🏠', rural: '🏡',
  health: '🏥', insurance: '🛡️', education: '📚', scholarship: '🎓',
  business: '💼', loan: '💰', skill: '🔧', employment: '👔',
  women: '👩', 'girl child': '👧', maternity: '🤱', pension: '👴',
  energy: '⚡', solar: '☀️', food: '🌽', water: '💧',
  savings: '💳', investment: '📈', startup: '🚀', digital: '💻',
  tribal: '🌿', minority: '🕌', disability: '♿', sports: '🏆',
  default: '📋'
}

function getCategoryEmoji(tags) {
  for (const tag of tags) {
    if (categoryEmoji[tag]) return categoryEmoji[tag]
  }
  return categoryEmoji.default
}

export default function SchemeCard({ scheme, showEligibilityReason = false, index = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const emoji = getCategoryEmoji(scheme.category_tags)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div
        className="scheme-card group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,153,51,0.2), rgba(255,107,53,0.1))' }}
          >
            {emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-[#FF9933] transition-colors duration-200">
              {scheme.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{scheme.ministry}</p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-400 flex-shrink-0 mt-1"
          >
            ▼
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4">
          {scheme.description}
        </p>

        {/* Eligibility reason */}
        {showEligibilityReason && scheme.eligibility_reason && (
          <div className="mb-4 px-3 py-2 rounded-xl text-xs text-emerald-300 leading-relaxed"
            style={{ background: 'rgba(19,136,8,0.12)', border: '1px solid rgba(19,136,8,0.25)' }}>
            ✅ {scheme.eligibility_reason}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scheme.tags.slice(0, 3).map(tag => (
            <span key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,153,51,0.12)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.2)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Benefits</p>
                  <ul className="space-y-1">
                    {scheme.benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-[#FF9933] flex-shrink-0">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-slate-500">Click to {expanded ? 'collapse' : 'expand'}</span>
          <Link
            to={`/scheme/${scheme.id}`}
            onClick={e => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200"
              style={{ background: 'linear-gradient(135deg,#FF9933,#ff6b35)', color: 'white' }}
            >
              Full Details →
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

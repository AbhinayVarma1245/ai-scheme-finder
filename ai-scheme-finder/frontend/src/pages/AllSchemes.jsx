import { useState, useEffect, useMemo } from 'react'
import { apiFetch } from '../utils/api'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import SchemeCard from '../components/SchemeCard'
import { SkeletonGrid } from '../components/Skeleton'

const CATEGORIES = [
  'All', 'agriculture', 'housing', 'health', 'education', 'business',
  'employment', 'women', 'pension', 'skill', 'insurance', 'food',
  'tribal', 'disability', 'minority', 'sports', 'startup', 'digital',
]

export default function AllSchemes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  useEffect(() => {
    setLoading(true)
    apiFetch('/api/schemes')
      .then(d => setSchemes(d.schemes || []))
      .catch(() => setError('Failed to load schemes. Check your connection.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = schemes
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.ministry.toLowerCase().includes(q)
      )
    }
    if (category !== 'All') {
      result = result.filter(s =>
        s.category_tags.includes(category) || s.tags.includes(category)
      )
    }
    return result
  }, [schemes, search, category])

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < filtered.length

  function changeCategory(cat) {
    setCategory(cat)
    setPage(1)
    if (cat !== 'All') setSearchParams({ category: cat })
    else setSearchParams({})
  }

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
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              All Government <span className="gradient-text">Schemes</span>
            </h1>
            <p className="text-slate-400">
              Browse {schemes.length}+ central and state government schemes
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-xl mx-auto mb-8"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by name, benefit, ministry..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-field pl-11 h-12 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </motion.div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 justify-start">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize"
                style={category === cat
                  ? { background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.5)', color: '#FF9933' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
                }
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-slate-400">
              Showing <span className="text-white font-semibold">{paginated.length}</span> of{' '}
              <span className="text-[#FF9933] font-semibold">{filtered.length}</span> schemes
            </p>
            {(search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); changeCategory('All') }}
                className="text-sm text-slate-400 hover:text-[#FF9933] transition-colors duration-200"
              >
                Clear all filters ✕
              </button>
            )}
          </motion.div>

          {/* Error */}
          {error && (
            <div className="glass rounded-2xl p-8 text-center mb-8">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-red-400 font-semibold mb-2">Backend not connected</p>
              <p className="text-slate-400 text-sm">{error}</p>
              <p className="text-slate-500 text-xs mt-2">
                Run: <code className="bg-white/10 px-2 py-0.5 rounded">cd backend && npm install && npm run dev</code>
              </p>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <SkeletonGrid count={12} />
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔎</div>
              <h3 className="font-display text-xl text-white mb-2">No schemes found</h3>
              <p className="text-slate-400 mb-6">Try different search terms or clear filters</p>
              <button
                onClick={() => { setSearch(''); changeCategory('All') }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((scheme, i) => (
                  <SchemeCard key={scheme.id} scheme={scheme} index={i % PER_PAGE} />
                ))}
              </div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPage(p => p + 1)}
                    className="btn-secondary px-8 py-3"
                  >
                    Load More Schemes ({filtered.length - paginated.length} remaining)
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

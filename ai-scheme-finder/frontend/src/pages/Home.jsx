import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { apiFetch } from '../utils/api'

const features = [
  {
    icon: '🎯',
    title: 'Personalised Matching',
    desc: 'Tell us about yourself and we match you to schemes you actually qualify for — not just a generic list.',
  },
  {
    icon: '🤖',
    title: 'AI Eligibility Engine',
    desc: 'Rule-based AI analyses your age, income, state, occupation, and category to surface the right schemes.',
  },
  {
    icon: '📋',
    title: '100+ Schemes Database',
    desc: 'Central and state government schemes across health, housing, farming, education, business and more.',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    desc: 'No waiting. Get your personalised scheme list in under 3 seconds, with step-by-step apply guidance.',
  },
  {
    icon: '🔒',
    title: 'No Data Stored',
    desc: 'Your personal details are never stored or shared. Everything stays in your browser session.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    desc: 'Works perfectly on any device — phone, tablet or desktop. Share results with family on WhatsApp.',
  },
]

const categories = [
  { label: 'Agriculture', icon: '🌾', color: '#22c55e' },
  { label: 'Housing', icon: '🏠', color: '#3b82f6' },
  { label: 'Health', icon: '🏥', color: '#ef4444' },
  { label: 'Education', icon: '📚', color: '#a855f7' },
  { label: 'Business', icon: '💼', color: '#f59e0b' },
  { label: 'Women', icon: '👩', color: '#ec4899' },
  { label: 'Pension', icon: '👴', color: '#06b6d4' },
  { label: 'Skill', icon: '🔧', color: '#84cc16' },
]

const stats = [
  { value: '100+', label: 'Government Schemes' },
  { value: '28+', label: 'States Covered' },
  { value: '8', label: 'Eligibility Factors' },
  { value: '0', label: 'Cost to Use' },
]

// Floating orbs background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { x: '10%', y: '20%', size: 400, color: 'rgba(255,153,51,0.07)', delay: 0 },
        { x: '80%', y: '60%', size: 350, color: 'rgba(19,136,8,0.06)', delay: 2 },
        { x: '50%', y: '80%', size: 300, color: 'rgba(0,0,128,0.08)', delay: 4 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [totalSchemes, setTotalSchemes] = useState(100)

  useEffect(() => {
    apiFetch('/api/health')
      .then(d => setTotalSchemes(d.totalSchemes || 100))
      .catch(() => {})
  }, [])

  return (
    <PageWrapper>
      {/* ─── Hero ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <FloatingOrbs />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.25)', color: '#FF9933' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
            {totalSchemes}+ Government Schemes • Free to Use
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Find Government
            <br />
            <span className="gradient-text">Schemes You Deserve</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Answer 5 simple questions. Our AI instantly finds every central & state government
            scheme you are eligible for — with step-by-step guidance to apply.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/check">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-lg px-10 py-4"
              >
                🔍 Check My Eligibility
              </motion.button>
            </Link>
            <Link to="/schemes">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary text-lg px-8 py-4"
              >
                Browse All Schemes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="font-display text-3xl font-bold gradient-text-orange">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Schemes Across Every Category
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From farming subsidies to startup loans — if the government offers it, we have it.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Link to={`/schemes?category=${cat.label.toLowerCase()}`}>
                  <div className="glass rounded-2xl p-6 text-center cursor-pointer hover:border-white/20 transition-all duration-300 group">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                    <div className="font-semibold text-white text-sm">{cat.label}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Use <span className="gradient-text">Sarkari Sahayak?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 group cursor-default"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Enter Your Profile', desc: 'Share your age, income, state, occupation, and category in a quick 5-step form.', icon: '📝' },
              { step: '02', title: 'AI Analyses Eligibility', desc: 'Our rule engine checks your profile against 100+ schemes in milliseconds.', icon: '🧠' },
              { step: '03', title: 'See Matching Schemes', desc: 'Review personalised results with eligibility reasons and benefits listed clearly.', icon: '📋' },
              { step: '04', title: 'Apply with Guidance', desc: 'Open any scheme for full details — required documents and step-by-step apply instructions.', icon: '🚀' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 flex gap-5 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'linear-gradient(135deg,rgba(255,153,51,0.2),rgba(255,107,53,0.1))' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FF9933] mb-1">STEP {item.step}</div>
                  <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'linear-gradient(135deg,rgba(255,153,51,0.3),rgba(19,136,8,0.2))' }} />
            <div className="relative">
              <div className="text-5xl mb-4">🇮🇳</div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Don't Leave Benefits Unclaimed
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Crores of Indians miss out on schemes they are entitled to. Check yours in under 2 minutes — completely free.
              </p>
              <Link to="/check">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-lg px-12 py-4"
                >
                  Check My Eligibility Now →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        <p>Sarkari Sahayak — A free public service tool. Not affiliated with the Government of India.</p>
        <p className="mt-1">Data sourced from official government portals. Always verify on official sites before applying.</p>
      </footer>
    </PageWrapper>
  )
}

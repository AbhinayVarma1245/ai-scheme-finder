import { motion } from 'framer-motion'

export function SchemeCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-5 rounded-lg shimmer w-3/4" />
          <div className="h-4 rounded-lg shimmer w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded shimmer" />
        <div className="h-3 rounded shimmer w-5/6" />
        <div className="h-3 rounded shimmer w-4/6" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-6 w-16 rounded-full shimmer" />
        ))}
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <SchemeCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

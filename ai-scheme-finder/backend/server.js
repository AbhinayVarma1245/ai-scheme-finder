import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In production set ALLOWED_ORIGIN env var to your frontend URL, e.g.:
//   ALLOWED_ORIGIN=https://your-app.netlify.app
// In development it allows all origins automatically.
const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(cors({
  origin: allowedOrigin
    ? (origin, cb) => {
        // Allow requests with no origin (curl, Render health checks) or the set frontend
        if (!origin || origin === allowedOrigin) cb(null, true);
        else cb(new Error(`CORS: ${origin} not allowed`));
      }
    : true,          // dev: allow everything
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Load schemes data
const schemesData = JSON.parse(
  readFileSync(join(__dirname, 'data', 'schemes.json'), 'utf-8')
);

// ─── Rule-based AI Explanation Engine ────────────────────────────────────────
function generateEligibilityExplanation(scheme, profile) {
  const reasons = [];
  const { age, income, state, occupation, category, gender } = profile;

  // Age reason
  const { min_age, max_age } = scheme.eligibility;
  if (min_age <= age && age <= max_age) {
    if (min_age === 0 && max_age >= 100) {
      reasons.push('open to all age groups');
    } else if (max_age >= 100) {
      reasons.push(`available for those aged ${min_age}+ years`);
    } else {
      reasons.push(`your age (${age}) falls within the eligible range of ${min_age}–${max_age} years`);
    }
  }

  // Income reason
  const incomeNum = parseInt(income);
  if (incomeNum <= scheme.eligibility.max_income) {
    if (scheme.eligibility.max_income >= 999999990) {
      reasons.push('no income restriction applies');
    } else {
      const limit = (scheme.eligibility.max_income / 100000).toFixed(1);
      reasons.push(`your annual income (₹${(incomeNum / 100000).toFixed(1)}L) is within the ₹${limit}L limit`);
    }
  }

  // State reason
  if (scheme.eligibility.states === 'all') {
    reasons.push('available across all Indian states');
  } else if (Array.isArray(scheme.eligibility.states) && scheme.eligibility.states.includes(state)) {
    reasons.push(`specifically designed for residents of ${state}`);
  }

  // Occupation reason
  if (scheme.eligibility.occupations === 'all') {
    reasons.push('applicable to all occupations');
  } else if (Array.isArray(scheme.eligibility.occupations) && scheme.eligibility.occupations.includes(occupation)) {
    const occMap = {
      farmer: 'farmers and agricultural workers',
      student: 'students pursuing education',
      employed: 'salaried employees',
      'self-employed': 'self-employed individuals',
      'business owner': 'business owners and entrepreneurs',
      laborer: 'daily wage laborers',
      artisan: 'skilled artisans and craftspeople',
      fisherman: 'fishing community members',
      unemployed: 'job seekers',
      weaver: 'weavers and textile workers',
    };
    reasons.push(`targeted at ${occMap[occupation] || occupation}`);
  }

  // Category reason
  if (scheme.eligibility.categories === 'all') {
    // no extra note
  } else if (Array.isArray(scheme.eligibility.categories) && scheme.eligibility.categories.includes(category)) {
    const catMap = {
      SC: 'Scheduled Caste (SC) beneficiaries',
      ST: 'Scheduled Tribe (ST) beneficiaries',
      OBC: 'Other Backward Class (OBC) citizens',
      General: 'general category citizens',
    };
    reasons.push(`exclusively benefits ${catMap[category] || category}`);
  }

  // Gender reason
  if (scheme.eligibility.gender === 'female' && gender === 'female') {
    reasons.push("designed specifically for women's empowerment");
  }

  if (reasons.length === 0) {
    return 'You meet all the eligibility criteria for this scheme.';
  }

  const mainReasons = reasons.slice(0, 3);
  return `You qualify because this scheme is ${mainReasons.join(', and ')}.`;
}

// ─── Eligibility Filter ───────────────────────────────────────────────────────
function isEligible(scheme, profile) {
  const { age, income, state, occupation, category, gender } = profile;
  const el = scheme.eligibility;
  const incomeNum = parseInt(income) || 0;
  const ageNum = parseInt(age) || 0;

  // Age check
  if (ageNum < el.min_age || ageNum > el.max_age) return false;

  // Income check
  if (incomeNum > el.max_income) return false;

  // State check
  if (el.states !== 'all') {
    if (!Array.isArray(el.states) || !el.states.includes(state)) return false;
  }

  // Occupation check
  if (el.occupations !== 'all') {
    if (!Array.isArray(el.occupations) || !el.occupations.includes(occupation)) return false;
  }

  // Category check
  if (el.categories !== 'all') {
    if (!Array.isArray(el.categories) || !el.categories.includes(category)) return false;
  }

  // Gender check
  if (el.gender !== 'all') {
    if (el.gender !== gender) return false;
  }

  return true;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET all schemes (with optional search)
app.get('/api/schemes', (req, res) => {
  const { search, category } = req.query;
  let results = [...schemesData];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (category) {
    results = results.filter(s =>
      s.category_tags.includes(category) || s.tags.includes(category)
    );
  }

  res.json({ count: results.length, schemes: results });
});

// GET single scheme
app.get('/api/schemes/:id', (req, res) => {
  const scheme = schemesData.find(s => s.id === req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
});

// POST find eligible schemes
app.post('/api/eligible', (req, res) => {
  const profile = req.body;
  const { age, income, state, occupation, category, gender } = profile;

  if (!age || !income || !state || !occupation || !category) {
    return res.status(400).json({ error: 'Missing required profile fields' });
  }

  const eligibleSchemes = schemesData
    .filter(scheme => isEligible(scheme, profile))
    .map(scheme => ({
      ...scheme,
      eligibility_reason: generateEligibilityExplanation(scheme, profile),
    }));

  // Sort: state-specific first, then by number of matching tags
  eligibleSchemes.sort((a, b) => {
    const aState = a.eligibility.states !== 'all' ? 1 : 0;
    const bState = b.eligibility.states !== 'all' ? 1 : 0;
    return bState - aState;
  });

  res.json({
    count: eligibleSchemes.length,
    profile,
    schemes: eligibleSchemes,
  });
});

// GET scheme categories
app.get('/api/categories', (req, res) => {
  const allTags = new Set();
  schemesData.forEach(s => s.category_tags.forEach(t => allTags.add(t)));
  res.json([...allTags].sort());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', totalSchemes: schemesData.length });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Scheme Finder API running on http://localhost:${PORT}`);
  console.log(`📦 Loaded ${schemesData.length} government schemes\n`);
});

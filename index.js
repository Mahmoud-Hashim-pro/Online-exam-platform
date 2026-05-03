const path    = require('path');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── EJS setup ────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files (CSS / images / JS لو في) ───────────────
// app.use(express.static(path.join(__dirname, 'public')));

// ── Shared data بيتبعت لكل الصفحات ──────────────────────
const sharedRenderData = {
	pageTitle: "Quizer",
	logoName:  "Quizer"
};

// ═══════════════════════════════════════════════════════════
// AUTH MIDDLEWARE — بيحمي الصفحات من غير login
// ═══════════════════════════════════════════════════════════
function requireAuth(req, res, next) {
	// بيتحقق من الـ token في الـ Authorization header
	const token = req.headers['authorization']?.split(' ')[1]
		|| req.cookies?.token;

	if (!token) {
		// لو مفيش token يروح على صفحة الـ login
		return res.redirect('/log');
	}
	next();
}

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// ── Register — الصفحة الأولى اللي بتظهر ─────────────────
app.get('/', (req, res) => {
	res.render('register.ejs', sharedRenderData);
});

// ── Home (sign-in.ejs) — الصفحة الرئيسية بالكروت الـ 6 ──
app.get('/home', requireAuth, (req, res) => {
	res.render('sign-in.ejs', sharedRenderData);
});

// ── Login ─────────────────────────────────────────────────
app.get('/log', (req, res) => {
	res.render('log-in.ejs', sharedRenderData);
});

// ── /login → redirect to /log (profile.ejs uses /login) ──
app.get('/login', (req, res) => {
	res.redirect('/log');
});

// ── Register ──────────────────────────────────────────────
app.get('/reg', (req, res) => {
	res.render('register.ejs', sharedRenderData);
});

// ── Register POST — بيستقبل الـ form ────────────────────
app.post('/reg', (req, res) => {
	const { username, firstname, lastname, password, confirm_password } = req.body;
	// TODO: save to database
	res.redirect('/home');
});

// ── About ─────────────────────────────────────────────────
app.get('/about', (req, res) => {
	res.render('about.ejs', sharedRenderData);
});

// ── History ───────────────────────────────────────────────
app.get('/history', requireAuth, (req, res) => {
	res.render('history.ejs', sharedRenderData);
});

// ── Search ────────────────────────────────────────────────
app.get('/search', requireAuth, (req, res) => {
	res.render('search.ejs', sharedRenderData);
});

// ── Profile ───────────────────────────────────────────────
app.get('/profile', requireAuth, (req, res) => {
	res.render('profile.ejs', sharedRenderData);
});

// ── Create Quiz ───────────────────────────────────────────
app.get('/create', requireAuth, (req, res) => {
	res.render('create_quiz.ejs', sharedRenderData);
});

// ── Quiz Page ─────────────────────────────────────────────
app.get('/quiz/:id', (req, res) => {
	res.render('quiz.ejs', {
		...sharedRenderData,
		quizId: req.params.id
	});
});

// ── Sign Out ──────────────────────────────────────────────
app.get('/signout', (req, res) => {
	// لما تضيف sessions: req.session.destroy()
	res.redirect('/');
});

// ── System / Admin ────────────────────────────────────────
app.get('/sys', (req, res) => {
	res.render('system.ejs', sharedRenderData);
});

// ── API: Admin Stats (للـ system.ejs) ────────────────────
app.get('/api/admin/stats', (req, res) => {
	// TODO: جيب البيانات الحقيقية من الـ database
	res.json({
		stats: {
			users:          0,
			usersChange:    '—',
			quizzes:        0,
			quizzesChange:  '—',
			sessions:       0,
			sessionsChange: '—',
			active:         0,
			activeChange:   '—',
		},
		activity: [],
		quizzes:  [],
		users:    []
	});
});

// ── API: Search (للـ search.ejs) ──────────────────────────
app.get('/api/search', (req, res) => {
	const q = (req.query.q || '').toLowerCase();
	// TODO: بحث حقيقي في الـ database
	res.json([]);
});

// ── API: Profile (للـ profile.ejs) ────────────────────────
app.get('/api/me', (req, res) => {
	// TODO: رجّع بيانات المستخدم الحالي
	res.status(401).json({ error: 'Not authenticated' });
});

app.get('/api/me/stats', (req, res) => {
	res.json({ played: 0, created: 0, avgScore: null });
});

app.get('/api/me/quizzes', (req, res) => {
	res.json([]);
});

app.get('/api/me/history', (req, res) => {
	res.json([]);
});

app.patch('/api/me', (req, res) => {
	// TODO: تحديث بيانات المستخدم في الـ database
	res.json({ success: true });
});

app.post('/api/auth/signout', (req, res) => {
	res.json({ success: true });
});

// ── 404 — لازم تبقى آخر route ────────────────────────────
// Source: https://stackoverflow.com/a/79554232 — Donggi Kim, CC BY-SA 4.0
app.all('/{*any}', (req, res) => {
	res.status(404).render('404.ejs', {
		...sharedRenderData,
		page: req.path
	});
});

// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`\n✅ Quizer running → http://localhost:${PORT}\n`);
	console.log('  /          → Home (sign-in.ejs)');
	console.log('  /log       → Login');
	console.log('  /reg       → Register');
	console.log('  /about     → About');
	console.log('  /history   → History');
	console.log('  /search    → Search');
	console.log('  /profile   → Profile');
	console.log('  /create    → Create Quiz');
	console.log('  /quiz/:id  → Quiz Page');
	console.log('  /signout   → Sign Out');
	console.log('  /sys       → Admin System\n');
});

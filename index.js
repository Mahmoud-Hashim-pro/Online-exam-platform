const path = require('path');
const express = require('express');

const app = express();

const sharedRenderData = {
	pageTitle: "My Awesome Website",
	logoName: "Quizer"
}

app.set('view engine', 'ejs');
// app.use('/', express.static(path.join(__dirname, "/public")))

app.get('/', (req, res) => {
	res.render('sign-in.ejs', sharedRenderData)
})

app.get('/log', (req, res) => {
	res.render('log-in.ejs', sharedRenderData)
})

app.get('/reg', (req, res) => {
	res.render('register.ejs', sharedRenderData)
})

app.get('/about', (req, res) => {
	res.render('about.ejs', sharedRenderData)
})

// Handle Unknown URLs.
// Source - https://stackoverflow.com/a/79554232
// Posted by Donggi Kim, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-30, License - CC BY-SA 4.0
app.all('/{*any}', (req, res, next) => {
	res.status(404).render('404.ejs', {
		sharedRenderData,
		page: req.path
	})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
	console.log(`http://localhost:${PORT}`);
});

const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, "/public")))

app.get('/', (req, res) => {
	res.render('index.ejs', {
		pageTitle: "My Awesome Website",
		logoName: "Quizer"
	})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
	console.log(`http://localhost:${PORT}`);
});

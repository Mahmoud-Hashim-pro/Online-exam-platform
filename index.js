import express from 'express'
const app = express();

app.get("/", (req, res) => {
	res.send("Hello server!");
})

const PORT = process.env.PORT || 3000

app.listen(PORT, (req, res) => {
	console.log(`http://localhost:${PORT}`);
})

import express from "express"
const app = express();

app.get("/", (req, res) => {
	res.send("You've hit the server!");
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
})

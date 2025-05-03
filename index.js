const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

// Middleware to parse JSON
app.use(express.json());

// Default route
app.get("/", (req, res) => {
	res.send("Welcome to the Todo List API!");
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

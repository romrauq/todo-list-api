const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

// Middleware to parse JSON
app.use(express.json());

// Dummy data
let todos = [
	{ id: 1, title: "Learn Node.js", completed: false },
	{ id: 2, title: "Build a todo API", completed: false },
];

// Default route
app.get("/", (req, res) => {
	res.send("Welcome to the Todo List API!");
});

// GET all todos
app.get("/todos", (req, res) => {
	res.json(todos);
});

// GET a single todo by ID
app.get("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const todo = todos.find((t) => t.id === id);
	if (todo) {
		res.json(todo);
	} else {
		res.status(404).json({ message: "Todo not found" });
	}
});

// POST a new todo
app.post("/todos", (req, res) => {
	const { title, completed } = req.body;
	const newTodo = {
		id: todos.length + 1,
		title,
		completed: completed || false,
	};
	todos.push(newTodo);
	res.status(201).json(newTodo);
});

// PUT (update) a todo by ID
app.put("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = todos.findIndex((t) => t.id === id);
	if (index !== -1) {
		const updatedTodo = { ...todos[index], ...req.body };
		todos[index] = updatedTodo;
		res.json(updatedTodo);
	} else {
		res.status(404).json({ message: "Todo not found" });
	}
});

// DELETE a todo by ID
app.delete("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = todos.findIndex((t) => t.id === id);
	if (index !== -1) {
		const deletedTodo = todos.splice(index, 1);
		res.json(deletedTodo[0]);
	} else {
		res.status(404).json({ message: "Todo not found" });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

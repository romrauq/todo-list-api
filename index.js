const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const mongoose = require("mongoose");
require("dotenv").config();
const Todo = require("./models/Todo");

// Middleware to parse JSON
app.use(express.json());

// Default route
app.get("/", (req, res) => {
	res.send("Welcome to the Todo List API!");
});

// GET all todos
app.get("/todos", async (req, res) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// GET a single todo by ID
app.get("/todos/:id", async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);
		if (!todo) return res.status(404).json({ message: "Todo not found" });
		res.json(todo);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// POST a new todo
app.post("/todos", async (req, res) => {
	const { title, completed } = req.body;

	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}

	const newTodo = new Todo({
		title,
		completed: completed || false,
	});

	try {
		const savedTodo = await newTodo.save();
		res.status(201).json(savedTodo);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// PUT (update) a todo by ID
app.put("/todos/:id", async (req, res) => {
	try {
		const updatedTodo = await Todo.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true, runValidators: true }
		);

		if (!updatedTodo) {
			return res.status(404).json({ message: "Todo not found" });
		}

		res.json(updatedTodo);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// DELETE a todo by ID
app.delete("/todos/:id", async (req, res) => {
	try {
		const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

		if (!deletedTodo) {
			return res.status(404).json({ message: "Todo not found" });
		}

		res.json({ message: "Todo deleted", todo: deletedTodo });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Connecting application to MongoDB database:
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

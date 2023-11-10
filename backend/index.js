const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 80;
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://viking:Xxs6D5T7fQ62UHQh@cluster0.imxywwd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));
// Define a task schema and model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Create a new task
app.get("/", (req, res) => {
  res.send("hello to server!");
});
app.post("/api/tasks", async (req, res) => {
  const { title, description, date } = req.body;
  const newTask = new Task({
    title,
    description,
    date,
    completed: false,
  });

  try {
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    return res.json(tasks);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Mark task as completed

app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server running at port ${port}`);
});

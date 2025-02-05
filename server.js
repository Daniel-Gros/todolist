require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connecté"))
    .catch((err) => console.log("Erreur de connexion à MongoDB :", err));

const Task = mongoose.model("Task", new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }
}));

app.post("/tasks", async (req, res) => {
    const task = new Task({ text: req.body.text });
    await task.save();
    res.status(201).json(task);
});


app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});


app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
);
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

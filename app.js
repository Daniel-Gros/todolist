const API_URL = "http://localhost:5000/tasks";

const getTasks = async () => {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.toggle("completed", task.completed);
        li.innerHTML = `
    ${task.text}
    <button onclick="toggleTaskStatus('${task._id}', ${task.completed})">✔</button>
    <button onclick="deleteTask('${task._id}')">❌</button>
    `;
        taskList.appendChild(li);
    });
};

const addTask = async () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();
    if (!text) return;
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    taskInput.value = "";
    getTasks();
};

const toggleTaskStatus = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });
    getTasks();
};

const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getTasks();
};

document.getElementById("addTaskButton").addEventListener("click", addTask);

document.getElementById("taskInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
getTasks();

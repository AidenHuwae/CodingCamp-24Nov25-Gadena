const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterOption = document.getElementById("filter-todo");
const deleteAllBtn = document.getElementById("delete-all-btn");
const errorMessage = document.getElementById("error-message");

document.addEventListener("DOMContentLoaded", loadData);

addBtn.addEventListener("click", addTask);
todoList.addEventListener("click", deleteCheck); 
filterOption.addEventListener("change", filterTodo);
deleteAllBtn.addEventListener("click", deleteAll);

// Functions

// meng-ADD TASK (Dari Input User)
function addTask(event) {
    event.preventDefault();

    const taskValue = taskInput.value;
    const dateValue = dateInput.value;

    if (taskValue === "") {
        errorMessage.innerText = "Masukan nama tugas!";
        return;
    }
    errorMessage.innerText = ""; 

    createTodoElement(taskValue, dateValue, false);

    // menyimpan data ke local storage
    saveData();

    taskInput.value = "";
    dateInput.value = "";
}

// (addTask & loadData)
function createTodoElement(task, date, isCompleted) {
    // Membuat baris baru
    const newRow = document.createElement("tr");
    newRow.classList.add("todo-item"); 

    // Jika statusnya completed
    if (isCompleted) {
        newRow.classList.add("completed");
        newRow.style.opacity = "0.5";
    }

    newRow.innerHTML = `
        <td>${task}</td>
        <td>${date || "No Date"}</td>
        <td class="status-text">${isCompleted ? "Completed" : "Pending"}</td>
        <td>
            <button class="check-btn" style="background:green; color:white;">✓</button>
            <button class="delete-btn" style="background:red; color:white;">X</button>
        </td>
    `;

    todoList.appendChild(newRow);
}

// untuk hapus dann cekliss
function deleteCheck(e) {
    const item = e.target;
    const todo = item.parentElement.parentElement;
    
    // DELETE TODO
    if (item.classList.contains("delete-btn")) {
        todo.remove();
        saveData(); // Update storage setelah hapus
    }

    // COMPLETE TODO
    if (item.classList.contains("check-btn")) {
        const statusText = todo.querySelector(".status-text");

        todo.classList.toggle("completed");

        if (todo.classList.contains("completed")) {
            statusText.innerText = "Completed";
            todo.style.opacity = "0.5"; 
        } else {
            statusText.innerText = "Pending";
            todo.style.opacity = "1";
        }
        
        saveData(); // Update storage setelah status berubah
    }
}

// FILTER TASKS
function filterTodo(e) {
    const todos = todoList.children; 
    
    Array.from(todos).forEach(function(todo) {
        const action = e.target.value; 
        
        switch(action) {
            case "all":
                todo.style.display = "table-row";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "table-row";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "table-row";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

//DELETE ALL
function deleteAll() {
    todoList.innerHTML = "";
    localStorage.removeItem("todos"); // Hapus juga dari memori browser
}

// function agar datanya tersimpan di local storage

// 7. Simpan Data (Save)
function saveData() {
    const todos = [];

    const rows = todoList.querySelectorAll(".todo-item");

    rows.forEach(row => {
        const taskName = row.children[0].innerText;
        const taskDate = row.children[1].innerText;
        const isCompleted = row.classList.contains("completed");

        //array
        todos.push({
            task: taskName,
            date: taskDate,
            completed: isCompleted
        });
    });

    // Simpan array ke Local Storage dalam bentuk text JSON
    localStorage.setItem("todos", JSON.stringify(todos));
}

// 8. Ambil Data (Load)
function loadData() {
    const savedTodos = localStorage.getItem("todos");
    
    // Jika ada data tersimpan
    if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        
        // Loop datanya dan buat elemen HTML baru lagi
        todos.forEach(todo => {
            createTodoElement(todo.task, todo.date, todo.completed);
        });
    }
}
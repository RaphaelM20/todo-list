import { projects, createProject, addTodo, deleteTodo, updateTodoComplete, activeProject } from "./logic.js";

export function initializeUI() {
    const app = document.getElementById("app");

    const inbox = document.createElement("div");
    inbox.classList.add("sidebar-item");
    inbox.textContent = "Inbox";

    const today = document.createElement("div");
    today.classList.add("sidebar-item");
    today.textContent = "Today";

    const thisWeek = document.createElement("div");
    thisWeek.classList.add("sidebar-item");
    thisWeek.textContent = "This Week";

    const sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    sidebar.append(inbox, today, thisWeek);

    // WHERE PROJECTS WILL DISPLAY
    const projectList = document.createElement("div");
    projectList.id = "project-list";
    sidebar.append(projectList);

    // WHERE FORMS WILL GO
    const mainContainer = document.createElement("div");
    mainContainer.id = "main-container";

    // WHERE TODOS WILL DISPLAY
    const todosContainer  = document.createElement("div");
    todosContainer.id = "todos-container";

    app.append(sidebar, mainContainer, todosContainer);

    setupEventListeners();
    renderProjects();
    renderTodos();
}

function showProjectForm() {
    const projectForm = document.createElement("form");
    projectForm.classList.add("project-form");

    const label = document.createElement("label");
    label.textContent = "Project Name:";
    label.htmlFor = "project-name";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "project-name";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Create Project";

    projectForm.append(label, input, submit);
    projectForm.addEventListener("submit", handleProjectSubmit);

    document.getElementById("main-container").append(projectForm);
}

function showTodoForm() {
    const form = document.createElement("form");
    form.classList.add("todo-form");

    form.innerHTML = `
        <label>Todo Name:</label>
        <input id="todo-title" type="text">

        <label>Description:</label>
        <input id="todo-desc" type="text">

        <label>Due Date:</label>
        <input id="todo-date" type="date">

        <label>Priority:</label>
        <select id="todo-priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>

        <button type="submit">Create Task</button>
    `;

    form.addEventListener("submit", handleTodoSubmit);

    document.getElementById("main-container").append(form);
}

function setupEventListeners() {
    document.getElementById("add-project-btn").addEventListener("click", showProjectForm);

    document.getElementById("add-todo-btn").addEventListener("click", showTodoForm);
}

function handleProjectSubmit(event){
    event.preventDefault();
    const projName = document.getElementById("project-name").value;

    const newProject = createProject(projName);
    projects.push(newProject);

    renderProjects();
    event.target.remove();
}

export function renderProjects() {
    const list = document.getElementById("project-list");
    list.innerHTML = "";

    projects.forEach(project => {
        const item = document.createElement("div");
        item.textContent = project.name;

        item.addEventListener("click", () => {
            activeProject = project; 
            renderTodos();
        });

        list.append(item);
    });
}

function renderTodos() {
    const todosContainer = document.getElementById("todos-container");
    todosContainer.innerHTML = "";

    if (!activeProject) return;

    activeProject.todos.forEach(todo => {
        const item = document.createElement("div");
        item.textContent = todo.title;

        const del = document.createElement("button");
        del.textContent = "Delete";

        del.addEventListener("click", () => {
            deleteTodo(activeProject, todo);
            renderTodos();
        });

        item.append(del);
        todosContainer.append(item);
    });
}

function handleTodoSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById("todo-title").value;
    const desc = document.getElementById("todo-desc").value;
    const date = document.getElementById("todo-date").value;
    const priority = document.getElementById("todo-priority").value;

    const newTodo = addTodo(title, desc, date, priority);
    activeProject.todos.push(newTodo);

    renderTodos();
    event.target.remove();
}

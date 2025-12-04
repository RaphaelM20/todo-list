import { 
    projects,
    deleteTodo,
    setActiveProject,
    activeProject,
    addProject,
    addTodoToActiveProject,
    saveProjectsToStorage, 
    deleteProject
} from "./logic.js";

export function initializeUI() {
    const app = document.getElementById("app");

    const inbox = document.createElement("div");
    inbox.classList.add("sidebar-item");
    inbox.id = "inbox";
    inbox.textContent = "Inbox";

    const today = document.createElement("div");
    today.classList.add("sidebar-item");
    today.id = "today";
    today.textContent = "Today";

    const thisWeek = document.createElement("div");
    thisWeek.classList.add("sidebar-item");
    thisWeek.id = "week";
    thisWeek.textContent = "This Week";

    const projectHeader = document.createElement("h3");
    projectHeader.textContent = "Projects";
    projectHeader.classList.add("sidebar-header");

    const projectList = document.createElement("div");
    projectList.id = "project-list";

    const sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    sidebar.append(inbox, today, thisWeek, projectHeader, projectList);

    const content  = document.createElement("div");
    content.id = "todos-container";

    app.append(sidebar, content);

    sidebarFunction();
    renderProjects();
    renderInboxPage();
}

function sidebarFunction() {
    document.getElementById("inbox").addEventListener("click", () => {
        setActiveProject(projects[0]);
        renderInboxPage();
    });

    document.getElementById("today").addEventListener("click", () => {
        renderTodayPage();
    });

    document.getElementById("week").addEventListener("click", () => {
        renderWeekPage();
    })
}

function renderInboxPage() {
    const container = document.getElementById("todos-container");
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Inbox";

    const addBtn = document.createElement("div");
    addBtn.textContent = "+ Add Task";
    addBtn.classList.add("add-task-btn");

    addBtn.addEventListener("click", () => {
        showTodoForm();
    });

    const todolist = document.createElement("div");
    todolist.id = "todo-list";

    container.append(title, addBtn, todolist);

    renderTodos();
}

function renderTodayPage() {
    const container = document.getElementById("todos-container");
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Today";

    const todolist = document.createElement("div");
    todolist.id = "todo-list";

    projects.forEach(project => {
        project.todos.forEach(todo => {
            if (isToday(todo)) {

                const item = document.createElement("div");
                item.classList.add("todo-item");

                // CHECK BUTTON
                const checkBtn = document.createElement("button");
                checkBtn.classList.add("check-todo-btn");
                checkBtn.textContent = "✓";
                checkBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteTodo(project, todo);
                    renderTodayPage();
                });

                // LEFT SIDE: title + (project name)
                const left = document.createElement("div");
                left.classList.add("todo-left");
                left.textContent = `${todo.title} (${project.name})`;

                // RIGHT SIDE: date + priority
                const right = document.createElement("div");
                right.classList.add("todo-right");

                const dateEl = document.createElement("div");
                dateEl.classList.add("todo-date");
                dateEl.textContent = todo.dueDate;

                const priorityEl = document.createElement("div");
                priorityEl.classList.add("todo-priority");
                priorityEl.textContent = todo.priority;

                if (todo.priority === "low") priorityEl.classList.add("priority-low");
                if (todo.priority === "medium") priorityEl.classList.add("priority-medium");
                if (todo.priority === "high") priorityEl.classList.add("priority-high");

                right.append(dateEl, priorityEl);

                // DELETE BUTTON
                const delBtn = document.createElement("button");
                delBtn.classList.add("delete-todo-btn");
                delBtn.textContent = "Delete";
                delBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteTodo(project, todo);
                    renderTodayPage();
                });

                // CLICK TO EDIT
                item.addEventListener("click", () => {
                    showEditTodoForm(todo, project);
                });

                item.append(checkBtn, left, right, delBtn);
                todolist.append(item);
            }
        });
    });

    container.append(title, todolist);
}

function isToday(todo) {
    if (!todo.dueDate) return false;

    const today = new Date();
    const due = new Date(todo.dueDate);

    // normalize both to midnight
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return today.getTime() === due.getTime();
}

function renderWeekPage() {
    const container = document.getElementById("todos-container");
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "This Week";

    const todolist = document.createElement("div");
    todolist.id = "todo-list";

    projects.forEach(project => {
        project.todos.forEach(todo => {
            if (isThisWeek(todo)) {

                const item = document.createElement("div");
                item.classList.add("todo-item");

                const checkBtn = document.createElement("button");
                checkBtn.classList.add("check-todo-btn");
                checkBtn.textContent = "✓";
                checkBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteTodo(project, todo);
                    renderWeekPage();
                });

                const left = document.createElement("div");
                left.classList.add("todo-left");
                left.textContent = `${todo.title} (${project.name})`;

                const right = document.createElement("div");
                right.classList.add("todo-right");

                const dateEl = document.createElement("div");
                dateEl.classList.add("todo-date");
                dateEl.textContent = todo.dueDate;

                const priorityEl = document.createElement("div");
                priorityEl.classList.add("todo-priority");
                priorityEl.textContent = todo.priority;

                if (todo.priority === "low") priorityEl.classList.add("priority-low");
                if (todo.priority === "medium") priorityEl.classList.add("priority-medium");
                if (todo.priority === "high") priorityEl.classList.add("priority-high");

                right.append(dateEl, priorityEl);

                const delBtn = document.createElement("button");
                delBtn.classList.add("delete-todo-btn");
                delBtn.textContent = "Delete";
                delBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteTodo(project, todo);
                    renderWeekPage();
                });

                item.addEventListener("click", () => {
                    showEditTodoForm(todo, project);
                });

                item.append(checkBtn, left, right, delBtn);
                todolist.append(item);
            }
        });
    });

    container.append(title, todolist);
}

function isThisWeek(todo) {
    if (!todo.dueDate) return false;

    const today = new Date();
    const due = new Date(todo.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const week = new Date(today);
    week.setDate(today.getDate() + 7);

    return due >= today && due <= week;
}

export function renderProjects() {
    const list = document.getElementById("project-list");
    list.innerHTML = "";

    projects.forEach(project => {
        if (project.name === "Inbox") return;

        const item = document.createElement("div");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = project.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.classList.add("delete-project-btn");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // don't trigger project click
            deleteProject(project);
            renderProjects();
            renderInboxPage(); // show Inbox after deletion
        });

        item.addEventListener("click", () => {
            renderProjectPage(project);
        });

        item.append(nameSpan, deleteBtn);
        list.append(item);
    });

    const addProject = document.createElement("div");
    addProject.textContent = "+ Add Project";
    addProject.id = "add-project-btn";
    addProject.classList.add("sidebar-header");

    addProject.addEventListener("click", () => {
        showProjectForm();
    });

    list.append(addProject);
}

function renderProjectPage(project) {
    setActiveProject(project);

    const container = document.getElementById("todos-container");
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = project.name;

    const addBtn = document.createElement("div");
    addBtn.textContent = "+ Add Task";
    addBtn.classList.add("add-task-btn");

    addBtn.addEventListener("click", () => {
        showTodoForm();
    })

    const todolist = document.createElement("div");
    todolist.id = "todo-list";

    container.append(title, addBtn, todolist);

    renderTodos();
}

function renderTodos() {
    const todoslist = document.getElementById("todo-list");
    if (!todoslist) return;

    todoslist.innerHTML = "";
    if (!activeProject) return;

    activeProject.todos.forEach(todo => {
        const item = document.createElement("div");
        item.classList.add("todo-item");

        // CLICK ANYWHERE ON ITEM → EDIT FORM
        item.addEventListener("click", () => {
            showEditTodoForm(todo, activeProject);
        });

        const checkBtn = document.createElement("button");
        checkBtn.classList.add("check-todo-btn");
        checkBtn.textContent = "✓";

        checkBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            deleteTodo(activeProject, todo);
            renderTodos();
        });

        const left = document.createElement("div");
        left.classList.add("todo-left");
        left.textContent = todo.title;

        const right = document.createElement("div");
        right.classList.add("todo-right");

        const dateEl = document.createElement("div");
        dateEl.classList.add("todo-date");
        dateEl.textContent = todo.dueDate;

        const priorityEl = document.createElement("div");
        priorityEl.classList.add("todo-priority");
        priorityEl.textContent = todo.priority;

        if (todo.priority === "low") priorityEl.classList.add("priority-low");
        if (todo.priority === "medium") priorityEl.classList.add("priority-medium");
        if (todo.priority === "high") priorityEl.classList.add("priority-high");

        right.append(dateEl, priorityEl);

        const del = document.createElement("button");
        del.classList.add("delete-todo-btn");
        del.textContent = "Delete";

        del.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTodo(activeProject, todo);
            renderTodos();
        });

        item.append(checkBtn, left, right, del);
        todoslist.append(item);
    });
}

function showModal(content) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modalBox = document.createElement("div");
    modalBox.classList.add("modal");

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("modal-close");
    closeBtn.textContent = "×";
    closeBtn.onclick = () => overlay.remove();

    modalBox.appendChild(closeBtn);
    modalBox.appendChild(content);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);
    
    return overlay;
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
    input.required = true;

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Create Project";

    projectForm.append(label, input, submit);

    const overlay = showModal(projectForm);

    projectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const projName = document.getElementById("project-name").value;

        if (!projName.trim()) return;

        addProject(projName);
        renderProjects();

        overlay.remove();
    });
}

function showTodoForm() {
    const form = document.createElement("form");
    form.classList.add("todo-form");

    form.innerHTML = `
        <label>Todo Name:</label>
        <input id="todo-title" type="text" required>

        <label>Description:</label>
        <input id="todo-desc" type="text" required>

        <label>Due Date:</label>
        <input id="todo-date" type="date" required>

        <label>Priority:</label>
        <select id="todo-priority" required>
            <option value="" disabled selected>Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>

        <button type="submit">Create Task</button>
    `;

    const overlay = showModal(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("todo-title").value;
        const desc = document.getElementById("todo-desc").value;
        const date = document.getElementById("todo-date").value;
        const priority = document.getElementById("todo-priority").value;

        if (!title.trim()) return;

        addTodoToActiveProject(title, desc, date, priority);
        renderTodos();

        overlay.remove();
    });
}

function showEditTodoForm(todo) {
    const form = document.createElement("form");
    form.classList.add("todo-form");

    form.innerHTML = `
        <label>Todo Name:</label>
        <input id="edit-todo-title" type="text" required>

        <label>Description:</label>
        <input id="edit-todo-desc" type="text" required>

        <label>Due Date:</label>
        <input id="edit-todo-date" type="date" required>

        <label>Priority:</label>
        <select id="edit-todo-priority" required>
            <option value="" disabled>Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>

        <button type="submit">Update Task</button>
    `;

    const titleInput = form.querySelector("#edit-todo-title");
    const descInput = form.querySelector("#edit-todo-desc");
    const dateInput = form.querySelector("#edit-todo-date");
    const prioritySelect = form.querySelector("#edit-todo-priority");

    titleInput.value = todo.title || "";
    descInput.value = todo.description || "";
    dateInput.value = todo.dueDate || "";
    prioritySelect.value = todo.priority || "";

    const overlay = showModal(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const newTitle = titleInput.value;
        const newDesc = descInput.value;
        const newDate = dateInput.value;
        const newPriority = prioritySelect.value;

        if (!newTitle.trim()) return;

        todo.title = newTitle;
        todo.description = newDesc;
        todo.dueDate = newDate;
        todo.priority = newPriority;

        saveProjectsToStorage();
        renderTodos();  
        overlay.remove();
    });
}

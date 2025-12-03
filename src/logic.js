const STORAGE_KEY = "todo-projects";

export let projects = [];
export let activeProject;

function loadProjectsFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return null;

        
        data.forEach(project => {
            if (!Array.isArray(project.todos)) {
                project.todos = [];
            }
        });

        return data;
    } catch (e) {
        console.error("Error parsing projects from localStorage", e);
        return null;
    }
}

export function saveProjectsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
        console.error("Error saving projects to localStorage", e);
    }
}

export function createProject(name) {
    return {
        name,
        todos: []
    };
}

export function addProject(name) {
    const proj = createProject(name);
    projects.push(proj);
    saveProjectsToStorage();
    return proj;
}

export function setActiveProject(project) {
    activeProject = project;
}

export function addTodo(title, description, dueDate, priority) {
    return {
        title,
        description,
        dueDate,
        priority,
        completed: false,
    };
}

export function addTodoToActiveProject(title, description, dueDate, priority) {
    const todo = addTodo(title, description, dueDate, priority);
    activeProject.todos.push(todo);
    saveProjectsToStorage();
    return todo;
}

export function deleteTodo(project, todoToDelete) {
    project.todos = project.todos.filter(todoItem => todoItem !== todoToDelete);
    saveProjectsToStorage();
}

export function deleteProject(projectToDelete) {
    const index = projects.indexOf(projectToDelete);
    if (index !== -1) {
        projects.splice(index, 1);
    }

    if (activeProject === projectToDelete) {
        activeProject = projects[0] || null;
    }

     if (projects.length === 0) {
        const inbox = createProject("Inbox");
        projects.push(inbox);
        activeProject = inbox;
    }

    saveProjectsToStorage();
}

export function updateTodoComplete(todo) {
    todo.completed = !todo.completed;
    saveProjectsToStorage();
}

export function updateTodoPriority(todo, newPriority) {
    todo.priority = newPriority;
    saveProjectsToStorage();
}


(function init() {
    const stored = loadProjectsFromStorage();

    if (stored && stored.length > 0) {
        projects = stored;
    } else {
        const inbox = createProject("Inbox");
        projects = [inbox];
    }

    activeProject = projects[0];
})();

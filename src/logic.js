//store all projects
export let projects = [];

//create inbox
const inbox = createProject("Inbox");
projects.push(inbox);
export let activeProject = inbox;

//create project
export function createProject(name){
    return {
        name,
        todos: []
    };
}

//create todo item

export function addTodo(title, description, dueDate, priority) {
    return {
        title, 
        description, 
        dueDate, 
        priority, 
        completed: false,
    };
}

//delete todo

export function deleteTodo(project, todoToDelete) {
    project.todos = project.todos.filter(function(todoItem) {
        return todoItem != todoToDelete;
    })
}

//update completed

export function updateTodoComplete(todo) {
    todo.completed = !todo.completed;
}

//update priority

export function updateTodoPriority(todo, newPriority) {
    todo.priority = newPriority;
}


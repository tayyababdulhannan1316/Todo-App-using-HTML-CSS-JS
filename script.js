// Select DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');
const pendingCount = document.getElementById('pending-count');

// State Management
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize
function init() {
    renderTodos();
    updatePendingCount();
}

// Save to LocalStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updatePendingCount();
}

// Update Pending Tasks Count
function updatePendingCount() {
    const pending = todos.filter(todo => !todo.completed).length;
    pendingCount.textContent = `You have ${pending} pending task${pending !== 1 ? 's' : ''}`;
}

// Add New Todo
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle Complete Status
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Edit Todo (Inline)
function editTodo(id, spanElement) {
    const currentText = spanElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    // Replace span with input
    spanElement.parentNode.replaceChild(input, spanElement);
    input.focus();

    // Save on blur or enter
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText) {
            todos = todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, text: newText };
                }
                return todo;
            });
            saveTodos();
            renderTodos();
        } else {
            // Revert if empty
            renderTodos();
        }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit();
    });
}

// Clear All Todos
function clearAll() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Render Todos
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleComplete(todo.id));

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        textSpan.addEventListener('dblclick', () => {
            if (!todo.completed) editTodo(todo.id, textSpan);
        });

        // Actions Container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', () => {
            if (!todo.completed) editTodo(todo.id, textSpan);
        });

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        delBtn.title = 'Delete';
        delBtn.addEventListener('click', () => deleteTodo(todo.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);

        // Container for content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';
        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(textSpan);

        li.appendChild(contentDiv);
        li.appendChild(actionsDiv);
        
        todoList.appendChild(li);
    });
}

// Event Listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

clearBtn.addEventListener('click', clearAll);

// Start App
init();
// 任务数据存储
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 初始化页面
function init() {
    renderTodos();
}

// 渲染任务列表
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})">
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${index})">删除</button>
        `;
        
        todoList.appendChild(li);
    });
    
    // 保存到本地存储
    saveTodos();
}

// 切换任务完成状态
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

// 删除任务
function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

// 添加新任务
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    console.log('添加任务:', text);
    if (text) {
        todos.push({ text, completed: false });
        console.log('任务列表:', todos);
        todoInput.value = '';
        renderTodos();
    }
});

// 保存任务到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 初始化应用
init();
// 任务数据存储
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
        return '今天';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return '昨天';
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
        return `${year}年${month}月${day}日 ${weekDay}`;
    }
}

// 获取日期键（用于分组）
function getDateKey(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 按日期分组任务
function groupTodosByDate() {
    const groups = {};
    
    todos.forEach((todo, index) => {
        const dateKey = getDateKey(todo.createdAt);
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: todo.createdAt,
                items: []
            };
        }
        groups[dateKey].items.push({ ...todo, index });
    });
    
    // 按日期排序（最新的在前）
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    
    return sortedKeys.map(key => ({
        dateKey: key,
        ...groups[key]
    }));
}

// 渲染任务列表
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">暂无待办事项，添加一个吧！</li>';
        return;
    }
    
    const groupedTodos = groupTodosByDate();
    
    groupedTodos.forEach(group => {
        // 创建日期分组标题
        const dateHeader = document.createElement('li');
        dateHeader.className = 'date-header';
        dateHeader.innerHTML = `<span class="date-title">${formatDate(group.date)}</span><span class="date-count">${group.items.length} 项</span>`;
        todoList.appendChild(dateHeader);
        
        // 渲染该日期下的所有任务
        group.items.forEach(todo => {
            const li = document.createElement('li');
            if (todo.completed) {
                li.classList.add('completed');
            }
            
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.index})">
                <span class="task-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.index})">删除</button>
            `;
            
            todoList.appendChild(li);
        });
    });
    
    saveTodos();
}

// HTML 转义（防止 XSS）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    if (text) {
        todos.push({ 
            text, 
            completed: false, 
            createdAt: new Date().toISOString() 
        });
        todoInput.value = '';
        renderTodos();
    }
});

// 保存任务到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 初始化应用
renderTodos();

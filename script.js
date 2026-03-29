// 任务数据存储
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const dateFilter = document.getElementById('date-filter');
const hideCompleted = document.getElementById('hide-completed');

// 当前筛选状态
let currentSearch = '';
let currentDateFilter = 'all';
let hideCompletedTasks = false;

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

// 获取筛选后的任务
function getFilteredTodos() {
    return todos.filter(todo => {
        if (hideCompletedTasks && todo.completed) {
            return false;
        }
        
        if (currentSearch) {
            const searchText = currentSearch.toLowerCase();
            if (!todo.text.toLowerCase().includes(searchText)) {
                return false;
            }
        }
        
        if (currentDateFilter !== 'all') {
            const todoDateKey = getDateKey(todo.createdAt);
            if (todoDateKey !== currentDateFilter) {
                return false;
            }
        }
        
        return true;
    });
}

// 更新日期筛选下拉框
function updateDateFilterOptions() {
    const dateKeys = [...new Set(todos.map(todo => getDateKey(todo.createdAt)))];
    dateKeys.sort((a, b) => new Date(b) - new Date(a));
    
    const currentValue = dateFilter.value;
    dateFilter.innerHTML = '<option value="all">所有日期</option>';
    
    dateKeys.forEach(dateKey => {
        const option = document.createElement('option');
        option.value = dateKey;
        const date = new Date(dateKey);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        option.textContent = `${year}年${month}月${day}日`;
        dateFilter.appendChild(option);
    });
    
    if (dateKeys.includes(currentValue)) {
        dateFilter.value = currentValue;
    }
}

// 渲染任务列表
function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        if (todos.length === 0) {
            todoList.innerHTML = '<li class="empty-message">暂无待办事项，添加一个吧！</li>';
        } else {
            todoList.innerHTML = '<li class="no-results">没有找到匹配的任务</li>';
        }
        return;
    }
    
    const groupedTodos = groupTodosByDate(filteredTodos);
    
    groupedTodos.forEach(group => {
        const dateHeader = document.createElement('li');
        dateHeader.className = 'date-header';
        dateHeader.innerHTML = `<span class="date-title">${formatDate(group.date)}</span><span class="date-count">${group.items.length} 项</span>`;
        todoList.appendChild(dateHeader);
        
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

// 按日期分组任务（接受筛选后的任务列表）
function groupTodosByDate(filteredTodos) {
    const groups = {};
    
    filteredTodos.forEach((todo) => {
        const dateKey = getDateKey(todo.createdAt);
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: todo.createdAt,
                items: []
            };
        }
        groups[dateKey].items.push({ ...todo });
    });
    
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    
    return sortedKeys.map(key => ({
        dateKey: key,
        ...groups[key]
    }));
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
        updateDateFilterOptions();
        renderTodos();
    }
});

// 搜索事件
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderTodos();
});

// 日期筛选事件
dateFilter.addEventListener('change', (e) => {
    currentDateFilter = e.target.value;
    renderTodos();
});

// 隐藏已完成事件
hideCompleted.addEventListener('change', (e) => {
    hideCompletedTasks = e.target.checked;
    renderTodos();
});

// 保存任务到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTodos = JSON.parse(e.target.result);
            if (Array.isArray(importedTodos)) {
                if (confirm(`即将导入 ${importedTodos.length} 条任务，是否继续？\n（现有任务将被保留）`)) {
                    // 为导入的任务添加创建时间（如果没有的话）
                    importedTodos.forEach(todo => {
                        if (!todo.createdAt) {
                            todo.createdAt = new Date().toISOString();
                        }
                    });
                    todos = [...todos, ...importedTodos];
                    saveTodos();
                    updateDateFilterOptions();
                    renderTodos();
                    alert('导入成功！');
                }
            } else {
                alert('文件格式不正确！');
            }
        } catch (error) {
            alert('导入失败：文件格式错误');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// 初始化应用
updateDateFilterOptions();
renderTodos();

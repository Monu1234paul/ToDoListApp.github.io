class TodoList {
    constructor() {
        const storedTasks = localStorage.getItem('tasks');
        console.log('Stored tasks from localStorage:', storedTasks);
        
        this.tasks = JSON.parse(storedTasks) || [];
        console.log('Parsed tasks:', this.tasks);
        
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTask');
        this.taskList = document.getElementById('taskList');
        this.filterSelect = document.getElementById('filterTasks');
        
        this.initializeEventListeners();
        this.renderTasks();
    }

    initializeEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.filterSelect.addEventListener('change', () => this.renderTasks());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
            console.log('New task added:', task);
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        console.log('Saving tasks to localStorage:', this.tasks);
    }

    renderTasks() {
        const filter = this.filterSelect.value;
        let filteredTasks = this.tasks;

        if (filter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = this.tasks.filter(task => !task.completed);
        }

        this.taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            this.taskList.appendChild(li);
        });
    }
}

// Initialize the app
const todoList = new TodoList(); 
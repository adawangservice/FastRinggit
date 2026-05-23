/* ============================================
   FASTRINGGIT TO-DO LIST - JAVASCRIPT
   LOCAL STORAGE FUNCTIONALITY
   ============================================ */

// To-Do List App Class
class TodoApp {
    constructor() {
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.inputError = document.getElementById('inputError');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.activeCount = document.getElementById('activeCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // State
        this.tasks = [];
        this.currentFilter = 'all';

        // Initialize
        this.init();
    }

    // Initialize App
    init() {
        this.loadTasks();
        this.attachEventListeners();
        this.render();
    }

    // Attach Event Listeners
    attachEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Clear buttons
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        this.clearAll.addEventListener('click', () => this.clearAllTasks());

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Input focus
        this.taskInput.addEventListener('focus', () => {
            this.clearInputError();
        });
    }

    // Add New Task
    addTask() {
        const text = this.taskInput.value.trim();

        // Validation
        if (!text) {
            this.showInputError('Sila masukkan tugasan!');
            return;
        }

        if (text.length > 200) {
            this.showInputError('Tugasan terlalu panjang (max 200 aksara)');
            return;
        }

        // Create task object
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('ms-MY')
        };

        // Add to array
        this.tasks.unshift(task);

        // Save & Render
        this.saveTasks();
        this.render();
        this.taskInput.value = '';
        this.clearInputError();

        // Show success feedback
        this.showSuccessMessage();
    }

    // Delete Task
    deleteTask(id) {
        if (confirm('Adakah anda pasti nak padam tugasan ini?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    // Toggle Task Completion
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    // Edit Task
    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.showEditModal(task);
        }
    }

    // Show Edit Modal
    showEditModal(task) {
        // Create modal if not exists
        let modal = document.getElementById('editModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'editModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Sunting Tugasan</h2>
                    </div>
                    <input type="text" id="editInput" class="modal-input" maxlength="200">
                    <div class="modal-buttons">
                        <button class="modal-btn modal-btn-save">Simpan</button>
                        <button class="modal-btn modal-btn-cancel">Batal</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const editInput = document.getElementById('editInput');
        const saveBtn = modal.querySelector('.modal-btn-save');
        const cancelBtn = modal.querySelector('.modal-btn-cancel');

        // Set current text
        editInput.value = task.text;

        // Show modal
        modal.classList.add('active');
        editInput.focus();

        // Save handler
        const saveHandler = () => {
            const newText = editInput.value.trim();
            if (newText && newText !== task.text) {
                task.text = newText;
                this.saveTasks();
                this.render();
            }
            modal.classList.remove('active');
            saveBtn.removeEventListener('click', saveHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
        };

        // Cancel handler
        const cancelHandler = () => {
            modal.classList.remove('active');
            saveBtn.removeEventListener('click', saveHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
        };

        saveBtn.addEventListener('click', saveHandler);
        cancelBtn.addEventListener('click', cancelHandler);

        // Close on Enter
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveHandler();
        });

        // Close on Escape
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') cancelHandler();
        });
    }

    // Clear Completed Tasks
    clearCompletedTasks() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            alert('Tiada tugasan yang siap untuk dipadamkan.');
            return;
        }

        if (confirm(`Padam ${completedCount} tugasan yang siap?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    // Clear All Tasks
    clearAllTasks() {
        if (this.tasks.length === 0) {
            alert('Tiada tugasan untuk dipadamkan.');
            return;
        }

        if (confirm('Padam SEMUA tugasan? Tindakan ini tidak boleh dibatalkan!')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    // Set Filter
    setFilter(filter) {
        this.currentFilter = filter;

        // Update button states
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    // Get Filtered Tasks
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // Update Stats
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
        this.activeCount.textContent = active;

        // Update progress
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        this.progressFill.style.width = percentage + '%';
        this.progressText.textContent = percentage + '% Siap';
    }

    // Render Task List
    renderTaskList() {
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <p>📝 ${this.currentFilter === 'completed' ? 'Tiada tugasan yang siap.' : 
                           this.currentFilter === 'active' ? 'Tiada tugasan yang belum siap.' : 
                           'Tiada tugasan. Mulai dengan menambah satu!'}</p>
                </div>
            `;
            return;
        }

        this.taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="app.toggleTask(${task.id})"
                >
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="task-btn task-btn-edit" onclick="app.editTask(${task.id})">✏️ Sunting</button>
                    <button class="task-btn task-btn-delete" onclick="app.deleteTask(${task.id})">🗑️ Padam</button>
                </div>
            </div>
        `).join('');
    }

    // Main Render Function
    render() {
        this.updateStats();
        this.renderTaskList();
    }

    // Save Tasks to LocalStorage
    saveTasks() {
        localStorage.setItem('fastringgit_tasks', JSON.stringify(this.tasks));
    }

    // Load Tasks from LocalStorage
    loadTasks() {
        const saved = localStorage.getItem('fastringgit_tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
    }

    // Show Input Error
    showInputError(message) {
        this.inputError.textContent = message;
        this.taskInput.style.borderColor = '#e74c3c';
    }

    // Clear Input Error
    clearInputError() {
        this.inputError.textContent = '';
        this.taskInput.style.borderColor = '#e0e0e0';
    }

    // Show Success Message
    showSuccessMessage() {
        const originalColor = this.taskInput.style.borderColor;
        this.taskInput.style.borderColor = '#27ae60';
        
        setTimeout(() => {
            this.taskInput.style.borderColor = originalColor;
        }, 500);
    }

    // Escape HTML (prevent XSS)
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize App when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});

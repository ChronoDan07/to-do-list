import './style.css';
import './fonts/css/fontawesome.css';
import './fonts/css/solid.css';
import './fonts/webfonts/fa-solid-900.ttf';
import './fonts/webfonts/fa-solid-900.woff2';

class ProjectManager {
    constructor() {
      this.projects = this.loadProjects();;
    }
    
    addProject(project) {
      this.projects.push(project);
    }
   
    findProjectById(id) {
      return this.projects.find((project) => project.id === id);
    }

    getTodaysTasks() {
      const today = new Date();
      const localDate = today.toLocaleDateString('en-CA');
      const tasksDueToday = [];
      
      this.projects.forEach(project => {
        const tasks = project.tasks.filter(task => task.dueDate === localDate);
        tasksDueToday.push(...tasks);
      });
    
      return tasksDueToday;
    }

    searchTasks(searchInput) {
      const searchResults = [];
      this.projects.forEach(project => {
          project.tasks.forEach(task => {
              if (task.title.toLowerCase().includes(searchInput.toLowerCase()) || 
                  task.description.toLowerCase().includes(searchInput.toLowerCase())) {
                  searchResults.push(task);
              }
          });
      });
      return searchResults;
    }

    saveProjects() {
      const projectsData = this.projects.map(project => ({
          id: project.id,
          title: project.title,
          color: project.color,
          tasks: project.tasks.map(task => ({
              id: task.id,
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              completed: task.completed
          }))
      }));
      localStorage.setItem('projects', JSON.stringify(projectsData));
    }

    loadProjects() {
      const projectsData = JSON.parse(localStorage.getItem('projects')) || [];
      return projectsData.map(projectData => {
          const project = new Project(projectData.title, projectData.color);
          project.id = projectData.id;
          projectData.tasks.forEach(taskData => {
              const task = new Task(
                  taskData.title,
                  taskData.description,
                  taskData.dueDate,
                  taskData.priority
              );
              task.id = taskData.id; 
              task.completed = taskData.completed; 
              project.addTask(task);
          });
          return project;
      });
    }
   
    findTaskById(taskId) {
      for (const project of this.projects) {
        const task = project.tasks.find((task) => task.id === taskId);
        if (task) return task;
      }
      return null;
    }
   
    removeProject(project) {
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index > -1) {
        this.projects.splice(index, 1);
      }
    }

    saveTaskEdit(updatedTask) {
      for (const project of this.projects) {
        const taskIndex = project.tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = updatedTask;
          return true; 
        }
      }
      this.manager.saveProjects();
      return false; 
    }

  }

  class Project {
    constructor(title, color = Project.generateColor()) {
      this.id = Project.generateId(); 
      this.title = title;
      this.color = color;
      this.tasks = []; 
    }
    
    addTask(task) {
      this.tasks.push(task);
    }
    
    removeTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    }
    
  
    listTasks() {
      return this.tasks.map((task) =>`${task.name} - Due: ${task.date} - Priority: ${task.priority} - ${task.completed ? "Completed" : "Pending"}`).join("\n");
    }
  
    static generateId() {
      return `proj-${Math.random().toString(36).slice(2, 9)}`;
    }

    static generateColor() {
      return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
    }
  }
  
  class Task {
    constructor(title, description, dueDate, priority) {
      this.id = Task.generateId();
      this.title = title;
      this.description = description
      this.dueDate = new Date(dueDate).toISOString().split("T")[0];
      this.priority = priority;
      this.completed = false;
    }
  
    completeTask() {
      this.completed = true;
    }

  
    static generateId() {
      return `task-${Math.random().toString(36).slice(2, 9)}`;
    }
  
    toString() {
      return `${this.title} - Description: ${this.description} - Due: ${this.dueDate} - Priority: ${this.priority} - ${this.completed ? "Completed" : "Pending"}`;
    }
  }
  class UIManager {
    constructor(manager) {
      this.manager = manager;
      this.sidebar = document.querySelector('.sidebar');
      this.projectList = document.getElementById('project-list');
      this.currentProject = null;
      this.mainContent = document.querySelector('.content');
      this.addButton = document.getElementById('add-button');
      this.homeButton = document.getElementById('home');
      this.searchButton = document.getElementById('search');
      this.todayButton = document.getElementById('today');
      this.activeButton = null;
  
      this.initEventListeners();

      this.manager.projects.forEach(project => {
        const projectDOM = this.createProjectDOM(project);
        this.projectList.appendChild(projectDOM);
    });
      this.renderHomePage(); 
      this.selectHomeButton();
    }
  
    initEventListeners() {
      
      this.addButton.addEventListener('click', () => this.addProjectUI());
      
      this.sidebar.addEventListener('click', (e) => this.handleSidebarClick(e));

      this.homeButton.addEventListener('click', () => this.renderHomePage());

      this.searchButton.addEventListener('click', () => this.renderSearch());

      this.todayButton.addEventListener('click', () => this.renderToday());
    }

    
    renderHomePage() {
      this.mainContent.innerHTML = `
          <header>
            <h1>Welcome to Your Todo List!</h1>
            <p>Take charge of your productivity. Create, manage, and conquer your projects with ease.</p>
          </header>

          <section class="intro">
              <h2>How It Works</h2>
              <p>
                  This application empowers you to streamline your tasks effortlessly. Organize your workload into
                  projects, track important deadlines, set priorities, and achieve your goals—all in one place.
              </p>
          </section>

          <section class="features">
              <h2>Features</h2>
              <ul>
                  <li><strong>Organize</strong> tasks into multiple projects for clarity and focus</li>
                  <li><strong>Set due dates and priorities</strong> to stay on top of deadlines</li>
                  <li><strong>Mark</strong> tasks as completed and celebrate your wins</li>
                  <li>
                      <strong>Edit project names:</strong> Keep your projects up to date with meaningful names.
                      Simply double-click or use the edit icon to rename a project.
                  </li>
                  <li>
                      <strong>Delete projects:</strong> Declutter your workspace by removing projects you no longer
                      need with just a click.
                  </li>
                  <li>
                      <strong>Dynamic color-coded projects:</strong> Each project gets a unique color for easy
                      visual distinction.
                  </li>
                  <li>
                      <strong>Search tasks:</strong> Quickly find what you're looking for using the search tab.
                  </li>
              </ul>
          </section>

          <section class="getting-started">
              <h2>Getting Started</h2>
              <p>
                  Ready to take control of your tasks? Here's how:
              </p>
              <ol>
                  <li>Click <strong>"Add a Project"</strong> from the sidebar to create a new project.</li>
                  <li>
                      Double-click a project name or use the edit icon to rename it and make it your own.
                  </li>
                  <li>Manage tasks within your project—add, edit, and complete them as needed.</li>
                  <li>Remove old projects easily using the delete icon.</li>
              </ol>
              
              <h3 class="end">Start your journey to ultimate productivity today!</h3>
          </section>
      `;
      
    };

    renderSearch() {
      this.mainContent.innerHTML = `
      <section class="search-section" id="search-tab">
          <header>
              <h1>Search Tasks</h1>
              <input type="text" id="search-bar" placeholder="Search for tasks...">
          </header>
          <section class="search-results">
              <h2>Results:</h2>
              <ul id="search-results-list"></ul>
          </section>
      </section>`;
  
      const searchBar = document.getElementById("search-bar");
      const searchResultsList = document.getElementById("search-results-list");
  
      searchBar.addEventListener("input", () => {
          const query = searchBar.value.trim();
          const results = this.manager.searchTasks(query);
          searchResultsList.innerHTML = "";
  
          if (query.length === 0) {
              return;
          }
  
          if (results.length > 0) {
              results.forEach(task => {
                  const taskItem = document.createElement("li");
                  taskItem.classList.add("task", task.priority.toLowerCase());
                  taskItem.dataset.id = task.id;
  
                  taskItem.innerHTML = `
                      <div class="task-items">
                          <div class="task-head">                        
                              <input id="${task.id}" type="checkbox" class="check-color" ${task.completed ? 'checked' : ''}>
                              <div class="task-title">${task.title}</div>
                          </div>
                          <div class="task-description">
                              ${task.description}
                          </div>
                          <span class="time">
                              <i class="fa-solid fa-arrow-rotate-right"></i> ${task.dueDate} <i class="fa-solid fa-clock"></i>
                          </span>
                      </div>
                      <div class="task-options"></div>
                  `;
  
                  const checkbox = taskItem.querySelector(`#${task.id}`);
                  checkbox.addEventListener('change', (e) => {
                      task.completed = e.target.checked;
                      this.manager.saveTaskEdit(task);
                      this.manager.saveProjects()
                  });
  
                  searchResultsList.appendChild(taskItem);
              });
          } else {
              searchResultsList.innerHTML = "<li>No tasks found.</li>";
          }
      });
    }
  

    
    renderToday() {
      const todaysTasks = this.manager.getTodaysTasks();
    
      this.mainContent.innerHTML = `
        <header>
          <h1>Today's Tasks</h1>
          <p>Stay focused! Here are your tasks due today.</p>
        </header>
    
        <section class="tasks-today">
          <h2>Tasks</h2>
          ${todaysTasks.map(task =>`
            <div class="task ${task.priority.toLowerCase()}" data-id="${task.id}">
              <div class="task-items">
                  <div class="task-head">                        
                    <input id="${task.id}" type="checkbox" class="check-color" ${task.completed ? 'checked' : ''}>
                    <div class="task-title">${task.title}</div>
                  </div>
                  <div class="task-description">
                  ${task.description}
                  </div>
                  <span class="time">
                    <i class="fa-solid fa-arrow-rotate-right"></i> ${task.dueDate} <i class="fa-solid fa-clock"></i>
                  </span>
              </div>
              <div class="task-options">
              </div>
            </div>
            `).join('')}
        </section>
      `;
    
      document.querySelectorAll('.task input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const taskId = e.target.id;
          const task = this.manager.findTaskById(taskId);
          
          if (task) {
            if (e.target.checked && !task.completed) {
              task.completeTask();
            } else if (!e.target.checked && task.completed) {
              task.completed = false;
            }
          }
          this.manager.saveProjects();
        });
      });
    };
    

    renderProjectView(project) {
      this.currentProject = project;
      this.mainContent.innerHTML = `
            <header>
                <h1>${project.title}</h1>
            </header>
            <section class="task-list">
                <h2>Tasks</h2>
                ${project.tasks.map(task =>`
                <div class="task ${task.priority.toLowerCase()}" data-id="${task.id}">
                  <div class="task-items">
                      <div class="task-head">                        
                        <input id="${task.id}" type="checkbox" class="check-color">
                        <div class="task-title">${task.title}</div>
                      </div>
                      <div class="task-description">
                      ${task.description}
                      </div>
                      <span class="time">
                        <i class="fa-solid fa-arrow-rotate-right"></i> ${task.dueDate} <i class="fa-solid fa-clock"></i>
                      </span>
                  </div>
                  <div class="task-options">
                    <i class="fa-solid fa-pen-to-square open-edit-modal"></i>
                    <i class="fa-solid fa-trash"></i>
                  </div>
                </div>
                  `).join('')} 

                <div id="open-modal" class="add-task">
                  <div>
                    <i class="fa-solid fa-plus"></i> Add a Task
                  </div>
                </div>
            </section>
               
              <div id="task-modal" class="modal hidden">
                <div class="modal-content">
                  <form id="task-form">
                    <input type="text" id="task-title" placeholder="Task Title" required>
                    <textarea id="task-description" placeholder="Description (Optional)"></textarea>
                    <input type="date" id="task-due-date" required>
                    <select id="task-priority">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <button type="submit">Add Task</button>
                  </form>
                </div>
              </div>

                <div id="edit-task-modal" class="modal hidden">
                  <div class="modal-content">
                      <form id="edit-task-form">
                          <input type="text" id="edit-task-title" placeholder="Task Title" required>
                          <textarea id="edit-task-description" placeholder="Description (Optional)"></textarea>
                          <input type="date" id="edit-task-due-date" required>
                          <select id="edit-task-priority">
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                          </select>
                          <button type="submit">Save Changes</button>
                      </form>
                  </div>
                </div>
        `;

        document.querySelectorAll('.check-color').forEach(el => {
          el.style.accentColor = project.color;
        });

        document.querySelectorAll('.add-task').forEach(el => {
          el.style.color = project.color;
        });


        const modal = document.getElementById('task-modal');
        const openModalBtn = document.getElementById('open-modal');

        const editModal = document.getElementById('edit-task-modal');

        openModalBtn.addEventListener('click', () => {
          modal.classList.remove('hidden');
        });


        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });


        editModal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });

        document.querySelectorAll('.open-edit-modal').forEach((editIcon) => {
          editIcon.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task'); 
            const taskId = taskElement.dataset.id; 
            const task = this.manager.findTaskById(taskId); 

            if (task) {
              
              document.getElementById('edit-task-title').value = task.title;
              document.getElementById('edit-task-description').value = task.description;
              document.getElementById('edit-task-due-date').value = task.dueDate;
              document.getElementById('edit-task-priority').value = task.priority;

              editModal.classList.remove('hidden');

              
              const editForm = document.getElementById('edit-task-form');
              editForm.onsubmit = (event) => {
                event.preventDefault();

                task.title = document.getElementById('edit-task-title').value;
                task.description = document.getElementById('edit-task-description').value;
                task.dueDate = document.getElementById('edit-task-due-date').value;
                task.priority = document.getElementById('edit-task-priority').value;

                this.manager.saveTaskEdit(task);
                this.renderProjectView(this.currentProject);
                editModal.classList.add('hidden');
              };
            }
          });
        });

        editModal.addEventListener('click', (e) => {
          if (e.target === editModal) {
            editModal.classList.add('hidden');
          }
        });


        document.querySelectorAll('.check-color').forEach((checkbox) => {
          checkbox.addEventListener('change', (e) => {
            const taskId = e.target.id; 
            const task = this.manager.findTaskById(taskId);
        
            if (task) {
              if (e.target.checked && !task.completed) {
                task.completeTask(); 
              } else if (!e.target.checked && task.completed) {
                task.completed = false; 
              }
              e.target.checked = task.completed;
              this.manager.saveProjects();
            }
          });
        
          const task = this.manager.findTaskById(checkbox.id);
          if (task) {
            checkbox.checked = task.completed;
          }
          
        });

          const darkerColor = project.color.replace('rgb', 'rgba').replace(')', `,0.7)`);
          const styleSheet = document.styleSheets[0];
          const rule = `form button:hover { background-color: ${darkerColor} !important; }`;
          styleSheet.insertRule(rule, styleSheet.cssRules.length);

          const rule2 = `form button { background-color: ${project.color} !important; }`;
          styleSheet.insertRule(rule2, styleSheet.cssRules.length);

          const rule3 = `form input:focus, form textarea:focus, form select:focus { border-color: ${project.color};
                          outline: none;
                          box-shadow: 0 0 4px ${darkerColor}; !important; }`;
          styleSheet.insertRule(rule3, styleSheet.cssRules.length);


        document.getElementById('task-form').addEventListener('submit', (e) => {
          e.preventDefault();
          this.addTaskToProject(project);
          modal.classList.add('hidden');
        });



        document.querySelectorAll('.fa-trash').forEach((icon) => {
          icon.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task');
            if (taskElement && this.currentProject) {
              const taskId = taskElement.dataset.id;
              this.currentProject.removeTask(taskId);
              this.manager.saveProjects(); 
              this.renderProjectView(this.currentProject);
            }
          }); 
        });
    };

    addTaskToProject(project) {
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const dueDate = document.getElementById('task-due-date').value;
      const priority = document.getElementById('task-priority').value;
    
      if (title && dueDate) {
        const newTask = new Task(title, description, dueDate, priority);
        project.addTask(newTask);    
        this.renderProjectView(project);
      }
      this.manager.saveProjects();
    }

    removeTaskFromProject(task){
      const taskItem = document.querySelector(`[data-id="${task.id}"]`);
      if (taskItem) {
        taskItem.remove();
      }
      this.manager.saveProjects();
    };
    
    selectHomeButton() {
        if (this.homeButton && this.homeButton !== this.activeButton) {
            this.activeButton?.classList.remove('toggled');
            this.homeButton.classList.add('toggled');
            this.activeButton = this.homeButton;
        }
    }
  
    addProjectUI() {
      const project = new Project(`Project ${manager.projects.length + 1}`);
      this.manager.addProject(project);
      
      const projectDOM = this.createProjectDOM(project);
      this.projectList.appendChild(projectDOM);
      this.manager.saveProjects();
    }

    removeProjectUI(project) {
      this.manager.removeProject(project);

      
      const projectItem = document.querySelector(`[data-id="${project.id}"]`);
      if (projectItem) {
        projectItem.remove();
      }
      this.manager.saveProjects();
    }


  
    createProjectDOM(project) {

      const projectDOM = document.createElement('li');
      projectDOM.classList.add('button', 'project-item');
      projectDOM.dataset.id = project.id;
    
      const icon1 = document.createElement('i');
      icon1.classList.add('fa-solid', 'fa-list-check');
      let randColor = project.color;
      icon1.style.color = randColor;
      projectDOM.appendChild(icon1);
    
      const projTitle = document.createElement('div');
      projTitle.classList.add('project-name');
      projTitle.textContent = project.title;
      projectDOM.appendChild(projTitle);
    
      const options = document.createElement('div');
      options.classList.add('options');
      projectDOM.appendChild(options);
    
      const icon2 = document.createElement('i');
      icon2.classList.add('fa-solid', 'fa-pen-to-square');
      const icon3 = document.createElement('i');
      icon3.classList.add('fa-solid', 'fa-trash');
      options.appendChild(icon2);
      options.appendChild(icon3);
    
      // Delete Icon Event
      icon3.addEventListener('click', () => {
        this.removeProjectUI(project);
        setTimeout(() => {
          this.homeButton.click();
        }, 0);
        
      });
  
      const newTitle = document.createElement("input");
      let editor = false;
    
      // Function to initiate editing
      const startEditing = () => {
        editor = true;
        projTitle.replaceWith(newTitle);
        newTitle.classList.add('project-name');
        newTitle.value = project.title;
        newTitle.focus();
      };
    
      // Start editing on double-click or on edit icon click
      projTitle.addEventListener('dblclick', startEditing);
      icon2.addEventListener('click', startEditing);
    
      // Handling Click Outside to Save
      document.addEventListener('click', (e) => {
        if (editor && !newTitle.contains(e.target) && !projTitle.contains(e.target) && !projectDOM.contains(e.target)) {
          project.title = newTitle.value;
          projTitle.textContent = project.title;
          newTitle.replaceWith(projTitle);
          editor = false;
          this.renderProjectView(project);
          this.manager.saveProjects();
        }
      });
      
      // Handling Enter Key to Save
      document.addEventListener('keypress', (e) => {
        if (editor && e.key === "Enter") {
          project.title = newTitle.value;
          projTitle.textContent = project.title;
          newTitle.replaceWith(projTitle);
          editor = false;
          this.renderProjectView(project);
          this.manager.saveProjects();
        }
      });
      return projectDOM;
    }

    handleSidebarClick(e) {
      const clickedItem = e.target.closest('.button');
      
      if (clickedItem && clickedItem !== this.activeButton) {
        this.activeButton?.classList.remove('toggled');
        clickedItem.classList.add('toggled');
        this.activeButton = clickedItem;
    
        if (clickedItem.classList.contains('project-item')) {
          const projectId = clickedItem.dataset.id;
          const project = this.manager.findProjectById(projectId);
          if (project) {
            this.renderProjectView(project);
          }
        }
      }
    }
  }
  
  const manager = new ProjectManager();
  const ui = new UIManager(manager);


  
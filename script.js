const addTaskBtn = document.querySelector('#add-task-btn');
const addTaskModal = document.querySelector('#add-task-modal');
const cancelModalBtn = document.querySelector('#cancel-modal-btn');
const createTaskBtn = document.querySelector('#create-task-btn');
const form = document.querySelector('form')
const todoTaskContainer = document.querySelector('#todo-tasks');
const inprogressTaskContainer = document.querySelector('#inprogress-tasks');
const doneTaskContainer = document.querySelector('#done-tasks');
const priorityDivs = document.querySelectorAll('.tool-box div');

let selectedPriority = 'all';

const priorities = ['pink', 'green', 'blue', 'black'];

let tasks = [];

function uuid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

function loadTasksFromLocalStorage(){
    const initialTaks = JSON.parse(window.localStorage.getItem('tasks') || '[]' );
    tasks = initialTaks;
}

function syncLocalStorage(){
    window.localStorage.setItem('tasks',JSON.stringify(tasks));
}

function createLockElement(task){
    const i = document.createElement('i');
    task.locked ?  i.classList.add('bi','bi-lock-fill') : i.classList.add('bi', 'bi-unlock');
    i.addEventListener('click', ()=> {
        task.locked = !task.locked;
        renderTasks();
        syncLocalStorage();
    });
    return i;

}

function updatePriority(taskId, newPriority){
    const task = tasks.find( (task) => task.id === taskId);
    if(task){
        task.priority = newPriority;
    }
    renderTasks();
    syncLocalStorage();
}

function createPrioritySelection(task) {
    const select = document.createElement('select');
    for (let priority of priorities) {
        const option = document.createElement('option');
        option.innerText = priority;
        if (task.priority === priority) {
            option.setAttribute('selected', true);
        }
        select.append(option);
    }

    if(task.locked){
        select.setAttribute('disabled',true);
    }

    select.addEventListener('change', function(){
        updatePriority(task.id,select.value)
    });
    return select;
}

function deleteTask(id){
    const index = tasks.findIndex((task) => task.id === id);
    tasks.splice(index,1);
    renderTasks();
    syncLocalStorage();
}

function createTask(task){

    const div = document.createElement('div');
    div.innerHTML = 
        `<div class="task task-${task.priority}">
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
        </div>`

    const span = document.createElement('span');
    span.innerHTML = '<i class="bi bi-trash"></i>'
    span.addEventListener('click', function() {
        deleteTask(span.getAttribute('data-id'));
    })
    span.setAttribute('data-id', task.id);

    const select = createPrioritySelection(task);
    const lock = createLockElement(task);

    div.children[0].append(span);
    div.children[0].append(lock);
    div.children[0].append(select);

    return div;
}

function renderTaskListToUI(container,taskList) {

    for(let task of taskList){
        const taskComponent = createTask(task);
        container.append(taskComponent);
    }
}

function renderTasks() {

    todoTaskContainer.innerHTML = '';
    inprogressTaskContainer.innerHTML = '';
    doneTaskContainer.innerHTML = '';

    let filteredTasks = tasks;
    if(selectedPriority !== 'all') {
        filteredTasks = tasks.filter( (task) => task.priority === selectedPriority);
    }

    const todoTaskList = filteredTasks.filter((task) => task.status === 'todo');
    const inprogressTaskList = filteredTasks.filter((task) => task.status === 'inprogress')
    const doneTaskList = filteredTasks.filter((task) => task.status === 'done')

    renderTaskListToUI(todoTaskContainer,todoTaskList);
    renderTaskListToUI(inprogressTaskContainer,inprogressTaskList);
    renderTaskListToUI(doneTaskContainer,doneTaskList);
}

function addTask(description,priority) {
    const newTask ={
        description,
        priority,
        id: uuid(),
        status: 'todo',
        locked: true,
        createdAt: new Date().toISOString()
    }
    tasks.push(newTask);
    renderTasks();
    syncLocalStorage();
}

function setEventListeners() {

    addTaskBtn.addEventListener('click', function(){
        addTaskModal.style.display = 'block';
    });

    cancelModalBtn.addEventListener('click', function(){
        addTaskModal.style.display = 'none';
    });

    form.addEventListener('submit', function(event) {
        
        event.preventDefault();

        const description = form.elements[0].value;

        const priorityInput = document.querySelector('input[name="priority"]:checked');
        const priority = priorityInput.value;

        addTask(description,priority);

        addTaskModal.style.display = 'none';

    });

    for(const priorityDiv of priorityDivs) {
        priorityDiv.addEventListener('click', function(){
            const alreadySelected = document.querySelector('.tool-box div.selected-priority')
            if(priorityDiv === alreadySelected){
                return;
            }
            if(alreadySelected){
                alreadySelected.classList.remove('selected-priority');
            }
            priorityDiv.classList.add('selected-priority');

            const currselectedPriority = priorityDiv.getAttribute('data-priority');

            selectedPriority = currselectedPriority;

            renderTasks();
            syncLocalStorage();
        });
    }
}

function initializeApp() {
    loadTasksFromLocalStorage();
    setEventListeners();
    renderTasks()
}

initializeApp();
const addTaskBtn = document.querySelector('#add-task-btn');
const addTaskModal = document.querySelector('#add-task-modal');
const cancelModalBtn = document.querySelector('#cancel-modal-btn');
const createTaskBtn = document.querySelector('#create-task-btn');
const form = document.querySelector('form')
const todoTaskContainer = document.querySelector('#todo-tasks');
const inprogressTaskContainer = document.querySelector('#inprogress-tasks');
const doneTaskContainer = document.querySelector('#done-tasks');

const tasks = [
    
    {
        description:'Learn',
        priority: 'pink',
        status: 'todo',
        createdAt: new Date().toISOString(),
        id: uuid()
    },

    {
        description:'Code',
        priority: 'green',
        status: 'todo',
        createdAt: new Date().toISOString(),
        id: uuid()
    },

    {
        description:'read',
        priority: 'blue',
        status: 'inprogress',
        createdAt: new Date().toISOString(),
        id: uuid()
    },

    {
        description:'Work',
        priority: 'black',
        status: 'done',
        createdAt: new Date().toISOString(),
        id: uuid()
    }
]

function initializeApp() {
    setEventListeners();
    renderTasks()

}

function uuid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

function createTask(task){

    const div = document.createElement('div');
    div.innerHTML = 
        `<div class="task task-${task.priority}">
            <p>${task.description}</p>
            <p>${task.status}</p>
        </div>`

    const span = document.createElement('span');
    span.innerHTML = '<i class="bi bi-trash"></i>'
    span.addEventListener('click', function() {
        deleteTask(span.getAttribute('data-id'));
    })
    span.setAttribute('data-id', task.id);

    div.children[0].append(span);

    return div;
}

function renderTaskListToUI(container,taskList) {

    for(let task of taskList){
        const taskComponent = createTask(task);
        container.append(taskComponent);
    }
}

function deleteTask(id){
    const index = tasks.findIndex((task) => task.id === id);
    tasks.splice(index,1);
    renderTasks();
}

function renderTasks() {

    todoTaskContainer.innerHTML = '';
    inprogressTaskContainer.innerHTML = '';
    doneTaskContainer.innerHTML = '';

    const todoTaskList = tasks.filter((task) => task.status === 'todo');
    const inprogressTaskList = tasks.filter((task) => task.status === 'inprogress')
    const doneTaskList = tasks.filter((task) => task.status === 'done')

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
        createdAt: new Date().toISOString()
    }
    tasks.push(newTask);
    renderTasks();
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
}

initializeApp();
const addTaskBtn = document.querySelector('#add-task-btn');
const addTaskModal = document.querySelector('#add-task-modal');
const cancelModalBtn = document.querySelector('#cancel-modal-btn');

function initializeApp() {
    setEventListeners();

}

function setEventListeners() {

    addTaskBtn.addEventListener('click', function(){
        addTaskModal.style.display = 'block';
    });

    cancelModalBtn.addEventListener('click', function(){
        addTaskModal.style.display = 'none';
    })
}

initializeApp();
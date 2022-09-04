//Find elements
const form = document.querySelector('#form');
const taskList = document.querySelector('#tasksList');
const taskInput = document.querySelector('#taskInput');
const emptyList = document.querySelector('#emptyList');
const btnRemoveAll = document.querySelector('#remove_all');

let tasks = [];
if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

removeBtn();
checkEmptyList();


taskInput.focus();

if (localStorage.getItem('tasksHTML')) {
    taskList.innerHTML = localStorage.getItem('tasksHTML');
}
//Add task
form.addEventListener('submit', addTask);

//Remove task
taskList.addEventListener('click', removeTask);

//RemoveAll
btnRemoveAll.addEventListener('click', removeAll);

//Done task
taskList.addEventListener('click', doneTask);

//Functions
function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value;

    //Описываемзадачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    //Добавляем элемент в конец массива
    tasks.push(newTask);

    renderTask(newTask);

    //Clean input
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
    saveToLS();
    removeBtn();
}

function removeTask (event) {
    //Если клик был не по кнопке 'delete'
    if (event.target.dataset.action !== 'delete') return;

    //Если клик был по кнопке 'delete'
    const parentNode = event.target.closest('li');
    
    //Определяем id задачи
    const id = Number(parentNode.id);

    //Удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);
    console.log(tasks)

    //Удаляем элементы из разметки
    parentNode.remove();

    checkEmptyList();
    saveToLS();
    removeBtn();
}

function doneTask (event) {
    //Если клик был не по кнопке 'done'
    if (event.target.dataset.action !== 'done') return;

    //Если клик был по кнопке 'done'
    const parentNode = event.target.closest('li');

    //Определяем ID 
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id)
    task.done = !task.done; 

    const span = parentNode.querySelector('.task-title')
    span.classList.toggle('task-title--done');
    
    saveToLS();

}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.jpg" alt="empty" width="48" class="mt-3">
        <div class="empty-list_title">To Do List empty!</div>
    </li>`;
    taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLS() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask (task) {
    //Формируем CSS CLASS
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    //Формируем разметку
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="d-flex task-item-buttons">
            <button type="button" data-action="done" class="btn-action mr-1">
                <img src="./img/done.png" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.png" alt="delete" width="18" height="18">
            </button>
        </div>
    </li>
    `;
    
    //Добавляем в разметку
    taskList.insertAdjacentHTML("beforeend" , taskHTML);
}

function removeAll (event) {
    if (event.target === btnRemoveAll){
        tasks = [];
        saveToLS();
        history.go();
    }
}

function removeBtn() {
    if (tasks.length === 0){
        btnRemoveAll.classList.add('none');
    } else if (tasks.length > 0) {
        btnRemoveAll.classList.remove('none');
    }
}
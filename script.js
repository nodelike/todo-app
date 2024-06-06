let currentList = "all";

function createTask(task){
    let todoSection = document.querySelector(".todo-section");

    let cardDiv = document.createElement('div');
    cardDiv.classList.toggle('card');

    //checkbox
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('onchange', 'updateList()');
    checkbox.classList.toggle('checkbox');

    //task div
    let taskDiv = document.createElement('div');
    taskDiv.classList.toggle('task');
    taskDiv.innerText = task;

    taskDiv.addEventListener('dblclick', function() {
        let currentTask = this.innerText;
        let inputElement = document.createElement('input');
        inputElement.classList.toggle('task-edit');
        inputElement.type = 'text';
        inputElement.value = currentTask;
        this.innerText = '';
        this.appendChild(inputElement);
        inputElement.focus();
    
        inputElement.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
            let editedTask = this.value;
            if(editedTask.length > 1){
                taskDiv.innerText = editedTask;
                updateList();
            } else {
                alert("The task name should be greater than 1.");
            }
          }
        });
    });
    

    //delete icon
    let deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('onclick', 'deleteTask(this)')
    deleteIcon.classList.toggle('fa-solid');
    deleteIcon.classList.toggle('fa-trash');

    cardDiv.appendChild(checkbox);
    cardDiv.appendChild(taskDiv);
    cardDiv.appendChild(deleteIcon);

    todoSection.appendChild(cardDiv);
    updateList();
}

function deleteTask(element){
    element.parentNode.remove();
    updateCount();
}

function updateList(element, state){
    let cards = document.querySelector(".todo-section").children;
    if(state){
        currentList = state;
    }

    for(let card of cards){
        let checkbox = card.querySelector("input[type='checkbox']");
        if(checkbox.checked){
            card.classList.add("completed")
            if(currentList == "active"){
                card.style.display = "none"
            } else {
                card.style.display = "flex";
            }
        } else{
            card.classList.remove("completed")
            if(currentList == "completed"){
                card.style.display = "none"
            } else {
                card.style.display = "flex";
            }
        }
    }

    if(element){
        let filters = document.querySelector('.filters').children;
        
        for(let filter of filters){
            filter.classList.remove('active');
        }

        element.classList.toggle('active');
    }
    updateCount();
}

function updateCount(){
    let todoDiv = document.querySelector(".todo-section");
    let count = 0;
    let cards = document.querySelector(".todo-section").children;

    for(let card of cards){
        let checkbox = card.querySelector("input[type='checkbox']");
        if(!checkbox.checked){
            count++
        }
    }

    document.getElementById("count").innerHTML = `${count} items left`;

    if(currentList == "all" && cards.length > 0){
        todoDiv.style.display = "block";
    } else if(currentList == "active" && count > 0) {
        todoDiv.style.display = "block";
    } else if(currentList == "completed" && cards.length - count > 0){
        todoDiv.style.display = "block";
    } else{
        todoDiv.style.display = "none";
    }
}

function toggleCheckboxes(){
    let cards = document.querySelector(".todo-section").children;
    let allChecked = true;

    Object.values(cards).forEach((card) => {
        if(card.style.display == "flex"){
            let checkbox = card.querySelector("input[type='checkbox']");
            if(!checkbox.checked) {
                allChecked = false;
            }
        }
    });

    Object.values(cards).forEach((card) => {
        if(card.style.display == "flex"){
            let checkbox = card.querySelector("input[type='checkbox']");
            checkbox.checked = !allChecked;
        }
    });

    updateList();
}

function deleteAllCompleted(){
    let cards = document.querySelector(".todo-section").children;

    Object.values(cards).forEach((card) => {
        let checkbox = card.querySelector("input[type='checkbox']");
        if(checkbox.checked){
           card.remove();
        }
    })

    updateList();
}

document.addEventListener('DOMContentLoaded', () => {

    let inputBox = document.getElementById("input-box");

    inputBox.addEventListener('keydown', (event) => {
        if(event.key == "Enter"){
            const task = inputBox.value.trim();
            inputBox.value = "";
            if(task.length > 1){
                createTask(task)
            } else {
                alert("The task name should be greater than 1.");
            }
        }
    })
});
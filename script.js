let currentList = "all";
let tasks = [];

function createEditEvent(taskDiv){
    try {
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
                    render(tasks);
                } else {
                    alert("The task name should be greater than 1.");
                }
            }
            });
        });
    } catch (error) {
        alert(error);
    }
    
}

function updateList(element, list){
    try {
        currentList = list;
        let filters = document.querySelector('.filters').children;
        Object.values(filters).forEach((filter) => {
            filter.classList.remove('active');
        })

        element.classList.toggle('active');
        render();
    } catch (error) {
        alert(error);
    }
}

function render(){
    try {
        let todoSection = document.querySelector(".todo-section");
        todoSection.innerHTML = "";
        let data = tasks;
    
        data = tasks.filter((task) => {
            if(currentList == "all"){
                return true;
            } else if(currentList == "active"){
                return task.state == "notCompleted";
            } else {
                return task.state == "isCompleted";
            }
        })
        
    
        data.forEach((task) => {
            let cardDiv = document.createElement('div');
            cardDiv.classList.toggle('card');
    
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('onchange', `changeState(${task.id})`);
            checkbox.checked = task.state == "isCompleted";
            checkbox.classList.toggle('checkbox');
        
            //task div
            let taskDiv = document.createElement('div');
            taskDiv.classList.toggle('task');
            taskDiv.innerText = task.task;
    
            createEditEvent(taskDiv);
            
        
            //delete icon
            let deleteIcon = document.createElement('i');
            deleteIcon.setAttribute('onclick', `deleteTask(${task.id})`)
            deleteIcon.classList.toggle('fa-solid');
            deleteIcon.classList.toggle('fa-trash');
        
            cardDiv.appendChild(checkbox);
            cardDiv.appendChild(taskDiv);
            cardDiv.appendChild(deleteIcon);
            todoSection.appendChild(cardDiv);
        })
    
        updateCount();
    } catch (error) {
        alert(error);
    }
    
}

function deleteTask(id){
    try {
        tasks = tasks.filter((task) => {
            return task.id != id;
        })
        saveTasks();
        render();
    } catch (error) {
        alert(error)
    }
}

function changeState(id){
    try {
        tasks.forEach((task) => {
            if(task.id == id){
                task.state = task.state == "notCompleted" ? "isCompleted" : "notCompleted";
            }
        })
        saveTasks();
        updateCount();
    } catch (error) {
        alert(error);
    }
    
}

function updateCount(){
    try {
        let todoDiv = document.querySelector(".todo-section");
        let count = tasks.filter((task) => {
            return task.state == "notCompleted";
        }).length;
    
        
        document.getElementById("count").innerHTML = `${count} items left`;
    
        if(currentList == "all" && tasks.length > 0){
            todoDiv.style.display = "block";
        } else if(currentList == "active" && count > 0) {
            todoDiv.style.display = "block";
        } else if(currentList == "completed" && tasks.length - count > 0){
            todoDiv.style.display = "block";
        } else{
            todoDiv.style.display = "none";
        }  
    } catch (error) {
        alert(error);
    }
}

function toggleAllCheckboxes() {
    try {
      let allChecked = tasks.every((task) => {
        if (currentList === "all") {
          return task.state === "isCompleted";
        } else if (currentList === "active") {
          return task.state === "isCompleted";
        } else if (currentList === "completed") {
          return task.state === "isCompleted";
        }
      });
  
      tasks = tasks.map((task) => {
        if (currentList === "all") {
          task.state = allChecked ? "notCompleted" : "isCompleted";
        } else if (currentList === "active" && task.state === "notCompleted") {
          task.state = "isCompleted";
        } else if (currentList === "completed" && task.state === "isCompleted") {
          task.state = "notCompleted";
        }
        return task;
      });
      saveTasks();
      render();
    } catch (error) {
      alert(error);
    }
}

function deleteAllCompleted(){
    try {
        tasks = tasks.filter((task) => {
            return task.state == "notCompleted" 
        });
        saveTasks();
        render();
    } catch (error) {
        alert(error);
    }
}

function saveTasks() {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      alert(error);
    }
}

function loadTasks() {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        tasks = JSON.parse(storedTasks);
      }
    } catch (error) {
      alert(error);
    }
}  

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    render();
    let inputBox = document.getElementById("input-box");

    inputBox.addEventListener('keydown', (event) => {
        if(event.key == "Enter"){
            const task = inputBox.value.trim();
            inputBox.value = "";
            if(task.length > 1){
                let obj = { id: Date.now(), task: task, state: "notCompleted"}
                tasks.push(obj);
                saveTasks();
                render();
            } else {
                alert("The task name should be greater than 1.");
            }
        }
    })
});
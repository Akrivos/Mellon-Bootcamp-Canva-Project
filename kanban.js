// function fetchUser() {

//   return new Promise((resolve) => {
//     setTimeout(() => {

//       resolve({
//         id: 1,
//         name: "Alice"
//       });

//     }, 1000);
//     throw new Error("Unexpected error");
//   });

// }


// fetchUser()
//   .then(user => user.id)
//   .then(id => {
//     console.log("User id:", +id);
//   }).catch(err => {
//     console.error(err.message);
//   });



// function LoadConfig() {
//   fetch("config.json")
//     .then(res => res.json())
//     .then(data => {
//       console.log("Config loaded");
//       const body = document.getElementById("body");

//       body.style.backgroundColor = data.background_colour;
//     })
//     .catch(error => {
//       console.log("error loading config:", error);
//     });
// }


// LoadConfig();



let tasks = [];

function saveTasks() {
  localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("kanban-tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => {
      renderTask(task);
    });
  }
}

function renderTask(task) {
  const newTaskDOM = document.createElement("li");
  newTaskDOM.classList.add("task");
  newTaskDOM.setAttribute("draggable", "true");
  newTaskDOM.id = task.id;

  const newTaskInfo = document.createElement("ul");
  newTaskInfo.classList.add("Task-Info");

  const newTaskTitle = document.createElement("li");
  newTaskTitle.classList.add("TaskTitle");
  newTaskTitle.textContent = task.title;

  const newTaskDescription = document.createElement("li");
  newTaskDescription.classList.add("TaskDescription");
  newTaskDescription.textContent = task.description;

  const newTaskTime = document.createElement("li");
  newTaskTime.classList.add("TaskTime");
  newTaskTime.textContent = task.timeCreated;

  const newTaskDelBtn = document.createElement("button")
  newTaskDelBtn.textContent = "Delete";
  newTaskDelBtn.classList.add("delete-btn");
  newTaskDelBtn.id = "taskDelBtn"; // id added to control language change

  newTaskInfo.appendChild(newTaskTitle);
  newTaskInfo.appendChild(newTaskDescription);
  newTaskInfo.appendChild(newTaskTime);
  newTaskInfo.appendChild(newTaskDelBtn);

  newTaskDOM.appendChild(newTaskInfo);

  let columnId = task.status;
  if (columnId === "todo") columnId = "ToDoTasks";
  let targetColumn = document.getElementById(columnId);
  if (!targetColumn) targetColumn = document.getElementById("ToDoTasks");

  targetColumn.appendChild(newTaskDOM);

  newTaskDelBtn.addEventListener("click", function (event) {
    newTaskDOM.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });

  setupTaskDragEvents(newTaskDOM);
}

const form = document.getElementById("TaskCreator");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskTitle = document.getElementById("TaskTitle").value;
  const taskDesc = document.getElementById("TaskDesc").value;

  const newTask = {
    id: Date.now().toString(),
    title: taskTitle,
    description: taskDesc,
    timeCreated: new Date().toLocaleTimeString(),
    status: "ToDoTasks"
  };

  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();

  form.reset();
});

function setupTaskDragEvents(taskElement) {
  taskElement.addEventListener("dragstart", function (event) {
    event.target.classList.add("dragging");
    event.dataTransfer.setData("text/plain", event.target.id);
  });

  taskElement.addEventListener("dragend", function (event) {
    event.target.classList.remove("dragging");
  });
}

const columns = document.querySelectorAll(".task-column .tasks");

columns.forEach(function (column) {
  column.addEventListener("dragover", function (event) {
    event.preventDefault();
    movePlaceholder(event);
  });

  column.addEventListener("drop", function (event) {
    event.preventDefault();
    const current_id = event.currentTarget.id;
    const id = event.dataTransfer.getData("text/plain");
    const draggedTask = document.getElementById(id);

    if (draggedTask) {
    
    const foundTask = tasks.find(task => task.id === draggedTask.id);

      if (foundTask) {
        foundTask.status = current_id;
        saveTasks();
      }
    }

    const placeholder = column.querySelector(".placeholder");
    if (!placeholder) return;
    draggedTask.remove();
    column.insertBefore(draggedTask, placeholder);
   
    placeholder.remove();
  });
});

// The following function set is used to create the placeholder upon hovering

function makePlaceholder(draggedTask) {
  const placeholder = document.createElement("li");
  placeholder.classList.add("placeholder");
  placeholder.style.height = `${draggedTask.offsetHeight}px`;
  return placeholder;
}

function movePlaceholder(event) {
  event.preventDefault();
  const draggedTask = document.querySelector(".dragging");
  const taskList = event.currentTarget;
  const existingPlaceholder = taskList.querySelector(".placeholder");

  if (existingPlaceholder) {
  const placeholderRect = existingPlaceholder.getBoundingClientRect();
  if (
    placeholderRect.top <= event.clientY &&
    placeholderRect.bottom >= event.clientY
  ) {
    return;
  }
  }
for (const task of taskList.children) {
  if (task.classList.contains("placeholder") ) continue;
  if (task.getBoundingClientRect().bottom >= event.clientY) {
    if (task === existingPlaceholder) return;
    existingPlaceholder?.remove();
    if (task === draggedTask || task.previousElementSibling === draggedTask)
      return;
    taskList.insertBefore(
      existingPlaceholder ?? makePlaceholder(draggedTask),
      task,
    );
    return;
  }
}
existingPlaceholder?.remove();
  if (taskList.lastElementChild === draggedTask) return;
  taskList.append(existingPlaceholder ?? makePlaceholder(draggedTask));
}


//change lang

//get modes
const engMode = document.getElementById("engMode");
const grMode = document.getElementById("grMode");
const engInp = document.getElementById("engInp");
const grInp = document.getElementById("grInp");

//initialize inputs to be checked on english
engInp.checked = true;
grInp.checked = false;

//handle click listeners
engMode.addEventListener("click", ()=>{
  location.hash = '#eng';
  location.reload();
})
grMode.addEventListener("click", ()=>{
  location.hash = '#gr';
  location.reload();
})

// Define the language reload anchors
let language = {
    gr: {
        taskTitle: "Όνομα Εργασίας: ",
        taskDescription: "Περιγραφή Εργασίας: ",
        submitBtn: "Υποβολή",
        toDo: "Προς Υλοποίηση",
        inProgress:"Σε Εξέλιξη",
        done: "Ολοκληρωμένες",
        delBtn: "Διαγραφή"
    }
}

//get elements
let taskTitleHeader = document.getElementById("taskTitleHeader");
let taskDescriptionHeader = document.getElementById("taskDescriptionHeader");
let toDoHeader = document.getElementById("toDoHeader");
let onProgressHeader = document.getElementById("onProgressHeader");
let doneHeader = document.getElementById("doneHeader");
let createTask = document.getElementById("createTaskBtn"); 

if (window.location.hash) {

  // Set the content of the webpage
  // depending on the hash value
  if (window.location.hash == "#gr") {

      //change check sign in inputs
      engInp.checked = false;
      grInp.checked = true;

      //change context in headers and buttons
      taskTitleHeader.textContent = language.gr.taskTitle;
      taskDescriptionHeader.textContent = language.gr.taskDescription;
      toDoHeader.textContent = language.gr.toDo;
      onProgressHeader.textContent = language.gr.inProgress;
      doneHeader.textContent = language.gr.done;
      createTask.textContent = language.gr.submitBtn;

      //add observer to check if ui is changed (delete btn is added)
      let observer = new MutationObserver(() => {
        let taskDelBtn = document.getElementById("taskDelBtn");
        let taskDelBtns = document.querySelectorAll(".delete-btn");
        if (taskDelBtns.length > 0) {
            observer.disconnect();

            for (let btn of taskDelBtns) {
                btn.textContent = language.gr.delBtn;
            }
        }
      });
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
    }
    else if(window.location.hash == "#eng"){
        engInp.checked = true;
        grInp.checked = false;        
    }
}


// Load tasks on startup
loadTasks();

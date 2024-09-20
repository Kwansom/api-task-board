// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskId = 0; // Declaring taskiD outside of the function so it maintains its value between calls to generateTaskId()

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // Check if nextId exists, if not, initialize it to 1.
  // Increment nextId for each new task
  // return ++taskId;
  if (!taskId) {
    taskId = 1;
  } else {
    taskId++;
  }
  return taskId;
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  //retreive input values from modal form
  const taskTitle = document.getElementById("taskTitle").value;
  const taskDes = document.getElementById("taskDescription").value;
  const taskDue = document.getElementById("taskDueDate").value;

  // alert if value inputs are empty in modal form
  if (!taskTitle) {
    alert("Please add a title to your task.");
    return;
  }
  if (!taskDes) {
    alert("Please add a description for your task.");
    return;
  }
  if (!taskDue) {
    alert("Please add a due date for your task.");
    return;
  }

  // new task object to store values in an array
  const newTask = {
    taskTitle,
    taskDes,
    taskDue,
    status: "todo",
    id: generateTaskId(),
  };

  //parse for previously stored tasks or an empty array to push newTask data
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();
  const id = $(event.target).data("id");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();
  const today = dayjs(); // Get the current date using Day.js
  for (let i = 0; i < tasks.length; i++) {
    const card = $("<div></div>")
      .addClass("task-card draggable")
      .attr("data-id", tasks[i].id); //add draggable class to card
    const title = $("<h4>");
    const description = $("<p>");
    const due = $("<p>");

    const deleteButton = $("<button>")
      .addClass("delete")
      .text("Delete")
      .on("click", function (event) {
        // Remove the card when the button is clicked and delete from localStorage
        handleDeleteTask(event);
        card.remove();
      });

    deleteButton.attr("data-id", tasks[i].id); //adding data attribute to and id value to deleteButton for every card rendered

    // values from modal form to be put into DOM
    title.text(tasks[i].taskTitle);
    description.text(tasks[i].taskDes);
    due.text(tasks[i].taskDue);

    // Check due date and apply a color corresponding to its class class
    const dueDate = dayjs(tasks[i].taskDue);
    if (dueDate.isBefore(today, "day")) {
      card.addClass("overdue"); // Add class for overdue tasks
    } else if (dueDate.isAfter(today, "day")) {
      card.addClass("in-progress"); // Add class for tasks nearing the deadline
    }

    // appending information to html div
    card.append([title, description, due, deleteButton]);
    $(`#${tasks[i].status}-cards`).append(card);

    // class draggable to all cards with visual ghost trail
    $(".draggable").draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (e) {
        const original = $(e.target).hasClass("draggable")
          ? $(e.target)
          : $(e.target).closest(".draggable");
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const droppedItemId = ui.draggable[0].dataset.id; // id of dropped task
  // get task out, find by id, update which lane it is
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  let currentTask;

  for (let i = 0; i < tasks.length; i++) {
    if (droppedItemId == tasks[i].id) {
      currentTask = tasks[i];
      break; // Exit loop once the task is found
    }
  }

  // Check if the task was found
  if (currentTask) {
    // Update the task's status
    currentTask.status = event.target.id;

    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Clear previous lane
    $(`#${currentTask.status}-cards`).empty();

    // Re-render the task list to display it in the new lane
    renderTaskList();
  }

  // localStorage.setItem("tasks", JSON.stringify(tasks));
  // renderTaskList();

  console.log(event.target.id);
  console.log(ui);
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Open modal
  $("#btn btn-success").on("click", function () {
    $("#formModal").show();
  });

  $("#taskForm").on("submit", handleAddTask);

  if ("#task")
    // Close modal
    $(".close").on("click", function () {
      $("#formModal").hide();
    });

  renderTaskList();

  // need droppable, handleDrop function! :/
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});

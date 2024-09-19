// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskId = 0; // Declaring taskiD outside of the function so it maintains its value between calls to generateTaskId()

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // Check if nextId exists, if not, initialize it to 1.
  // Increment nextId for each new task
  if (!taskId) {
    taskId = 1;
  } else {
    taskId++;
  }
  return taskId;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();
  const id = $(event.target).data("id");
  console.log(id);
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== id);
  // tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  $("#todo-cards").empty();
  const today = dayjs(); // Get the current date using Day.js
  for (let i = 0; i < tasks.length; i++) {
    const card = $("<div></div>").addClass("task-card draggable");
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

    deleteButton.attr("data-id", tasks[i].id);

    title.text(tasks[i].taskTitle);
    description.text(tasks[i].taskDes);
    due.text(tasks[i].taskDue);

    // Check the due date and apply a color corresponding to its class class
    const dueDate = dayjs(tasks[i].taskDue);
    if (dueDate.isBefore(today, "day")) {
      card.addClass("overdue"); // Add class for overdue tasks
    } else if (dueDate.isAfter(today, "day")) {
      card.addClass("in-progress"); // Add class for tasks nearing the deadline
    }
    card.append([title, description, due, deleteButton]);
    $("#todo-cards").append(card);

    $(".draggable").draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (e) {
        const original = $(e.target).hasClass("ui-draggable")
          ? $(e.target)
          : $(e.target).closest(".ui-draggable");
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = document.getElementById("taskTitle").value;
  const taskDes = document.getElementById("taskDescription").value;
  const taskDue = document.getElementById("taskDueDate").value;

  const newTask = {
    taskTitle,
    taskDes,
    taskDue,
    status: "todo",
    id: generateTaskId(),
  };
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

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
});
$(".lane").droppable({
  accept: ".draggable",
  drop: handleDrop,
});

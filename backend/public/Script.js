document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', function() {
      cards.forEach(c => c.classList.remove('expanded'));
      this.classList.add('expanded');
    });
  });
});

$(document).ready(function () {
  async function loadTasks(category) {
    let taskContainer;
    if (category === "#all-todos") {
      taskContainer = $("#all-tasks");
    } else {
      taskContainer = $(category + "-tasks");
    }

    taskContainer.empty();

    const tasks = await getTasks(category);

    const tasksByCategory = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {});

    for (const [category, tasks] of Object.entries(tasksByCategory)) {
      const categoryClass = getCategoryClass(category);
      const cardHtml = `
        <div class="col-md-3">
          <div class="card ${categoryClass}">
            <div class="card-body">
              <h5 class="card-title">${category}</h5>
              <ul class="list-unstyled">
                ${tasks.map(task => `
                  <li class="task-item">
                    <div class="task-text">
                      <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''} /> ${task.title}
                      <p>${task.description}</p>
                    </div>
                    <div class="task-icons">
                      <i class="fas fa-edit" data-task-id="${task._id}"></i>
                      <i class="fas fa-trash" data-task-id="${task._id}"></i>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
      taskContainer.append(cardHtml);
    }
  }

  function getCategoryClass(category) {
    switch (category) {
      case 'Personal': return 'bg-task';
      case 'Work': return 'bg-reminder';
      case 'Me-Time': return 'bg-idea';
      case 'Household': return 'bg-todo';
      case 'Event': return 'bg-event';
      default: return '';
    }
  }

  async function getTasks(category) {
    try {
      const response = await fetch('/api/todos');
      const allTasks = await response.json();
      if (category === "#all-todos") {
        return allTasks;
      }
      const filteredTasks = allTasks.filter(task => `#${task.category.replace(' ', '-')}` === category);
      return filteredTasks;
    } catch (error) {
      return [];
    }
  }

  $("a[data-toggle='tab']").on("shown.bs.tab", function (e) {
    const target = $(e.target).attr("href");
    loadTasks(target);
  });

  loadTasks("#all-todos");

  $('#addTaskButton').on('click', async function() {
    console.log('Add Task Button Clicked');
    const taskData = {
      title: $('#taskTitle').val(),
      dueDate: $('#dueDate').val(),
      description: $('#description').val(),
      category: $('#category').val()
    };

    console.log('Adding task:', taskData);

    try {
      const response = await fetch('/api/todos/createtodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      const responseBody = await response.text();
      console.log('Response:', responseBody);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      $('#taskForm')[0].reset();
      $('#addTaskModal').modal('hide');

      const activeTab = $("ul.nav-tabs li a.active").attr("href");
      loadTasks(activeTab);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  });
  $('#addTaskModal').on('show.bs.modal', function (event) {
    const activeTab = $("ul.nav-tabs li a.active").attr("href");
    const category = activeTab ? activeTab.substring(1) : null;

    if (category && category !== 'all-todos') {
      $('#category').val(category).prop('disabled', true);
    } else {
      $('#category').val('').prop('disabled', false);
    }
  });

  $('#addTaskModal').on('hidden.bs.modal', function () {
    $('#category').prop('disabled', false);
  });

  $(document).on("click", ".task-icons .fa-edit", async function () {
    const taskId = $(this).data("task-id");
    console.log("Edit Task", taskId);

    try {
        const response = await fetch(`/api/todos/${taskId}`);
        const task = await response.json();

        $('#taskTitle').val(task.title);
        $('#dueDate').val(task.dueDate);
        $('#description').val(task.description);
        $('#category').val(task.category).prop('disabled', true);
        $('#addTaskButton').hide();
        $('#updateTaskButton').data('task-id', taskId).show();

        $('#addTaskModal').modal('show');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

$('#updateTaskButton').on('click', async function () {
    const taskId = $(this).data('task-id');
    const taskData = {
        title: $('#taskTitle').val(),
        dueDate: $('#dueDate').val(),
        description: $('#description').val(),
        category: $('#category').val()
    };

    try {
        const response = await fetch(`/api/todos/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        $('#taskForm')[0].reset();
        $('#addTaskModal').modal('hide');

        const activeTab = $("ul.nav-tabs li a.active").attr("href");
        loadTasks(activeTab);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

$('#addTaskModal').on('hidden.bs.modal', function () {
    $('#taskForm')[0].reset();
    $('#addTaskButton').show();
    $('#updateTaskButton').hide();
    $('#category').prop('disabled', false);
});


  $(document).on("click", ".task-icons .fa-trash", async function () {
    const taskId = $(this).data("task-id");
    console.log(taskId);
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const activeTab = $("ul.nav-tabs li a.active").attr("href");
      loadTasks(activeTab);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  });

  
});

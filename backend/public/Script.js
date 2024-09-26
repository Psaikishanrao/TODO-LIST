$(document).ready(function () {
  let showOnlyPending = false;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  const token = getCookie('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  async function loadUserProfile() {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText);
        return;
      }

      const user = await response.json();
      $('#username').text(user.username);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  loadUserProfile();

  const today = new Date();
  $('#currentDate').text(formatDate(today));

  async function loadTasks(category) {
    let taskContainer;
    if (category === "#all-todos") {
      taskContainer = $("#all-tasks");
      taskContainer.empty();
    } else {
      taskContainer = $(category + "-tasks");
      taskContainer.empty();
      taskContainer.addClass('task-grid-container');
    }
    const tasks = await getTasks(category);

    const filteredTasks = showOnlyPending ? tasks.filter(task => task.status === 'pending') : tasks;

    if (filteredTasks.length === 0) {
      $("#noTasksMessage").show();
    } else {
      $("#noTasksMessage").hide();
    }

    if (category === "#all-todos") {
      filteredTasks.forEach(task => {
        const categoryClass = getCategoryClass(task.category);
        const cardHtml = `
          <div class="col-md-3 col-sm-6 mb-4">
              <div class="card ${categoryClass}">
                  <div class="card-body">
                      <h5 class="card-title">${task.category}</h5>
                      <ul class="list-unstyled">
                          <li class="task-item bg-white">
                              <div class="task-text">
                                  <input type="checkbox" class="task-title" ${task.status === 'completed' ? 'checked' : ''} /> ${task.title}
                                  <p class="task-description">${task.description}</p>
                                  <p class="task-description">DueDate: ${formatDate(task.dueDate)}</p>
                              </div>
                              <div class="task-icons">
                                  <i class="fas fa-edit" data-task-id="${task._id}"></i>
                                  <i class="fas fa-trash" data-task-id="${task._id}"></i>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
        `;
        taskContainer.append(cardHtml);
      });
    } else {
      const tasksByCategory = filteredTasks.reduce((acc, task) => {
        if (!acc[task.category]) {
          acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
      }, {});

      for (const [category, tasks] of Object.entries(tasksByCategory)) {
        tasks.forEach(task => {
          const categoryClass = getCategoryClass(category);
          const cardHtml = `
              <div class="col-md-3 col-sm-6 mb-4">
                  <div class="card ${categoryClass}">
                      <div class="card-body">
                          <h5 class="card-title">${category}</h5>
                          <ul class="list-unstyled">
                              <li class="task-item bg-white">
                                  <div class="task-text">
                                      <input type="checkbox" class="task-title" ${task.status === 'completed' ? 'checked' : ''} /> ${task.title}
                                      <p class="task-description">${task.description}</p>
                                      <p class="task-description">DueDate: ${formatDate(task.dueDate)}</p>
                                  </div>
                                  <div class="task-icons">
                                      <i class="fas fa-edit" data-task-id="${task._id}"></i>
                                      <i class="fas fa-trash" data-task-id="${task._id}"></i>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          `;
          taskContainer.append(cardHtml);
        });
      }
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = (`${date.getFullYear()}`).slice(-2);
    return `${day}/${month}/${year}`;
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
    const token = getCookie('token');
    if (!token) {
      return [];
    }

    try {
      const response = await fetch(`/api/todos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        return [];
      }

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

  $('#addTaskButton').on('click', async function () {
    const taskData = {
      title: $('#taskTitle').val(),
      dueDate: $('#dueDate').val(),
      description: $('#description').val(),
      category: $('#category').val(),
    };

    try {
      const response = await fetch('/api/todos/createtodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      console.error('Error creating task:', error);
    }
  });

  $('#addTaskModal').on('show.bs.modal', function (event) {
    const activeTab = $("ul.nav-tabs li a.active").attr("href");
    const category = activeTab ? activeTab.substring(1) : null;

    if (category && category !== 'all-todos') {
      $('#category').val(category).prop('disabled', true);
    } else {
      $('#category').val('Personal').prop('disabled', false);
    }
  });

  $('#addTaskModal').on('hidden.bs.modal', function () {
    $('#category').prop('disabled', false);
  });

  $(document).on("click", ".task-icons .fa-edit", async function () {
    const taskId = $(this).data("task-id");

    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const task = await response.json();

      $('#taskTitle').val(task.title);
      $('#dueDate').val(task.dueDate);
      $('#description').val(task.description);
      $('#category').val(task.category).prop('disabled', true);
      $('#addTaskButton').hide();
      $('#updateTaskButton').data('task-id', taskId).show();

      $('#addTaskModal').modal('show');
    } catch (error) {
      console.error('Error fetching task for edit:', error);
    }
  });

  $('#updateTaskButton').on('click', async function () {
    const taskId = $(this).data('task-id');
    const taskData = {
      title: $('#taskTitle').val(),
      dueDate: $('#dueDate').val(),
      description: $('#description').val(),
      category: $('#category').val(),
    };

    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      console.error('Error updating task:', error);
    }
  });

  $('#showPendingTasks').on('change', function () {
    showOnlyPending = $(this).is(':checked');
    const activeTab = $("ul.nav-tabs li a.active").attr("href");
    loadTasks(activeTab);
  });

  $(document).on('click', '.task-icons .fa-trash', async function () {
    const taskId = $(this).data('task-id');

    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const activeTab = $("ul.nav-tabs li a.active").attr("href");
      loadTasks(activeTab);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  function triggerConfettiCannon() {
    confetti({
      angle: 60,
      spread: 55,
      particleCount: 150,
      origin: { x: 0 },
    });
    
    confetti({
      angle: 120,
      spread: 55,
      particleCount: 150,
      origin: { x: 1 },
    });
  }
  $(document).on('change', '.task-title', async function (event) {
    event.preventDefault();
    const taskItem = $(this).closest('.task-item');
    const taskId = taskItem.find('.fa-edit').data('task-id');
    const newStatus = $(this).is(':checked') ? 'completed' : 'pending';
  
    taskItem.toggleClass('completed-task', $(this).is(':checked'));
  
    const taskText = $(this).closest('.card');
    if ($(this).is(':checked')) {
      taskText.removeClass('glow-red').addClass('glow-green');
      triggerConfettiCannon();
    } else {
      taskText.removeClass('glow-green').addClass('glow-red');
    }
  
    setTimeout(() => {
      taskText.removeClass('glow-green glow-red');
    }, 500);
  
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      $(this).prop('checked', !$(this).is(':checked'));
      taskItem.toggleClass('completed-task', $(this).is(':checked'));
      alert('Failed to update the task status. Please try again.');
    }
  });
  
  async function updateTaskStatus(taskId, status) {
    try {
      const response = await fetch(`/api/todos/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }
});

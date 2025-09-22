
const TODO_STORAGE_KEY = 'flanny-sm-todo';

(function () {
  const today = (new Date()).toISOString().split('T')[0];
  const storageChecklist = StorageUtil.load(TODO_STORAGE_KEY);
  let checklist = {
    day: today,
    tasks: []
  }

  if (storageChecklist && 'day' in storageChecklist && storageChecklist.day === today && 'tasks' in checklist) {
    // if the checklist is today then use it
    checklist = storageChecklist;
  } else {
    // otherwise remove the stored data
    StorageUtil.remove(TODO_STORAGE_KEY);
  }

  // init all the checkboxes
  $('input[type="checkbox"]').each(function () {
    const task = $(this).attr('data-checklist');
    if (checklist.tasks.includes(task)) {
      $(this).prop('checked', true)
    }
  })

  // add a listener for the change
  $('input[type="checkbox"]').change(function () {
    const task = $(this).attr('data-checklist');
    if ($(this).is(':checked')) {
      checklist.tasks.push(task)
    } else {
      checklist.tasks = checklist.tasks.filter(t => t !== task);
    }
    StorageUtil.save(TODO_STORAGE_KEY, checklist);
  })

})();

const TODO_STORAGE_KEY = 'flanny-sm-todo';

(function () {
  const today = (new Date()).toISOString().split('T')[0];
  const storageChecklist = StorageUtil.load(TODO_STORAGE_KEY);
  let checklist;

  // on load check the storage
  if (storageChecklist && storageChecklist.day !== today) {
    StorageUtil.remove(TODO_STORAGE_KEY);
  } else if (storageChecklist) {
    checklist = storageChecklist;
  } else {
    checklist = {
      day: today,
      tasks: []
    }
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
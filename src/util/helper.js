export function isFirstTaskInList(taskItem, taskItems) {
  const allTasksInList = filterTaskItemsForList(taskItems, taskItem.task_list_id)
  return allTasksInList[0] == taskItem
}

export function targetListHasItemInSamePosition(taskItem, targetItems) {
  return targetItems.find((item) => {
    return item.position === taskItem.position
  })
}

export function getItemsWithPositionGreaterThan(taskItem, targetItems) {
  return targetItems.filter((item) => {
    return item.position >= taskItem.position
  })
}

export function getItemsWithPositionLesserThan(taskItem, targetItems) {
  return targetItems.filter((item) => {
    return item.position < taskItem.position
  })
}

export const filterTaskItemsForList = function(taskItems, taskListId) {
  const taskItemsArray = Object.values(taskItems)

  const filteredItems = taskItemsArray.filter((taskItem) => {
    return taskItem.task_list_id === taskListId
  })

  return filteredItems.sort((p,n) => {
    return p.position > n.position ? 1 : -1
  })
}

export const convertArrayToIdValueObject = function(array) {
  return array.reduce((acc, obj) => {
    acc[obj.id] = obj
    return acc
  }, {})
}

export async function getTaskLists () {
  return {
    1: {
      id: 1,
      name: 'My first list',
      color: 'green',
    },
    2: {
      id: 2,
      name: 'My second list',
      color: 'blue',
    },
    3: {
      id: 3,
      name: 'My third list',
      color: 'yellow',
    }
  }
}

export async function getTaskItems () {
  return {
    1: {
      id: 1,
      name: 'My first item',
      position: 0,
      task_list_id: 1,
    },
    2: {
      id: 2,
      name: 'My second item',
      position: 1,
      task_list_id: 1,
    },
    3: {
      id: 3,
      name: 'My third item',
      position: 2,
      task_list_id: 1,
    },
    4: {
      id: 4,
      name: 'Another task',
      position: 1,
      task_list_id: 2,
    },
    5: {
      id: 5,
      name: 'Extra task',
      position: 1,
      task_list_id: 3,
    },
  }
}

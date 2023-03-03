import { useState, useEffect } from 'react'
import { getTaskLists, getTaskItems } from '../client/api'

const TaskList = ({ taskList, taskItems, onUpdateTaskItem, onCreateTaskItem }) => {
  return (
    <div className='border border-solid border-grey-200 shadow-md bg-white'>
      <h2 className='p-4' style={{ backgroundColor: taskList.color }}>{taskList.name}</h2>
      <div className='p-4'>
        {taskItems.map((taskItem) => (
          <div className='flex gap-4 mb-2' key={taskItem.id}>
            <div>
              <button
                className='bg-gray-200 p-2'
                type="button"
                onClick={(e) => { onUpdateTaskItem(taskItem, -1) }}
              >
                &lt;
              </button>
            </div>
            <div key={taskItem.id}>
              {taskItem.name}
            </div>
            <div>
              <button
                className='bg-gray-200 p-2'
                type="button"
                onClick={(e) => { onUpdateTaskItem(taskItem, +1) }}
              >
                &gt;
              </button>
            </div>
          </div>
        ))}
        <button
          className='bg-gray-200 p-2 w-full'
          onClick={e => {
            const name = prompt('Task name?')
            onCreateTaskItem({
              id: crypto.randomUUID(),
              name,
              task_list_id: taskList.id,
            })
          }}
        >
          Add task
        </button>
      </div>
    </div>
  )
}

const filterTaskItemsForList = function(taskItems, taskListId) {
  const taskItemsArray = Object.values(taskItems)

  const filteredItems = taskItemsArray.filter((taskItem) => {
    return taskItem.task_list_id === taskListId
  })

  return filteredItems.sort((p,n) => {
    return p.position > n.position ? 1 : -1
  })
}

export default function Home () {
  const [taskLists, setTaskLists] = useState([])
  const [taskItems, setTaskItems] = useState([])

  useEffect(() => {
    const fetchTaskLists = async () => {
      const response = await getTaskLists()
      setTaskLists(response)
    }

    const fetchTaskItems = async () => {
      const response = await getTaskItems()
      setTaskItems(response)
    }

    fetchTaskLists()
    fetchTaskItems()
  }, [])

  function isFirstTaskInList(taskItem) {
    const allTasksInList = filterTaskItemsForList(taskItems, taskItem.task_list_id)
    return allTasksInList[0] == taskItem
  }

  function onUpdateTaskItem( taskItem, offset ) {
    const taskListsArray = Object.values(taskLists)
    const taskItemListIndex = taskListsArray.findIndex((taskList) => {
      return taskList.id === taskItem.task_list_id
    })
    const targetList = taskListsArray[taskItemListIndex + offset]

    if (isFirstTaskInList(taskItem)) {
      const allTasksInTargetList = filterTaskItemsForList(taskItems, targetList.id)

      const updatedItemsArray = allTasksInTargetList.filter ((item) => {
        return item.id != taskItem.id
      })

      const mappedUpdatedItemsArray = updatedItemsArray.map((item) => {
        return {
          ...item,
          position: 0,
        }
      }).map((item) => {
        return {
          ...item,
          position: item.position + 1,
        }
      })

      const updatedItems = mappedUpdatedItemsArray.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})

      const newValue = {
        ...taskItems,
        ...updatedItems,
        [taskItem.id]: {
          ...taskItem,
          task_list_id: taskListsArray[taskItemListIndex + offset].id,
          position: 0,
        }
      }

      console.log('updated', newValue)

      setTaskItems(newValue)
    } else {
      setTaskItems({
        ...taskItems,
        [taskItem.id]: {
          ...taskItem,
          task_list_id: taskListsArray[taskItemListIndex + offset].id,
        }
      })
    }
  }

  function onCreateTaskItem(taskItem) {
    setTaskItems({
      ...taskItems,
      [taskItem.id]: taskItem,
    })
  }

  return (
    <div className="m-20 bg-white p-10">
      <h1>Task Lists</h1>

      <div className='flex gap-5 mt-6'>
        {Object.values(taskLists).map((taskList) => (
          <div key={taskList.id}>
            <TaskList
              taskList={taskList}
              taskItems={filterTaskItemsForList(taskItems, taskList.id)}
              onCreateTaskItem={onCreateTaskItem}
              onUpdateTaskItem={onUpdateTaskItem}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

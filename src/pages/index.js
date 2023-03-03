import { useState, useEffect } from 'react'
import { getTaskLists, getTaskItems } from '../client/api'
import TaskList from '../components/task_list'

import {
  isFirstTaskInList,
  targetListHasItemInSamePosition,
  getItemsWithPositionGreaterThan,
  getItemsWithPositionLesserThan,
  filterTaskItemsForList,
  convertArrayToIdValueObject
} from '../util/helper'

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

  function rebuildItemsWhenMovingFromFirstPosition ({
    taskItem,
    allTaskItemsInTargetList,
    taskListId,
  }) {
    // Recalculate TaskItem positions in the target list
    return convertArrayToIdValueObject(
      [taskItem, ...allTaskItemsInTargetList].map((item, index) => ({
        ...item,
        position: index,
        task_list_id: taskListId,
      }))
    )
  }

  function rebuildItemsWhenMovingFromInnerPositions ({
    taskItem,
    allTaskItemsInTargetList,
    taskListId,
  }) {
    // Rebuild the final Task Item order and recalculate positions for the whole list
    return convertArrayToIdValueObject(
      [
        ...getItemsWithPositionLesserThan(taskItem, allTaskItemsInTargetList),
        taskItem,
        ...getItemsWithPositionGreaterThan(taskItem, allTaskItemsInTargetList)
      ].map((item, index) => {
        return {
          ...item,
          position: index,
          task_list_id: taskListId,
        }
      })
    )
  }

  function rebuildItemsWhenMovingFromBiggerLists ({
    taskItem,
    allTaskItemsInTargetList,
    taskListId,
  }) {
    // Recalculate the Task Item positions in the target list after adding the moved item
    return convertArrayToIdValueObject(
      [...allTaskItemsInTargetList, taskItem].map((item, index) => {
        return {
          ...item,
          position: index,
          task_list_id: taskListId,
        }
      })
    )
  }

  async function onUpdateTaskItem({ taskItem, sourceList, offset }) {
    const taskListsArray = Object.values(taskLists)
    const indexOfTargetList = taskListsArray.findIndex((taskList) => ( taskList.id === taskItem.task_list_id ))
    const targetList = taskListsArray[indexOfTargetList + offset]
    const allTaskItemsInTargetList = filterTaskItemsForList(taskItems, targetList.id)
    const sourceListItemsChanges = convertArrayToIdValueObject(
      filterTaskItemsForList(taskItems, sourceList.id).filter((item) => (
        item.id !== taskItem.id
      )).map((item, index) => ({ ...item, position: index }))
    )
    let targetListItemsChanges = {}

    if (isFirstTaskInList(taskItem, taskItems)) {
      targetListItemsChanges = rebuildItemsWhenMovingFromFirstPosition({
        taskItem,
        allTaskItemsInTargetList,
        taskListId: targetList.id
      })
    } else if(targetListHasItemInSamePosition(taskItem, allTaskItemsInTargetList)) {
      targetListItemsChanges = rebuildItemsWhenMovingFromInnerPositions({
        taskItem,
        allTaskItemsInTargetList,
        taskListId: targetList.id
      })
    } else {
      targetListItemsChanges = rebuildItemsWhenMovingFromBiggerLists({
        taskItem,
        allTaskItemsInTargetList,
        taskListId: targetList.id
      })
    }

    setTaskItems({
      ...taskItems,
      ...sourceListItemsChanges,
      ...targetListItemsChanges,
    })
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

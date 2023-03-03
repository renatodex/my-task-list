export default function TaskList ({ taskList, taskItems, onUpdateTaskItem, onCreateTaskItem }) {
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
                onClick={(e) => {
                  onUpdateTaskItem({
                    taskItem,
                    sourceList: taskList,
                    offset: -1
                  }
                )}}
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
                onClick={(e) => {
                  onUpdateTaskItem({
                    taskItem,
                    sourceList: taskList,
                    offset: +1
                  }
                )}}
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

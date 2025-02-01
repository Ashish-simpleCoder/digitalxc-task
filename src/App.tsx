import { useMutation, useQuery } from '@tanstack/react-query'
import { If } from 'classic-react-components'
import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import AddNewTaskModal from './components/CreateNewTaskModal'
import TaskBoard from './components/TaskBoard'

export type Task = {
   id?: string
   title: string
   description?: string
}

type TaskSequence = {
   todo_ids: number[]
   in_progress_ids: number[]
   done_ids: number[]
}

export type SequenceKeys = keyof TaskSequence

export default function App() {
   const [task_sequences, setTaskSequences] = useState<TaskSequence>({
      todo_ids: [],
      done_ids: [],
      in_progress_ids: [],
   })

   const { data: taskSequence, refetch: refetchTasksSequence } = useQuery<TaskSequence>({
      queryKey: ['fetch-tasks-sequence'],
      queryFn: () => {
         return fetch('http://localhost:3000/tasks-sequence').then((res) => res.json())
      },
      refetchInterval: false,
   })
   const [isTaskModalOpen, setOpenTaskModal] = useState(false)

   const { data: allTasks, refetch: refetchAllTasks } = useQuery({
      queryKey: ['fetch-all-tasks'],
      queryFn: () => {
         return fetch('http://localhost:3000/tasks').then((res) => res.json())
      },
   })

   // mutations
   const { mutate: updateTask } = useMutation({
      mutationKey: ['update-task-sequence'],
      mutationFn: (new_sequence: TaskSequence) => {
         return fetch('http://localhost:3000/tasks-sequence', {
            method: 'POST',
            body: JSON.stringify({ new_tasks_sequence: new_sequence }),
            headers: {
               'Content-Type': 'application/json',
            },
         })
      },
   })

   // create new task
   const { mutate: createNewTask, isPending: isAddingNewTask } = useMutation({
      mutationKey: ['delete-task-sequence'],
      mutationFn: (props: { new_task: Task; task_type: SequenceKeys }) => {
         return fetch('http://localhost:3000/tasks', {
            method: 'POST',
            body: JSON.stringify(props),
            headers: {
               'Content-Type': 'application/json',
            },
         })
      },
      onSuccess: () => {
         setOpenTaskModal(false)
         refetchTasksSequence()
         refetchAllTasks()
      },
   })

   const onDragEnd = (result: DropResult) => {
      const { destination, source } = result

      if (!taskSequence) return
      if (!destination) {
         return
      }

      // item is dropped in the same place, then do nothing
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
         return
      }
      // console.log({ result })
      // return

      const startColumn: SequenceKeys = source.droppableId as SequenceKeys
      const finishColumn: SequenceKeys = destination.droppableId as SequenceKeys

      let newTaskSequence: TaskSequence | null = null

      // if dropped in same column
      if (startColumn === finishColumn) {
         const newTaskIds = Array.from(taskSequence[startColumn])
         newTaskIds.splice(source.index, 1)
         newTaskIds.splice(destination.index, 0, Number(result.draggableId))

         setTaskSequences((_sequence) => {
            _sequence[startColumn] = newTaskIds
            newTaskSequence = _sequence
            return { ..._sequence }
         })
      } else {
         // if dropped in different column

         const startTaskIds = Array.from(task_sequences[startColumn])

         // console.log('before',startTaskIds)

         startTaskIds.splice(source.index, 1)

         const finishTaskIds = Array.from(task_sequences[finishColumn])
         // console.log('before',finishTaskIds)

         finishTaskIds.splice(destination.index, 0, Number(result.draggableId))

         // console.log("after",startTaskIds, finishTaskIds , result)

         setTaskSequences((_sequence) => {
            _sequence[startColumn] = startTaskIds
            _sequence[finishColumn] = finishTaskIds
            newTaskSequence = _sequence
            return { ..._sequence }
         })
      }
      // update in json data
      if (newTaskSequence) {
         updateTask(newTaskSequence)
      }
   }

   useEffect(() => {
      if (taskSequence) {
         setTaskSequences(taskSequence)
      }
   }, [taskSequence])

   return (
      <div>
         <h1 className='text-2xl px-4 py-4 text-center font-medium'>Kanban board</h1>

         <button
            onClick={() => {
               setOpenTaskModal(true)
            }}
            className='fixed bottom-4 right-4 bg-purple-700 px-3 py-2 rounded-full text-white'
         >
            + Create new task
         </button>

         <If condition={isTaskModalOpen}>
            <AddNewTaskModal
               isOpen={isTaskModalOpen}
               isAdding={isAddingNewTask}
               onRequestClose={() => setOpenTaskModal(false)}
               onSave={(new_task, task_type) => createNewTask({ new_task, task_type })}
            />
         </If>

         <div className='flex flex-row gap-5 px-4 bg-gray-100 mb-6'>
            {allTasks && (
               <DragDropContext onDragEnd={onDragEnd}>
                  <TaskBoard
                     droppableId='todo_ids'
                     taskList={allTasks}
                     taskIds={task_sequences?.todo_ids}
                     heading='Todos'
                     className=' bg-[#FF5733]'
                  />
                  <TaskBoard
                     droppableId='in_progress_ids'
                     taskList={allTasks}
                     taskIds={task_sequences?.['in_progress_ids']}
                     heading='In-progress'
                     className=' bg-[#33C1FF]'
                  />

                  <TaskBoard
                     droppableId='done_ids'
                     taskList={allTasks}
                     taskIds={task_sequences?.done_ids}
                     heading='Done'
                     className=' bg-[#4CAF50]'
                  />
               </DragDropContext>
            )}
         </div>
      </div>
   )
}

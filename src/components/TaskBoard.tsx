import { For } from 'classic-react-components'
import { ComponentProps } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { SequenceKeys, Task } from '../App'
import TaskItem from './Task'
import { MdDelete } from 'react-icons/md'
import { useMutation } from '@tanstack/react-query'
import { ApiQueryClient } from '../main'

export default function TaskBoard(props: {
   className?: ComponentProps<'div'>['className']
   taskList: Record<string, Task>
   heading: string
   taskIds: number[]
   droppableId: SequenceKeys
}) {
   const { mutate: deleteTask } = useMutation({
      mutationKey: ['delete-task'],
      mutationFn: (task_id: number) => {
         return fetch(`http://localhost:3000/tasks/${task_id}`, {
            method: 'DELETE',
            body: JSON.stringify({ task_type: props.droppableId }),
            headers: {
               'Content-Type': 'application/json',
            },
         })
      },
      onSuccess: () => {
         //@ts-ignore
         ApiQueryClient.invalidateQueries(['fetch-tasks-sequence'])
         //@ts-ignore
         ApiQueryClient.invalidateQueries(['fetch-all-tasks'])
      },
   })
   return (
      <Droppable droppableId={props.droppableId}>
         {(provided) => {
            return (
               <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-sm w-[300px]  mt-4  ${props.className}`}
               >
                  <h2 className='text-lg text-center border-b-[1px] py-2'>{props.heading}</h2>

                  <div role='listbox' className='flex flex-col gap-3 mx-4 py-6'>
                     <For data={props.taskIds}>
                        {(task_id, idx) => {
                           return (
                              <TaskItem key={task_id} {...props.taskList[task_id]} idx={idx}>
                                 <button
                                    className='absolute bottom-2 right-2 text-red-500'
                                    onClick={() => deleteTask(task_id)}
                                 >
                                    <MdDelete />
                                 </button>
                              </TaskItem>
                           )
                        }}
                     </For>
                  </div>

                  {provided.placeholder}
               </div>
            )
         }}
      </Droppable>
   )
}

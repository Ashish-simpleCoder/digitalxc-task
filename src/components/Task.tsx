import { If } from 'classic-react-components'
import { Draggable } from 'react-beautiful-dnd'
import type { Task } from '../App'
import { ReactNode } from 'react'

export default function TaskItem({
   id,
   title,
   description,
   idx,
   children,
}: Task & { idx: number; children: ReactNode }) {
   return (
      <Draggable draggableId={id + ''} index={idx}>
         {(provided) => {
            return (
               <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  role='listitem'
                  className='h-[120px] w-full relative cursor-move bg-white rounded-md flex flex-col '
                  style={{
                     userSelect: 'none',
                     ...provided.draggableProps.style,
                  }}
               >
                  <span className='text-center py-1 border-b-[1px]'>{title}</span>
                  <If condition={description}>
                     <span className='px-2'>{description}</span>
                  </If>
                  {children}
               </div>
            )
         }}
      </Draggable>
   )
}

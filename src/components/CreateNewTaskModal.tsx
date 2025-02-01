import React, { useState } from 'react'
import Loader from './Loader'
import { SequenceKeys } from '../App'

interface TaskModalProps {
   isOpen: boolean
   isAdding: boolean
   onRequestClose: () => void
   onSave: (task: { title: string; description: string }, task_type: SequenceKeys) => void
}

export default function AddNewTaskModal({ isOpen, onRequestClose, onSave, isAdding }: TaskModalProps) {
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [status, setStatus] = useState<SequenceKeys>('todo_ids') // Default status

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({ title, description }, status)
   }

   if (!isOpen) return null

   return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
         <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
            <h2 className='text-xl font-semibold mb-4 text-center'>Add New Task</h2>
            <form onSubmit={handleSubmit}>
               <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1'>
                     Title
                     <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                     />
                  </label>
               </div>
               <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1'>
                     Description
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                     />
                  </label>
               </div>
               <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1'>
                     Status
                     <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as SequenceKeys)}
                        className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                     >
                        <option value='todo_ids'>To-Do</option>
                        <option value='in_progress_ids'>In Progress</option>
                        <option value='done_ids'>Done</option>
                     </select>
                  </label>
               </div>
               <div className='flex justify-end gap-2'>
                  <button type='button' onClick={onRequestClose} className='bg-gray-300 rounded-md px-4 py-2'>
                     Cancel
                  </button>
                  <button type='submit' className='bg-purple-600 text-white rounded-md px-4 py-2 '>
                     {isAdding ? <Loader /> : 'Save'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}

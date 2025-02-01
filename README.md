kanban board


### Running project locally

- run `pnpm i` & `pnpm dev` on root folder for react app. It will be `http://localhost:5173`
- goto `cd sever`, then `pnpm i` and run `pnpm dev` to start backend api server. It will be `http://localhost:3000`



### Approach for developing



#### Tech stack
- `react-beautiful-dnd` for drag-n-drop feature.
- `React-Query` for data fetching
- `React-icons` for icons
- `Tailwind` Css for styling


#### Data Structure of the todo task
- Have created in-memory object for todos. `tasks` and `tasksSequence`. Where `tasks` stores all of the task and `tasksSequence` stores all of the sequence/position of the task for particular type of task (like todo, in-progress, and done types of tasks).
- Storing the todo tasks id in `tasksSequence['todo_ids']`, in-progress in `tasksSequence['in_progress_ids']` and done tasks in `tasksSequence['done_ids']`.


- When dragging and dropping the items, we just update `tasksSequence` with new sequences. 
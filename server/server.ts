import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors())

interface Task {
    id: number;
    title: string;
    description: string;
}

interface Tasks {
    [key: string]: Task;
}

interface TasksSequence {
    todo_ids: number[];
    in_progress_ids: number[];
    done_ids: number[];
}

let tasks: Tasks = {
    "1": { "id": 1, "title": "Grocery Shopping", "description": "Buy fruits and vegetables" },
    "2": { "id": 2, "title": "Project Meeting", "description": "Discuss project updates with the team" },
    "3": { "id": 3, "title": "Gym Workout", "description": "Complete the strength training routine" },
    "4": { "id": 4, "title": "Read a Book", "description": "Finish reading 'The Great Gatsby'" },
    "5": { "id": 5, "title": "Laundry", "description": "Wash and fold clothes" },
    "6": { "id": 6, "title": "Clean the House", "description": "Vacuum and dust all rooms" },
    "7": { "id": 7, "title": "Prepare Dinner", "description": "Cook pasta and salad for dinner" },
    "8": { "id": 8, "title": "Plan Weekend Trip", "description": "Research destinations and book accommodations" }
}


let tasksSequence: TasksSequence = {
    todo_ids: [1, 2, 3],
    in_progress_ids: [4, 5, 6, 7, 8],
    done_ids: []
};

// Get all tasks
app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks);
});

// Get a single task by ID
app.get('/tasks/:id', (req: Request, res: Response) => {
    const task = tasks[req.params.id];
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Create a new task
app.post('/tasks', (req: Request, res: Response) => {
    const newTask: Task = req.body.new_task;
    const id = Object.keys(tasks).length + 1;
    newTask.id = id;
    tasks[id] = newTask;
    console.log(req.body)
    // @ts-ignore
    tasksSequence[req.body.task_type].push(id)
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    if (tasks[taskId]) {
        tasks[taskId] = { ...tasks[taskId], ...req.body };
        res.json(tasks[taskId]);
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    if (tasks[taskId]) {
        delete tasks[taskId];
        //@ts-ignore
        tasksSequence[req.body.task_type] = tasksSequence[req.body.task_type].filter((task_id)=> task_id != req.params.id)
        res.status(204).send();
    } else {
        res.status(404).send('Task not found');
    }
});

// Get task sequences
app.get('/tasks-sequence', (req: Request, res: Response) => {
    res.json(tasksSequence);
});

// update task sequences
app.post('/tasks-sequence', (req: Request, res: Response) => {
    tasksSequence = req.body.new_tasks_sequence
    res.json(tasksSequence);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

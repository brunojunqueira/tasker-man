import { TaskManager } from './deprecated/TaskManager';
import { createTask } from './Task';
import { createTaskManager } from './TaskManager';
import { Task, TaskCallback, TaskOptions, TaskStatus } from './types';

/**
 * @deprecated Use createTaskManager instead.
 */
const TaskerMan = new TaskManager();

export { TaskerMan, createTask, createTaskManager, Task, TaskCallback, TaskOptions, TaskStatus };

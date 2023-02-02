import { TaskManager } from './deprecated/TaskManager';
import { createTask } from './Task';
import { createTaskManager } from './TaskManager';

/**
 * @deprecated Use createTaskManager instead.
 */
const TaskerMan = new TaskManager();

export { TaskerMan, createTask, createTaskManager };

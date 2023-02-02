import { TaskType } from './Task';

interface TaskStack {
  id: number;
  running: boolean;
  task: TaskType;
}

class TaskManager {
  private idCounter = 0;
  private tasks: TaskStack[] = [];

  constructor(...tasks: TaskType[]) {
    if (tasks.length > 0) {
      this.append(...tasks);
    }
  }
  /**
   * @brief Add a task on TaskManager.
   * @param tasks Tasks you want to add on TaskManager.
   */
  append(...tasks: TaskType[]) {
    tasks.map((task) => {
      const stack = { id: this.idCounter, running: false, task };
      task.onTaskStop.add((event) => {
        stack.running = !(event.target.getTimesLeft() === 0);
      });
      this.tasks.push(stack);
      this.idCounter++;
    });
  }
  /**
   * @brief Remove a task from TaskManager by id.
   * @param taskID The task ID.
   */
  remove(taskID: number) {
    let taskIndex: number | null = null;
    this.tasks.map((task, index) => {
      if (task.id === taskID) taskIndex = index;
    });
    if (taskIndex) {
      this.tasks = [...this.tasks.slice(0, taskIndex), ...this.tasks.slice(taskIndex + 1)];
    } else {
      throw Error(`Task #${taskID} does not exist.`);
    }
  }
  /**
   * @brief Start a task by id.
   * @param taskID The task ID.
   */
  async start(taskID: number) {
    const [{ running, task }] = this.tasks.filter((_task) => {
      if (_task.id === taskID) return _task;
    });
    if (!task) {
      throw Error('#' + taskID + ' - Task does not exist!');
    }
    if (!running) task.start();
  }

  /**
   * @brief Abort a task execution by the task id.
   * @param taskID The task ID.
   */
  async abort(taskID: number) {
    const [{ running, task }] = this.tasks.filter((_task) => {
      if (_task.id === taskID) return _task;
    });
    if (!task) throw Error('#' + taskID + ' - Task does not exist!');
    if (!running) {
      throw Error('#' + taskID + ' - Task is already stopped!');
    }
    task.abort();
  }

  /**
   * @brief Get a task on TaskManager by id.
   * @returns a Task.
   */
  task(taskID: number): TaskType {
    const [{ task }] = this.tasks.filter((_task) => {
      if (_task.id === taskID) return _task;
    });
    return task;
  }
  /**
   * Get all tasks on TaskManager with a especific name.
   * @returns a Task array.
   */
  getIdsByName(name: string): number[] {
    const stacks = this.tasks.filter(({ task }) => {
      if (task.name === name) return task;
    });
    const tasks = stacks.map(({ id }) => id);
    return tasks;
  }

  /**
   * Get all tasks on TaskManager with a especific name.
   * @returns a Task array.
   */
  getTasksByName(name: string): TaskType[] {
    const stacks = this.tasks.filter(({ task }) => {
      if (task.name === name) return task;
    });
    const tasks = stacks.map(({ task }) => task);
    return tasks;
  }
  /**
   * Get all active tasks running in TaskManager.
   * @returns a Task array.
   */
  activeTasks(): TaskType[] {
    const stacks = this.tasks.filter((stack) => {
      if (stack.running) return stack;
    });
    const tasks = stacks.map(({ task }) => task);

    return tasks;
  }
  /**
   * Get all inactive tasks running in TaskManager.
   * @returns a Task array.
   */
  inactiveTasks(): TaskType[] {
    const stacks = this.tasks.filter((stack) => {
      if (!stack.running) return stack;
    });
    const tasks = stacks.map(({ task }) => task);

    return tasks;
  }
}
/**
 * @brief Create a new Task Manager.
 * @param [...tasks] - Tasks to append on TaskManager.
 * @returns a new TaskManager instance.
 */
function createTaskManager(...tasks: TaskType[]): TaskManager {
  return new TaskManager(...tasks);
}

export { createTaskManager };

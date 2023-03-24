import { Task as TaskType } from './types';
import { Task } from './Task';

interface TaskStack {
  running: boolean;
  task: TaskType;
}

interface TaskInfo {
  id: number;
  running: boolean;
  name: string;
  timesLeft: string | number;
  interval: string | number;
}

class TaskManager {
  private stacks: TaskStack[] = [];

  constructor(...tasks: TaskType[]) {
    if (tasks.length > 0) {
      this.append(...tasks);
    }
  }

  /**
   * Add a task on TaskManager.
   * @param tasks Tasks you want to add on TaskManager.
   */
  append(...tasks: TaskType[]) {
    tasks.forEach((task) => {
      const stack = { running: false, task };
      task.onTaskStop.add((event) => {
        stack.running = !(event.target.getTimesLeft() === 0);
      });

      this.stacks.push(stack);
    });
  }

  /**
   * Remove a task from TaskManager by id.
   * @param taskID The task ID.
   */
  remove(taskID: number) {
    const index = this.stacks.findIndex(({ task }) => task.id === taskID);

    if (!index) {
      throw Error('#' + taskID + ' - Task does not exist!');
    }

    this.stacks = [...this.stacks.slice(0, index), ...this.stacks.slice(index + 1)];
  }

  /**
   * Start a task by id.
   * @param taskID The task ID.
   */
  async start(taskID: number) {
    const stack = this.stacks.find(({ task }) => task.id === taskID);

    if (!stack) {
      throw Error('#' + taskID + ' - Task does not exist!');
    }
    if (!stack.running) stack.task.start();
  }

  /**
   * Starts all tasks that are not running at the moment.
   */
  async startAll() {
    this.stacks.map((stack) => {
      if (!stack.running) stack.task.start();
    });
  }

  /**
   * Abort a task execution by the task id.
   * @param taskID The task ID.
   */
  async abort(taskID: number) {
    const stack = this.findStack(taskID);
    if (!stack.running) {
      throw Error('#' + taskID + ' - Task is already stopped!');
    }
    stack.task.abort();
  }

  /**
   * Get a task on TaskManager by id.
   * @returns a Task.
   */
  task(taskID: number): TaskType {
    const stack = this.findStack(taskID);
    if (!stack) throw Error('#' + taskID + ' - Task does not exist!');
    return stack.task;
  }

  /**
   * Get all tasks on `TaskManager` and formats it in a more readable way.
   * @returns the tasks controlled by this `TaskManager`.
   */
  getTasks(): TaskInfo[] {
    return this.stacks.map<TaskInfo>((t) => {
      let name = `Task #${t.task.id}`;

      if (t.task.name) name = t.task.name;
      return {
        id: t.task.id,
        name,
        running: t.running,
        timesLeft: t.task.getTimesLeft(),
        interval: t.task.interval,
      };
    });
  }

  /**
   * Return tasks stack of this instance.
   * @returns the tasks stacks.
   */
  getTasksStack(): TaskStack[] {
    return this.stacks;
  }

  /**
   * Get all tasks on TaskManager with a especific name.
   * @returns a Task array.
   */
  getIdsByName(name: string): number[] {
    const stacks = this.stacks.filter(({ task }) => {
      if (task.name === name) return task;
    });
    return stacks.map<number>(({ task }) => task.id);
  }

  /**
   * Get all tasks on TaskManager with a especific name.
   * @returns a Task array.
   */
  getTasksByName(name: string): TaskType[] {
    const stacks = this.stacks.filter(({ task }) => {
      if (task.name === name) return task;
    });
    const tasks = stacks.map(({ task }) => task);
    return tasks;
  }

  /**
   * Get all active tasks running in TaskManager.
   * @returns a Task array.
   */
  activeTasks(): TaskInfo[] {
    // filter stack by tasks that are running
    const stacks = this.stacks.filter((stack) => stack.running);
    return stacks.map<TaskInfo>(({ task }) => {
      let name = `Task #${task.id}`;

      if (task.name) name = task.name;

      return {
        id: task.id,
        name,
        running: true,
        timesLeft: task.getTimesLeft(),
        interval: task.interval,
      };
    });
  }

  /**
   * Get all inactive tasks running in TaskManager.
   * @returns a Task array.
   */
  inactiveTasks(): TaskInfo[] {
    // filter stack by tasks that are not running
    const stacks = this.stacks.filter((stack) => !stack.running);
    return stacks.map<TaskInfo>(({ task }) => {
      let name = `Task #${task.id}`;

      if (task.name) name = task.name;

      return {
        id: task.id,
        name,
        running: true,
        timesLeft: task.getTimesLeft(),
        interval: task.interval,
      };
    });
  }

  /**
   * Shorthand for find a task by its id on the task stack. Throws an error
   * if stack is not found.
   */
  private findStack(taskID: number): TaskStack {
    const stack = this.stacks.find(({ task }) => task.id === taskID);
    if (!stack) throw Error('#' + taskID + ' - Task does not exist!');

    return stack;
  }
}

/**
 *  Create a new Task Manager.
 * @param [...tasks] - Tasks to append on TaskManager.
 * @returns a new TaskManager instance.
 */
function createTaskManager(...tasks: TaskType[]): TaskManager {
  return new TaskManager(...tasks);
}

export { createTaskManager };

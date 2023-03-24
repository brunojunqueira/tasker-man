import { Task } from './types';

// needs to be put in task to throw it.

/** Error of an Task */
export class TaskError extends Error {
  public taskId?: number;
  public timesLeft?: number | string;
  public taskName?: string;

  constructor(msg?: string);
  constructor(task?: Task, msg?: string);
  constructor(taskOrString?: Task | string, msg?: string) {
    super(typeof taskOrString === 'string' ? taskOrString : msg);

    if (taskOrString && typeof taskOrString !== 'string') {
      this.taskId = taskOrString.id;
      this.timesLeft = taskOrString.getTimesLeft();
      this.taskName = taskOrString.name;
    }
  }
}

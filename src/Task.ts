import { EventHandler } from './util/event';
import { parseTime } from './util/time';
import { TaskCallback, TaskOptions, TaskStatus, Task as ITask } from './types';

/** The id digits to calculate the next task id. */
const idMaxDigits = 12;

class Task implements ITask {
  readonly id: number;
  readonly callback: TaskCallback;
  readonly name: string;

  private timesLeft: number | 'endlessly';
  private status: TaskStatus;
  private timeout: number;
  private first: boolean;

  public data: Record<string, any>;
  public repeat: number | 'endlessly';
  public interval: string | number;
  public delay: string | number;

  onTaskStart: EventHandler;
  onTaskStop: EventHandler;
  onTaskError: EventHandler;

  constructor(callback: TaskCallback, options?: TaskOptions) {
    this.id = this.getNewId();

    this.callback = callback;

    this.name = `Task ${this.id}`;
    this.delay = 0;
    this.interval = 0;
    this.repeat = 0;
    this.data = {};

    if (options) {
      const { name, delay, interval, repeat, data } = options;

      if (name) this.name = name;
      if (delay) this.delay = delay;
      if (interval) this.interval = interval;
      if (repeat) this.repeat = repeat;
      if (data) this.data = data;
    }

    this.status = TaskStatus.STOPPED;
    this.first = true;
    this.timeout = setTimeout(() => null);

    this.timesLeft = typeof this.repeat === 'string' ? this.repeat : this.repeat + 1;

    this.onTaskStart = new EventHandler();
    this.onTaskStop = new EventHandler();
    this.onTaskError = new EventHandler();
  }

  private getNewId(): number {
    return Math.floor(Math.random() * Math.pow(10, idMaxDigits));
  }

  private resetTimesLeft(): void {
    if (this.repeat) {
      this.timesLeft = typeof this.repeat === 'string' ? this.repeat : this.repeat + 1;
    }
  }

  async start(): Promise<void> {
    //  Try to set timeout and start the task.
    try {
      this.timeout = setTimeout(() => {
        // Execute Task Callback.
        this.callback(this.data);
        if (typeof this.timesLeft === 'number') this.timesLeft--;
        // Stop task execution or restart the task.
        this.stop();
      }, parseTime(this.first ? this.delay : 0));

      // Set First Time false.
      this.first = false;

      // Set Task Status.
      this.status = TaskStatus.RUNNING;

      // Dispatch Start Event
      this.onTaskStart.call(this);
    } catch {
      // Set Task Status.
      this.abort(new Error('Error on Stop Task'));
    }
  }

  async stop(): Promise<void> {
    // Stop task if timesLeft bigger than 0 or task is endlessly or restart the task.
    if (this.timesLeft > 0 || this.timesLeft === 'endlessly') {
      // Try to set timeout and restart the task.
      try {
        this.timeout = setTimeout(() => this.start(), parseTime(this.interval));

        // Set Task Status.
        this.status = TaskStatus.STOPPED;

        // Dispatch Stop Event
        this.onTaskStop.call(this);
      } catch {
        // Set Task Status.
        this.abort(new Error('Error on Stop Task'));
      }
    } else {
      // Clear task timeout.
      clearTimeout(this.timeout);
      // Set Task Status.
      this.status = TaskStatus.STOPPED;
      // Dispatch Stop Event
      this.onTaskStop.call(this);
      // Reset timesLeft.
      this.resetTimesLeft();
      // Reset First Time Boolean
      this.first = true;
    }
  }

  async abort(error?: Error): Promise<void> {
    // Clear task timeout.
    clearTimeout(this.timeout);
    // Set Task Status.
    this.status = error ? TaskStatus.ERROR : TaskStatus.ABORTED;
    if (error) {
      this.onTaskError.call(this, error);
    }
    // Dispatch Stop Event
    this.onTaskStop.call(this);
    // Reset timesLeft.
    this.resetTimesLeft();
  }

  getTimesLeft() {
    return this.timesLeft;
  }

  getStatus() {
    return this.status;
  }
}

/**
 * Create a new Task.
 * @param [callback] - Method that task will run.
 * @param [options] - Task options that receive *repeat*, *interval* and/or *delay*.
 * @format To *interval* and *delay* use "-yy -mm -dd -h -m -s" format. You might skip some times and don't use spaces: "-dd-m". But you should to keep this order.
 * @param [name] - Task name.
 * @returns A new Task instance.
 */
function createTask<DataType = any>(callback: TaskCallback<DataType>, options?: TaskOptions<DataType>): Task {
  return new Task(callback, options);
}

export { createTask, Task };

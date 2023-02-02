import { EventHandler } from './util/event';
import { parseTime } from './util/time';

/**
 * Task Parameter Options
 */
export interface TaskOptions {
  /**
   * Task Name.
   */
  name?: string;
  /**
   * Times task will repeat. If "endlessly", TaskManager will run the task forever.
   * @attention NOTE THAT IT'S A REPEAT PROPERTY, TASK WILL RUN ONCE, AFTER THAT REPEATS BEGIN, SO IF YOU PUT 5 REPEATS, TASK WILL RUN 6 TIMES.
   */
  repeat?: number | 'endlessly';
  /**
   * Time task will take to run repeat. Follow DTR.
   */
  interval?: string | number;
  /**
   * Time task will take to run in the first time. Follow DTR.
   */
  delay?: string | number;
}

interface PrivateTaskOptions {
  name: string;
  repeat: number | 'endlessly';
  interval: string | number;
  delay: string | number;
}

enum TaskStatus {
  STOPPED = 0,
  RUNNING = 1,
  ERROR = 2,
  ABORTED = 3,
}

class Task {
  readonly callback: () => void;
  readonly name?: string;
  readonly options: PrivateTaskOptions;

  private status: TaskStatus;
  private timesLeft: number | 'endlessly';
  private timeout: number;
  private first: boolean;

  onTaskStart: EventHandler<this>;
  onTaskStop: EventHandler<this>;

  constructor(callback: () => void, options?: TaskOptions) {
    this.callback = callback;

    this.options = {
      name: '',
      repeat: 0,
      delay: 0,
      interval: 0,
    };
    if (options) {
      if (options.name) this.options.name = options.name;
      if (options.delay) this.options.delay = options.delay;
      if (options.interval) this.options.interval = options.interval;
      if (options.repeat) this.options.repeat = options.repeat;
    }

    this.status = TaskStatus.STOPPED;
    this.first = true;
    this.timeout = setTimeout(() => null);

    this.timesLeft = typeof this.options.repeat === 'string' ? this.options.repeat : this.options.repeat + 1;

    this.onTaskStart = new EventHandler((event) => null, this);
    this.onTaskStop = new EventHandler((event) => null, this);
  }

  private resetTimesLeft() {
    if (this.options) {
      if (this.options.repeat) {
        this.timesLeft = typeof this.options.repeat === 'string' ? this.options.repeat : this.options.repeat + 1;
      }
    }
  }

  async start() {
    //  Try to set timeout and start the task.
    try {
      this.timeout = setTimeout(() => {
        // Execute Task Callback.
        this.callback();
        if (typeof this.timesLeft === 'number') this.timesLeft--;
        // Stop task execution or restart the task.
        this.stop();
      }, parseTime(this.first ? this.options.delay : 0));

      // Set First Time false.
      this.first = false;

      // Set Task Status.
      this.status = TaskStatus.RUNNING;

      // Dispatch Start Event
      this.onTaskStart.call();
    } catch {
      // Set Task Status.
      this.abort(true);
      throw Error('Error on Start Task');
    }
  }

  async stop() {
    // Stop task if timesLeft bigger than 0 or task is endlessly or restart the task.
    if (this.timesLeft > 0 || this.timesLeft === 'endlessly') {
      // Try to set timeout and restart the task.
      try {
        this.timeout = setTimeout(() => this.start(), parseTime(this.options.interval));

        // Set Task Status.
        this.status = TaskStatus.STOPPED;

        // Dispatch Stop Event
        this.onTaskStop.call();
      } catch {
        // Set Task Status.
        this.abort(true);
        throw Error('Error on Stop Task');
      }
    } else {
      // Clear task timeout.
      clearTimeout(this.timeout);
      // Set Task Status.
      this.status = TaskStatus.STOPPED;
      // Dispatch Stop Event
      this.onTaskStop.call();
      // Reset timesLeft.
      this.resetTimesLeft();
      // Reset First Time Boolean
      this.first = true;
    }
  }

  async abort(error?: boolean) {
    // Clear task timeout.
    clearTimeout(this.timeout);
    // Set Task Status.
    this.status = error ? TaskStatus.ERROR : TaskStatus.ABORTED;
    // Dispatch Stop Event
    this.onTaskStop.call();
    // Reset timesLeft.
    this.resetTimesLeft();
  }
  /**
   * Get the times left to task end. If endlessly, will return endlessly.
   * @returns Times Left or Endlessly
   */
  getTimesLeft() {
    return this.timesLeft;
  }
  /**
   * Get Task Status
   * @returns Task Status
   */
  getStatus() {
    return this.status;
  }
}

type TaskType = Task;

/**
 * @description Create a new Task.
 * @param [callback] - Method that task will run.
 * @param [options] - Task options that receive *repeat*, *interval* and/or *delay*.
 * @subparam **interval** - Time it takes to task run again in next repeat.
 * @subparam **delay** - Time it takes to task run on the first start.
 * @format To *interval* and *delay* use "-yy -mm -dd -h -m -s" format. You might skip some times and don't use spaces: "-dd-m". But you should to keep this order.
 * @param [name] - Task name.
 * @returns A new Task instance.
 */
function createTask(callback: () => void, options?: TaskOptions): Task {
  return new Task(callback, options);
}

export { createTask, TaskType };

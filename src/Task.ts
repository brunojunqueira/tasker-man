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
   * Time task will take to run repeat. Follow SST.
   */
  interval?: string | number;
  /**
   * Time task will take to run in the first time. Follow SST.
   */
  delay?: string | number;
  /**
   * Data to be passed to the task.
   */
  data?: any;
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

/** The id digits to calculate the next task id. */
const idMaxDigits = 12;

class Task {
  readonly id: number;
  readonly callback: (data: any) => void;
  readonly name?: string;

  private readonly options: PrivateTaskOptions;
  private status: TaskStatus;
  private timesLeft: number | 'endlessly';
  private timeout: number;
  private first: boolean;
  public data: Record<string, any> = {};

  onTaskStart: EventHandler<this>;
  onTaskStop: EventHandler<this>;

  constructor(callback: (data: any) => void, options?: TaskOptions) {
    this.id = this.getNewId();

    this.callback = callback;

    this.options = {
      name: '',
      repeat: 0,
      delay: 0,
      interval: 0,
    };

    if (options) {
      if (options.name) this.name = options.name;
      if (options.delay) this.options.delay = options.delay;
      if (options.interval) this.options.interval = options.interval;
      if (options.repeat) this.options.repeat = options.repeat;
      if (options.data) this.data = options.data;
    }

    this.status = TaskStatus.STOPPED;
    this.first = true;
    this.timeout = setTimeout(() => null);

    this.timesLeft = typeof this.options.repeat === 'string' ? this.options.repeat : this.options.repeat + 1;

    this.onTaskStart = new EventHandler(() => null, this);
    this.onTaskStop = new EventHandler(() => null, this);
  }

  private getNewId(): number {
    return Math.floor(Math.random() * Math.pow(10, idMaxDigits));
  }

  private resetTimesLeft(): void {
    if (this.options) {
      if (this.options.repeat) {
        this.timesLeft = typeof this.options.repeat === 'string' ? this.options.repeat : this.options.repeat + 1;
      }
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

  async stop(): Promise<void> {
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

  async abort(error?: boolean): Promise<void> {
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
   * Get the times left to task end. If endlessly, will return `"endlessly"`.
   * @returns Times Left or Endlessly
   */
  getTimesLeft(): number | 'endlessly' {
    return this.timesLeft;
  }

  /**
   * Get the interval of this task. Returns `none` if is just an once task or/and
   * don't hav.
   * @returns The interval set or none
   */
  getInterval(): string | number {
    return this.options.interval;
  }

  /**
   * Get Task Status
   * @returns Task Status
   */
  getStatus(): TaskStatus {
    return this.status;
  }
}

type TaskType = Task;

/**
 * Create a new Task.
 * @param [callback] - Method that task will run.
 * @param [options] - Task options that receive *repeat*, *interval* and/or *delay*.
 * @format To *interval* and *delay* use "-yy -mm -dd -h -m -s" format. You might skip some times and don't use spaces: "-dd-m". But you should to keep this order.
 * @param [name] - Task name.
 * @returns A new Task instance.
 */
function createTask(callback: (data: any) => void, options?: TaskOptions): Task {
  return new Task(callback, options);
}

export { createTask, TaskType };

interface TaskOptions {
  name?: string;
  repeat?: boolean;
  times?: number;
  onTaskStart?: () => void;
  onTaskStop?: () => void;
}

enum TaskStatus {
  STARTED = 10,
  STOPPED = 20,
  INVALID = 40,
}

class Task {
  name: string;
  id: number;
  isActive: boolean = false;

  onDevTaskStart: () => void = () => {};
  onDevTaskStop: () => void = () => {};

  readonly onTaskStart: () => void = () => {};
  readonly onTaskStop: () => void = () => {};

  readonly callback: () => any;
  readonly repeat: boolean = false;
  readonly times: number = 0;
  readonly delay: number;

  private interval: any;
  private timeout: any;
  private timesRemaining: number = 0;

  constructor(id: number, callback: () => any, delay: number, options?: TaskOptions) {
    this.id = id;
    this.name = `Task ${id}`;

    if (options) {
      if (options.name) this.name = options.name;
      if (options.repeat) {
        this.repeat = options.repeat;
        if (options.times) {
          this.times = options.times;
          this.timesRemaining = options.times;
        }
      }
      if (options.onTaskStart) this.onTaskStart = options.onTaskStart;
      if (options.onTaskStop) this.onTaskStop = options.onTaskStop;
    }

    this.callback = callback;
    this.delay = delay * 1000;

    console.log(`[ SUCCESS ] - Task #${this.id} ${this.name} has been created!`);
  }

  /**
   * @brief Start the task.
   * @log [ SUCCESS ] Informe task has been started.
   * @log [ ERROR ] If task is already active.
   */
  start() {
    if (this.isActive) {
      console.log(`[ ERROR ] - Task #${this.id} ${this.name} is already active`);
      return TaskStatus.INVALID;
    }
    this.onTaskStart();
    this.onDevTaskStart();
    if (this.repeat) {
      if (this.times) {
        this.interval = setInterval(() => {
          try {
            this.callback();
          } catch (e) {
            console.log(`[ ERROR ] - Task #${this.id} ${this.name} callback presented the followed error: ${e}`);
          }
          this.timesRemaining--;
          if (!this.timesRemaining) {
            this.stop();
            this.timesRemaining = this.times;
          }
        }, this.delay);
      } else {
        this.interval = setInterval(() => {
          try {
            this.callback();
          } catch (e) {
            console.log(`[ ERROR ] - Task #${this.id} ${this.name} callback presented the follow error: ${e}`);
          }
        }, this.delay);
      }
    } else {
      this.timeout = setTimeout(() => {
        try {
          this.callback();
        } catch (e) {
          console.log(`[ ERROR ] - Task #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
        this.stop();
      }, this.delay);
    }
    this.isActive = true;
    console.log(`[ SUCCESS ] - Task #${this.id} ${this.name} started`);
    return TaskStatus.STARTED;
  }
  /**
   * @brief Stop the task.
   * @log [ SUCCESS ] Informe task has been stopped.
   * @log [ ERROR ] If task is not active.
   */
  stop() {
    if (!this.isActive) {
      console.log(`[ ERROR ] - Task #${this.id} ${this.name} is not active`);
      return TaskStatus.INVALID;
    }
    this.onTaskStop();
    this.onDevTaskStop();
    if (this.repeat) {
      clearInterval(this.interval);
    } else {
      clearTimeout(this.timeout);
    }
    this.isActive = false;
    console.log(`[ SUCCESS ] - Task #${this.id} ${this.name} stopped`);
    return TaskStatus.STOPPED;
  }
}

export { Task, TaskOptions };

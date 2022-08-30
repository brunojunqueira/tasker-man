'use strict';

interface TaskOptions {
  name?: string;
  repeat?: boolean;
}

class Task {
  name: string;
  id: number;
  isActive: boolean;

  readonly callback: () => any;
  readonly repeat: boolean = false;
  readonly time: number;

  private interval: any;
  private timeout: any;

  constructor(id: number, callback: () => any, time: number, options?: TaskOptions) {
    this.name = options?.name ?? `Task ${id}`;
    this.id = id;
    this.callback = callback;
    this.repeat = options?.repeat ?? false;
    this.time = time * 1000;
    this.isActive = false;

    prompt(`[ SUCCESS ] - #${this.id} ${this.name} has been created!`);
  }
  /**
   * @brief Start the task.
   * @log [ SUCCESS ] Informe task has been started.
   * @log [ ERROR ] If task is already active.
   */
  start() {
    if (this.isActive) {
      prompt(`[ ERROR ] - #${this.id} ${this.name} is already active`);
      return;
    }
    if (this.repeat) {
      this.interval = setInterval(() => {
        try {
          this.callback();
        } catch (e) {
          prompt(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
      }, this.time);
    } else {
      this.timeout = setTimeout(() => {
        try {
          this.callback();
        } catch (e) {
          prompt(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
      }, this.time);
    }
    this.isActive = true;
    prompt(`[ SUCCESS ] - #${this.id} ${this.name} started`);
  }
  /**
   * @brief Stop the task.
   * @log [ SUCCESS ] Informe task has been stopped.
   * @log [ ERROR ] If task is not active.
   */
  stop() {
    if (!this.isActive) {
      prompt(`[ ERROR ] - #${this.id} ${this.name} is not active`);
      return;
    }
    if (this.repeat) {
      clearInterval(this.interval);
    } else {
      clearTimeout(this.timeout);
    }
    this.isActive = false;
    prompt(`[ SUCCESS ] - #${this.id} ${this.name} stopped`);
  }
  /**
   * @brief Run task once.
   * @log [ SUCCESS ] Informe task had been executed.
   */
  run() {
    try {
      this.callback();
    } catch (e) {
      prompt(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
    }
  }
}

export { Task, TaskOptions };

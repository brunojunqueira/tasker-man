import { Task } from '../Task/index.js';

interface RoutineOptions {
  name?: string;
  delay?: number;
  repeat?: boolean;
  times?: number;
}

class Routine {
  id: number;
  name: string;
  tasks: Task[];
  isActive: boolean = false;

  readonly repeat: boolean = false;
  readonly times: number = 0;
  readonly delay: number = 0;

  private counter: number = 1;

  constructor(id: number, tasks: Task[], options?: RoutineOptions) {
    this.tasks = tasks;
    this.id = id;
    this.name = `Routine ${id}`;

    if (options) {
      if (options.name) this.name = options.name;
      if (options.delay && options.delay > 0) this.delay = options.delay * 1000;
      if (options.repeat) {
        this.repeat = options.repeat;
        if (options.times) this.times = options.times;
      }
    }
    console.log(`[ SUCCESS ] - Routine #${this.id} ${this.name} has been created!`);
  }

  private nextStart(id: number) {
    if (this.tasks[id]) this.start(id);
  }

  start(id: number = 0) {
    if (this.isActive) {
      console.log(`[ ERROR ] - Routine #${this.id} ${this.name} is already active`);
      return;
    }
    if (id + 1 === this.tasks.length) {
      if (this.repeat) {
        if (this.counter < this.times) {
          this.tasks[id].onDevTaskStop = () => {
            this.isActive = false;
            let timeout = setTimeout(() => {
              this.nextStart(0);
              clearTimeout(timeout);
            }, this.delay);
            this.counter++;
          };
        } else if (this.times === 0) {
          this.tasks[id].onDevTaskStop = () => {
            this.isActive = false;
            let timeout = setTimeout(() => {
              this.nextStart(0);
              clearTimeout(timeout);
            }, this.delay);
          };
        } else {
          this.tasks[id].onDevTaskStop = () => {
            this.isActive = false;
            this.tasks[id].onDevTaskStop = () => {};
          };
          this.counter = 0;
        }
      }
    } else {
      this.tasks[id].onDevTaskStop = () => {
        this.isActive = false;
        this.tasks[id].onDevTaskStop = () => {};
        this.nextStart(id + 1);
      };
    }

    this.tasks[id].start();
    this.isActive = true;
  }

  private nextStop(id: number) {
    if (this.tasks[id + 1]) this.stop(id + 1);
  }

  stop(id: number = 0) {
    if (!this.isActive) {
      console.log(`[ ERROR ] - Routine #${this.id} ${this.name} is already active`);
      return;
    }
    this.tasks[id].onDevTaskStop = () => {
      this.isActive = true;
      this.nextStop(id);
      this.tasks[id].onDevTaskStop = () => {};
    };
    this.tasks[id].stop();
    this.isActive = false;
  }
}

export { Routine, RoutineOptions };

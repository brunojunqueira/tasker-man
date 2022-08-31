import { Task } from '../Task/index.js';

interface RoutineOptions {
  repeat?: boolean;
  delay?: number
}

class Routine {
  tasks: Task[];

  constructor(tasks: Task[], options?: RoutineOptions) {
    this.tasks = tasks;
  }

}

export { Routine, RoutineOptions };

import { Task } from '../Task/index.js';

interface RoutineOptions {
  name?: string
  delay?: number
  repeat?: boolean
  times?: number
}

class Routine {
  id: number
  name: string
  tasks: Task[]
  isActive: boolean = false

  readonly repeat: boolean = false
  readonly times: number = 0
  readonly delay: number = 0

  private timesRemaining: number = 0;

  constructor(id: number, tasks: Task[], options?: RoutineOptions) {
    this.tasks = tasks;
    this.id = id;
    this.name = `Routine ${id}`;

    if(options){
      if(options.name)
        this.name = options.name;
      if(options.repeat){
        this.repeat = options.repeat;
        if(options.times){
          this.times = options.times;
          this.timesRemaining = options.times;
        }
      }
      if(options.delay && options.delay > 0)
        this.delay = options.delay * 1000;
    } 

  }

  async start() : Promise<any>{
    if (this.isActive) {
      console.log(`[ ERROR ] - Routine #${this.id} ${this.name} is already active`);
      return;
    }
    
    this.isActive = true;
  }

  stop(){


    this.isActive = false;
  }

}

export { Routine, RoutineOptions };

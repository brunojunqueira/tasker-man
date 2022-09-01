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

  constructor(id: number, tasks: Task[], options?: RoutineOptions) {
    this.tasks = tasks;
    this.id = id;
    this.name = `Routine ${id}`;

    if(options){
      if(options.name)
        this.name = options.name;
      if(options.delay && options.delay > 0)
        this.delay = options.delay * 1000;
      if(options.repeat && options.times){
        this.repeat = options.repeat;
        this.times = options.times;
      }
    } 
    console.log(`[ SUCCESS ] - Routine #${this.id} ${this.name} has been created!`);
  }

  private nextStart(id: number){
    if(this.tasks[id + 1])
      this.start(id + 1);
  }

  start(id: number = 0){
    if (this.isActive) {
      console.log(`[ ERROR ] - Routine #${this.id} ${this.name} is already active`);
      return ;
    }
    this.tasks[id].onDevTaskStop = () => { 
      this.isActive = false; 
      this.nextStart(id);
    };
    this.tasks[id].start();
    this.isActive = true;
  }

  private nextStop(id: number){
    if(this.tasks[id + 1])
      this.stop(id + 1);
  }

  stop(id: number = 0){
    if (!this.isActive) {
      console.log(`[ ERROR ] - Routine #${this.id} ${this.name} is already active`);
      return ;
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

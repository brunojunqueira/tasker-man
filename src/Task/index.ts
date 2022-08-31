
interface TaskOptions {
  name?: string
  repeat?: boolean
  times?: number
}

class Task {
  name: string
  id: number
  isActive: boolean

  readonly callback: () => any;
  readonly repeat: boolean = false;
  readonly delay: number
  readonly times: number

  private interval: any
  private timeout: any
  private timesRemaining: number

  constructor(id: number, callback: () => any, delay: number, options?: TaskOptions) {

    this.id = id;
    this.name = `Task ${id}`;
    this.repeat = false;
    this.times = 0;
    this.timesRemaining = 0;

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
    } 
    
    this.callback = callback;
    this.delay = delay * 1000;
    this.isActive = false;

    console.log(`[ SUCCESS ] - #${this.id} ${this.name} has been created!`);
  }

  /**
   * @brief Start the task.
   * @log [ SUCCESS ] Informe task has been started.
   * @log [ ERROR ] If task is already active.
   */
  start() {
    if (this.isActive) {
      console.log(`[ ERROR ] - #${this.id} ${this.name} is already active`);
      return;
    }
    if (this.repeat) {

      if(this.times){
        this.interval = setInterval(() => {
          try {
            this.callback();
          } catch (e) {
            console.log(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
          }
          this.timesRemaining--;
          if(!this.timesRemaining){
            this.stop();
            this.timesRemaining = this.times;
          }
        }, this.delay);
      } else {
        this.interval = setInterval(() => {
          try {
            this.callback();
          } catch (e) {
            console.log(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
          }
        }, this.delay);
      }

    } else {
      this.timeout = setTimeout(() => {
        try {
          this.callback();
        } catch (e) {
          console.log(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
      }, this.delay);
    }
    this.isActive = true;
    console.log(`[ SUCCESS ] - #${this.id} ${this.name} started`);
  }
  /**
   * @brief Stop the task.
   * @log [ SUCCESS ] Informe task has been stopped.
   * @log [ ERROR ] If task is not active.
   */
  stop() {
    if (!this.isActive) {
      console.log(`[ ERROR ] - #${this.id} ${this.name} is not active`);
      return;
    }
    if (this.repeat) {
      clearInterval(this.interval);
    } else {
      clearTimeout(this.timeout);
    }
    this.isActive = false;
    console.log(`[ SUCCESS ] - #${this.id} ${this.name} stopped`);
  }
  /**
   * @brief Run task once.
   * @log [ SUCCESS ] Informe task had been executed.
   */
  run() {
    try {
      this.callback();
    } catch (e) {
      console.log(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
    }
  }
}

export { Task, TaskOptions };

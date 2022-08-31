import { Task, TaskOptions } from '../Task';

enum TaskerManagerError{
  badRequest = 400,
  notFound = 404
}

class TaskManager {
  tasks: Task[];

  constructor() {
    this.tasks = [];
  }

  /**
   * @brief Remove a Task from list.
   * @param id [optional/required] Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @returns List with item removed.
   */
  private removeTask(list: Task[], id: number) {
    const length = list.length;
    for (let i = id; i < length; i++) {
      if (i + 1 === length) {
        list = list.slice(0, length - 1);
      } else {
        if (list[i + 1].name === `Task ${i + 1}`) list[i + 1].name = `Task ${i}`;
        list[i + 1].id = i;
        list[i] = list[i + 1];
      }
    }
    return list;
  }
  /**
   *
   * @param name [ required ] - Task's NAME on TaskManager.
   * @returns Task ID or NULL.
   */
  getTaskId(name: string) {
    let id = -1;
    this.tasks.forEach((task) => {
      if (task.name === name) id = task.id;
    });
    return id;
  }
  /**
   * @brief Create a new Task to current TaskManager.
   * @param callback [ function ] Function that will be executed by task.
   * @param timeout [ number ] - Time delay in seconds task will be executed. ( If timeout be 0, task will execute instantly. And CAN NOT be repeated. )
   * @param options [ TaskOptions ] - Task options.
   * @log [ SUCCESS ] - Inform Task had been created.
   * @log [ ERROR ] - If timeout be lesser than 1s and not equal 0.
   * @log [ ADVERTISE ] - If Task is already active.
   */
  createTask(callback: () => any, timeout: number, options?: TaskOptions) {
    if ((timeout < 1 && timeout > 0) || timeout < 0) {
      console.log(
        "[ ERROR ] - To avoid issues, timeout cannot be lesser than 1s or negative. If your looking for delay or fast repeated tasks, please use 'setTimeout()' or 'setInterval()'. Task NOT created!",
      );
      return TaskerManagerError.badRequest;
    }
    if (!(options && options.name)) {
      console.log('[ ADVERTISE ] - We recommended to name Tasks for easily manipulation.');
    }

    const newTask = new Task(this.tasks.length, callback, timeout, options);

    this.tasks.push(newTask);

    return newTask;
  }
  /**
   * @brief Start an inactive Task from current TaskManager.
   * @param id [ required ] - Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe task has been started.
   * @log [ ERROR ] - If Task does not exist.
   * @log [ ERROR ] - If Task is already active.
   */
  startTask(id: number) {
    if (!this.tasks[id]) {
      console.log('[ ERROR ] - ( Start Task ) This Task does not exists');
      return;
    }
    this.tasks[id].start();
  }
  /**
   * @brief Stop an active Task from current TaskManager.
   * @param id [ required ] - Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe task has been stopped.
   * @log [ ERROR ] - If Task does not exist.
   * @log [ ERROR ] - If Task is not active.
   */
  stopTask(id: number) {
    if (!this.tasks[id]) {
      console.log('[ ERROR ] - ( Stop ) This Task does not exists!');
      return;
    }
    this.tasks[id].stop();
  }

  /**
   * @brief Delete a Task from current TaskManager.
   * @param id [optional/required] Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe task has been deleted.
   * @log [ ERROR ] - If Task does not exist.
   * @log [ ERROR ] - If Task is active.
   */
  deleteTask(id: number) {
    if (!this.tasks[id]) {
      console.log('[ ERROR ] - This Task does not exists!');
      return;
    }
    if (this.tasks[id].isActive) {
      console.log('[ ERROR ] - This Task is active! Please, stop Task before delete!');
      return;
    }
    this.tasks = this.removeTask(this.tasks, id);
    console.log(`[ SUCCESS ] - Task ${id} has been deleted!`);
  }
  /**
   * @brief Return all active Tasks of current TaskManager.
   * @returns Active Tasks.
   */
  activeTasks(){
    let tasks : string [] = [];
    this.tasks.forEach((task)=>{
      if(task.isActive)
        tasks.push(`#${task.id} ${task.name}`);
    });
    return tasks;
  }
  /**
   * @brief Return all active Tasks of current TaskManager.
   * @returns Active Tasks.
   */
  inactiveTasks(){
    let tasks : string [] = [];
    this.tasks.forEach((task)=>{
      if(!task.isActive)
        tasks.push(`#${task.id} ${task.name}`);
    });
    return tasks;
  }
}

export { TaskManager };

import { Task, TaskOptions } from '../Task';
import { Routine, RoutineOptions } from '../Routine';

enum TaskerManagerStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

class TaskManager {
  tasks: Task[] = [];
  routines: Routine[] = [];

  /**
   * @brief Remove a Task from list.
   * @param id [optional/required] Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @returns List with item removed.
   */
  private removeFromList(list: any[], id: number) {
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

  /*---------------------------------------  TASK CODE  --------------------------------------------*/
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
   * @param delay [ number ] - Delay in seconds to task be executed. ( If timeout be 0, task will execute instantly. And CAN NOT be repeated. )
   * @param options [ TaskOptions ] - Task options.
   * @log [ SUCCESS ] - Inform Task had been created.
   * @log [ ERROR ] - If timeout be lesser than 1s and not equal 0.
   * @log [ WARNING ] - If Task does not have a name
   */
  createTask(callback: () => any, delay: number, options?: TaskOptions) {
    if ((delay < 1 && delay > 0) || delay < 0) {
      console.log(
        "[ ERROR ] - To avoid issues, timeout cannot be lesser than 1s or negative. If your looking for delay or fast repeated tasks, please use 'setTimeout()' or 'setInterval()'. Task NOT created!",
      );
      return TaskerManagerStatus.BAD_REQUEST;
    }
    if (!(options && options.name)) {
      console.log('[ WARNING ] - We recommended to name Tasks for easily manipulation.');
    }

    const newTask = new Task(this.tasks.length, callback, delay, options);

    this.tasks.push(newTask);

    return newTask;
  }
  /**
   * @brief Start an inactive Task from current TaskManager.
   * @param id [ required ] - Task ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe task has been started.
   * @log [ ERROR ] - If Task does not exist.
   * @log [ ERROR ] - If Task is already active.
   */
  startTask(id: number) {
    if (!this.tasks[id]) {
      console.log('[ ERROR ] - ( Start Task ) This Task does not exists');
      return TaskerManagerStatus.NOT_FOUND;
    }
    this.tasks[id].start();
    return TaskerManagerStatus.SUCCESS;
  }
  /**
   * @brief Stop an active Task from current TaskManager.
   * @param id [ required ] - Task ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe task has been stopped.
   * @log [ ERROR ] - If Task does not exist.
   * @log [ ERROR ] - If Task is not active.
   */
  stopTask(id: number) {
    if (!this.tasks[id]) {
      console.log('[ ERROR ] - ( Stop ) This Task does not exists!');
      return TaskerManagerStatus.NOT_FOUND;
    }
    this.tasks[id].stop();
    return TaskerManagerStatus.SUCCESS;
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
      return TaskerManagerStatus.NOT_FOUND;
    }
    if (this.tasks[id].isActive) {
      console.log('[ ERROR ] - This Task is active! Please, stop Task before delete!');
      return TaskerManagerStatus.BAD_REQUEST;
    }
    this.tasks = this.removeFromList(this.tasks, id);
    console.log(`[ SUCCESS ] - Task ${id} has been deleted!`);
    return TaskerManagerStatus.SUCCESS;
  }
  /**
   * @brief Return all active Tasks of current TaskManager.
   * @returns Active Tasks.
   */
  activeTasks() {
    let tasks: string[] = [];
    this.tasks.forEach((task) => {
      if (task.isActive) tasks.push(`#${task.id} ${task.name}`);
    });
    return tasks;
  }
  /**
   * @brief Return all inaactive Tasks of current TaskManager.
   * @returns Inactive Tasks.
   */
  inactiveTasks() {
    let tasks: string[] = [];
    this.tasks.forEach((task) => {
      if (!task.isActive) tasks.push(`#${task.id} ${task.name}`);
    });
    return tasks;
  }

  /*---------------------------------------//TASK CODE//--------------------------------------------*/

  /*--------------------------------------  ROUTINE CODE  ------------------------------------------*/

  /**
   *
   * @param name [ required ] - Routine NAME on TaskManager.
   * @returns Routine ID or NULL.
   */
  getRoutineId(name: string) {
    let id = -1;
    this.routines.forEach((routine) => {
      if (routine.name === name) id = routine.id;
    });
    return id;
  }
  /**
   * @deprecated Use createTask method instead.
   * Create a new Task to current TaskManager.
   * @param tasksIDs [ function ] Function that will be executed by task.
   * @param options [ TaskOptions ] - Task options.
   * @log [ SUCCESS ] - Inform Task had been created.
   * @log [ ERROR ] - If timeout be lesser than 1s and not equal 0.
   * @log [ WARNING ] - If Task does not have a name
   */
  createRoutine(tasksIDs: number[], options?: RoutineOptions) {
    let tasks: Task[] = [];
    let error = { status: TaskerManagerStatus.SUCCESS, taskID: -1 };
    if (!(options && options.name)) {
      console.log('[ WARNING ] - We recommended to name Routines for easily manipulation.');
    }
    tasksIDs.forEach((taskID) => {
      if (this.tasks[taskID]) {
        if (this.tasks[taskID].repeat && !this.tasks[taskID].times) {
          error.taskID = taskID;
          error.status = 400;
        }
        tasks.push(this.tasks[taskID]);
      } else {
        error.taskID = taskID;
        error.status = 404;
      }
    });
    if (error.status === 400) {
      console.log(
        `[ ERROR ] - ( Creating Routine ) Trying add Task #${error.taskID}. To avoid overload of same task, Tasks in Routines cannot run forever!`,
      );
      return error;
    }
    if (error.status === 404) {
      console.log(`[ ERROR ] - ( Creating Routine ) Task #${error.taskID} does not exists!`);
      return error;
    }
    const routine = new Routine(this.routines.length, tasks, options);
    this.routines.push(routine);
    return routine;
  }
  /**
   * @brief Start a Routine of current TaskManager.
   * @param id [ required ] - Routine ID on TaskManager. OBS: Can be got by using 'getRoutineId( )' function!
   * @log [ SUCCESS ] - Informe Routine has been started.
   * @log [ ERROR ] - If Routine does not exist.
   * @log [ ERROR ] - If Routine is already active.
   */
  startRoutine(id: number) {
    if (!this.routines[id]) {
      console.log(`[ ERROR ] - ( Starting Routine ) Routine #${id} does not exists!`);
      return TaskerManagerStatus.NOT_FOUND;
    }
    this.routines[id].start();
    return TaskerManagerStatus.SUCCESS;
  }
  /**
   * @brief Stop an active Routine from current TaskManager.
   * @param id [ required ] - Routine ID on TaskManager. OBS: Can be got by using 'getRoutineId( )' function!
   * @log [ SUCCESS ] - Informe Routine has been stopped.
   * @log [ ERROR ] - If Routine does not exist.
   * @log [ ERROR ] - If Routine is not active.
   */
  stopRoutine(id: number) {
    if (!this.routines[id]) {
      console.log(`[ ERROR ] - ( Stopping Routine ) Routine #${id} does not exists!`);
      return TaskerManagerStatus.NOT_FOUND;
    }
    this.routines[id].stop();
    return TaskerManagerStatus.SUCCESS;
  }
  /**
   * @brief Delete a Routine from current TaskManager.
   * @param id [optional/required] Routine ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
   * @log [ SUCCESS ] - Informe Routine has been deleted.
   * @log [ ERROR ] - If Routine does not exist.
   * @log [ ERROR ] - If Routine is active.
   */
  deleteRoutine(id: number) {
    if (!this.routines[id]) {
      console.log(`[ ERROR ] - ( Deleting Routine ) Routine #${id} does not exists!`);
      return TaskerManagerStatus.NOT_FOUND;
    }
    if (this.routines[id].isActive) {
      console.log(`[ ERROR ] - Routine #${id} is active! Please, stop Task before delete!`);
      return TaskerManagerStatus.BAD_REQUEST;
    }
    this.routines = this.removeFromList(this.routines, id);
    console.log(`[ SUCCESS ] - Routine ${id} has been deleted!`);
    return TaskerManagerStatus.SUCCESS;
  }
  /**
   * @brief Return all active Routines of current TaskManager.
   * @returns Active Tasks.
   */
  activeRoutines() {
    let routines: string[] = [];
    this.routines.forEach((routine) => {
      if (routine.isActive) routines.push(`#${routine.id} ${routine.name}`);
    });
    return routines;
  }
  /**
   * @brief Return all inactive Routines of current TaskManager.
   * @returns Inactive Routines.
   */
  inactiveRoutines() {
    let routines: string[] = [];
    this.routines.forEach((routine) => {
      if (!routine.isActive) routines.push(`#${routine.id} ${routine.name}`);
    });
    return routines;
  }

  /*-------------------------------------//ROUTINE CODE//------------------------------------------*/
}

export { TaskManager };

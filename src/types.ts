import { EventHandler } from './util/event';

/**
 * Task Parameter Options
 */
export interface TaskOptions<DataType = any> {
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
  data?: DataType;
}

/**
 * Task Status
 */
export enum TaskStatus {
  STOPPED = 0,
  RUNNING = 1,
  ERROR = 2,
  ABORTED = 3,
}

/**
 * Callback fired by task
 */
export type TaskCallback<DataType = any> = (data: DataType) => void;

/** Task */
export interface Task {
  /** The id of the task */
  readonly id: number;
  /** The task callback */
  readonly callback: TaskCallback;
  /** The name of the task */
  readonly name: string;

  /** Number of times that task will repeat, or indefinitely, if set to `endlessly` */
  repeat: number | 'endlessly';
  /** The interval between task executions */
  interval: string | number;
  /** The delay to task starts after. */
  delay: string | number;

  /** Data passed to the task's callback */
  data: Record<string, any>;

  /** Event fired when task starts */
  onTaskStart: EventHandler;
  /** Event fired when task stops */
  onTaskStop: EventHandler;
  /** Event fired when task throws an error */
  onTaskError: EventHandler;

  /**
   * Get the times left to task end. If endlessly, will return `"endlessly"`.
   * @returns Times Left or Endlessly
   */
  getTimesLeft(): number | 'endlessly';

  /**
   * Get Task Status
   * @returns Task Status
   */
  getStatus(): TaskStatus;

  /**
   * Immediatly starts the task with the configurations setted.
   *
   * NOT RECOMENDED TO USE THIS METHOD DIRECTLY UNLESS YOU KNOW WHAT YOU DOING, USE `manager.start()` INSTEAD.
   */
  start(): Promise<void>;

  /**
   * Tries to stop the task
   *
   * NOT RECOMENDED TO USE THIS METHOD DIRECTLY UNLESS YOU KNOW WHAT YOU DOING, USE `manager.stop()` INSTEAD.
   */
  stop(): Promise<void>;

  /**
   * Aborts the task. An error can be sent to give informations of why the task stopped.
   *
   * NOT RECOMENDED TO USE THIS METHOD DIRECTLY UNLESS YOU KNOW WHAT YOU DOING, USE `manager.stop()` INSTEAD.
   */
  abort(error?: Error): Promise<void>;
}

# Tasker Man(ager)

[![NPM version](http://img.shields.io/npm/v/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![Downloads](https://img.shields.io/npm/dm/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![License](https://img.shields.io/npm/l/tasker-man.svg)](https://github.com/brunojunqueira/tasker-man/blob/main/LICENSE)

[![PM](https://nodei.co/npm/tasker-man.png)](https://nodei.co/npm/tasker-man/)

A powerful and simple task manager.

Note: The old methods of TaskerMan are deprecated and I strongly recommend to use the new one implementation.

## Summary

#### General

- [Installation](#installation)
- [Usage](#usage)

#### Documentation

- [TaskManager](#taskmanager)
  - [createTaskManager](#createtaskmanager)
  - [activeTasks](#activetasks)
  - [inactiveTasks](#inactivetasks)
  - [append](#append)
  - [remove](#remove)
  - [getIdsByName](#getidsbyname)
  - [start](#start)
  - [abort](#abort)
- [Tasks](#tasks)
  - [createTask](#createtask)
- [SST](#sst)

## Installation

You can install using [npm](https://www.npmjs.com/package/tasker-man) or [yarn](https://yarnpkg.com/package/tasker-man).

#### npm

```
npm install tasker-man
```

#### yarn

```
yarn add tasker-man
```

## Usage

```js
const { TaskManager, createTask } = require('tasker-man');

const uniqueTask = createTask(() => console.log("I'll execute once!"));

const repetitiveTask = createTask(() => console.log("I'll execute a few times before stop"), {
  repeat: 5,
  interval: '1s',
  name: '5 times task',
});

const endlessTask = createTask(() => console.log("I'll execute until somebody stop me"), {
  repeat: 'endlessly',
  interval: '10s',
  name: 'endlessly task',
});

// Creates the TaskManager with some tasks
const myManager = createTaskManager(uniqueTask, repetitiveTask);

// You can add some tasks to an already create TaskManager with `append`
myManager.append(endlessTask);

// You can execute a single task by its id
myManager.start(uniqueTask.id);
```

# Documentation

## TaskManager

Main class of application that contains all functions and integrations needed to append, run, stop and pop Tasks.

OBS: TaskerMan is an instance of TaskManager. ##deprecated##

### createTaskManager()

Create a new instance of TaskManager.

```js
...
const manager = createTaskManager(task1, task2, task3);
```

### activeTasks()

Return all **active** Tasks of Task Manager.

```js
const manager = createTaskManager();
const activeTasks = manager.activeTasks();
```

#### - returns -

| Type      | Description   |
| :-------- | :------------ |
| `Task []` | Active Tasks. |

---

### inactiveTasks()

Return all **inactive** Tasks of Task Manager.

```js
const tasksID = manager.getIdsByName('ExampleTask');
manager.remove(TasksID[0]);
```

#### - returns -

| Type      | Description     |
| :-------- | :-------------- |
| `Task []` | Inactive Tasks. |

### append()

Push a task on TaskManager. Example:

```js
...
const manager = createTaskManager();

const task = createTask(taskCallback, taskOptions);
manager.append(task);
```

| Parameter | Type   | Required | Description      |
| :-------- | :----- | :------- | :--------------- |
| `task`    | `Task` | Yes      | A Task Instance. |

---

### remove()

Delete a Task from Task Manager.
Example:

```js
...
manager.remove(0);
```

| Parameter | Type     | Required | Description              |
| :-------- | :------- | :------- | :----------------------- |
| `id`      | `number` | Yes      | Task ID on Task Manager. |

**OBS: Task ID Can be got by using 'getIdsByName( )' method!**

---

### getIdsByName()

Get Tasks IDs on Task Manager using a given name.
Example:

```js
const manager = createTaskManager(task1, task2, task3);
const tasksID = manager.getIdsByName('ExampleTask');

manager.remove(tasksID[0]);
```

| Parameter | Type     | Required | Description                |
| :-------- | :------- | :------- | :------------------------- |
| `name`    | `string` | Yes      | Task name on Task Manager. |

---

### start()

Start a Task on Task Manager.
Example:

```js
...
const tasksIDs = manager.getIDsByName("ExampleTask");

manager.start(tasksIDs[0]);
```

| Parameter | Type     | Required | Description              |
| :-------- | :------- | :------- | :----------------------- |
| `id`      | `number` | Yes      | Task ID on Task Manager. |

**OBS: Task ID Can be got by using 'getIDsByName( )' method!**

---

### abort()

Abort a Task from Task Manager.
Example:

```js
const tasksIDs = manager.getIDsByName('ExampleTask');

manager.abort(tasksIDs[0]);
```

| Parameter | Type     | Required | Description              |
| :-------- | :------- | :------- | :----------------------- |
| `id`      | `number` | Yes      | Task ID on Task Manager. |

**OBS: Task ID Can be got by using 'getIDsByName( )' method!**

## Tasks

A Task is a object that execute a callback in selected time, with some parameters like delay and repeat.

### createTask()

Create a Task on Task Manager.

```js
function taskCallback() {
  console.log('Hello TaskerMan!');
}
const taskOptions = {
  repeat: 'endlessly',
  interval: '2s',
};
const task = createTask(taskCallback, taskOptions);
```

| Parameter     | Type          | Required | Description                          |
| :------------ | :------------ | :------- | :----------------------------------- |
| `callback`    | `function`    | Yes      | Function will be executed by task.   |
| `taskOptions` | `TaskOptions` | No       | Object that contain Task parameters. |

#### - TaskOptions -

| Parameter  | Type                      | Description                                                                    |
| :--------- | :------------------------ | :----------------------------------------------------------------------------- |
| `name`     | `string`                  | **Recommended**. Name used to identify a Task on Task Manager.                 |
| `repeat`   | `number` or `"endlessly"` | Times task will repeat. If "endlessly", TaskManager will run the task forever. |
| `delay`    | `number` or `string`      | Time task will take to run for the first time. Follow **SST Rule**.            |
| `interval` | `number` or `string`      | Time task will take to repeat. Follow **SST Rule**.                            |

## Using Data in Tasks

You can use a data arg in your tasks and modify as you wish in any time to turn Tasks more dynamic.

```js
// just add the arg data in your callback function and use it as you wish
function taskCallback(data) {
  console.log(`Hello, ${data.name}`);
}

// you can define data in task options passed
const taskOptions = {
  repeat: 'endlessly',
  interval: '2s',
  data: {
    name: "Jhon",
    age: 23
  }
};

const task = createTask(taskCallback, taskOptions);

// if you execute this task you will get
// E.g.: Hello, Jhon

...

// and we can update the data of the task at any given time...
task.data.name = "Ana";
task.data.age = 21

// ...then, next time the callback is called, the data will be already updated
// E.g.: Hello, Ana
```

## Typing Data

```ts
// in typescript you can define the type expected of your data
interface IData {
  name: string;
  age: number;
}

// as in javascript, just add the arg data in your task callback and define the type
function taskCallback(data: IData) {
  console.log(`Hello, ${data.name}`);
}

// you can pass to the TaskOptions to ensure the data type initializer
const taskOptions: TaskOptions<IData> = {
  repeat: 'endlessly',
  interval: '2s',
  data: {
    name: 'Jhon',
    age: 23,
  },
};

const task = createTask<IData>(taskCallback, taskOptions);
```

## SST

SST or _Simple Sequential Time_ is a time set rule created to supply big time intervals in a simple and intuitive way.

### Format

SST use a "-yy -mm -dd -h -m -s" format.

| Symbol | Reference |
| :----- | :-------- |
| yy     | Year      |
| mm     | Month     |
| dd     | Day       |
| h      | Hour      |
| m      | Minute    |
| s      | Second    |

---

### Usage

You can use SST with any time you need, since you put the time symbols in order `year -> month -> day -> hour -> minute -> second`.

Example:

    1yy 2mm 5dd 3h 45m 10s

This mean the time interval will be set to 1 year, 2 months, 5 days, 3 hours, 45 minutes and 10 seconds.

You also can skip some symbol and will still work since you keep the order.

Example:

3dd 30m

This mean the time interval will be set to 3 days and 30 minutes.

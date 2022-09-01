# Tasker Man(ager)

[![NPM version](http://img.shields.io/npm/v/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![Downloads](https://img.shields.io/npm/dm/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![Build Status](https://github.com/node-schedule/node-schedule/workflows/ci/badge.svg)](https://github.com/node-schedule/node-schedule/actions)

[![NPM](https://nodei.co/npm/tasker-man.png)](https://nodei.co/npm/tasker-man/)

A simple task manager.

## Usage

### Installation

You can install using [npm](https://www.npmjs.com/package/tasker-man) or [yarn](https://yarnpkg.com/package/tasker-man).

#### npm
```
npm install tasker-man
```

#### yarn
```
yarn add tasker-man
```

### Import

#### module
```js
import { TaskerMan } from "tasker-man";
```
#### require
```js
const { TaskerMan } = require("tasker-man");
```

# Documentation

## TaskManager
Main class of application that contains all functions and integrations needed to create, run, stop and delete Tasks.


| Proprieties     | Type       | Description                                        |
| :-------------- | :--------- | :------------------------------------------------- |
| `tasks`         | `Task []`  | Array with all Tasks created in TaskManager.       |
| `routines`      | `Routine []`  | Array with all Routines created in TaskManager.       |

OBS: TaskerMan is an instance of TaskManager.

## Tasks
A Task is a object that execute a callback in selected time, with some options like delay, and repeats.

### activeTasks()
Return all **active** Tasks of Task Manager.

```js
const activeTasks = TaskerMan.activeTasks();
```
#### - returns -

| Type                    | Status     | Description    |
| :---------------------- | :--------- | :------------- |
| `string []`             | `SUCCESS`  | Active Tasks.  |

---
### inactiveTasks()
Return all **inactive** Tasks of Task Manager.

```js
const inactiveTasks = TaskerMan.inactiveTasks();
```
#### - returns -

| Type                    | Status     | Description      |
| :---------------------- | :--------- | :--------------- |
| `string []`             | `SUCCESS`  | Inactive Tasks.  |


---
### createTask()
Create a Task on Task Manager.

```js
function MyCustomTask(){
    console.log("I'm running!");
}

TaskerMan.createTask(MyCustomTask, 5);
```

| Parameter   | Type       |Required| Description                        |
| :---------- | :--------- |:------ |:---------------------------------- |
| `callback`  | `function` | Yes    | Function will be executed by task. |
| `timeout`   | `number`   | Yes    | Delay Timeout in **seconds**. If 0 Task will run instantly and **cannot** repeat |
| `options`   | `object`   | No     | Task options                       |

#### - options -

| Parameter   | Type       | Description                                                    |
| :---------- | :--------- | :------------------------------------------------------------- |
| `name`      | `string`   | **Recommended**. Name used to identify a Task on Task Manager. |
| `repeat`    | `boolean`  | Inform if Task will keep executing callback continually.       |

Example:
```js
function MyCustomTask(){
    console.log("I'm running!");
}

TaskerMan.createTask( MyCustomTask, 5, {
    name: "ExampleTask",
    repeat: true
});
```
#### - logs -

| Status     | Description                                                    |
| :--------- | :------------------------------------------------------------- |
| `SUCCESS`  | Inform Task had been created.                                  |
| `ERROR`    | If timeout be lesser than 1s and not equal 0.                  |
| `ADVERTISE`| If Task does not received a name.                              |

#### - returns -

| Type                | Status     | Description              |
| :------------------ | :--------- | :------------------------|
| `Task`              | `SUCCESS`  | Return Task created.     |
| `TaskManagerStatus` | `ERROR`    | Return BAD_REQUEST.      |

---
### deleteTask()
#### Delete a Task from Task Manager.
Example:
```js
TaskerMan.deleteTask( 0 );
```

| Parameter   | Type       | Required | Description               |
| :---------- | :--------- | :------- | :------------------------ |
| `id`        | `number`   | Yes      | Task ID on Task Manager.  |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**

#### - logs -

| Type       | Description                   |
| :--------- | :---------------------------- |
| `SUCCESS`  | Inform Task had been deleted. |
| `ERROR`    | If Task does not exist.       |
| `ERROR`    | If Task is active.            |

#### - returns -

| Type                | Status     | Description              |
| :------------------ | :--------- | :------------------------|
| `TaskManagerStatus` | `SUCCESS`  | Return SUCCESS.          |
| `TaskManagerStatus` | `ERROR`    | Return NOT_FOUND.        |
| `TaskManagerStatus` | `ERROR`    | Return BAD_REQUEST.      |

---
### getTaskId()
#### Get Task ID on Task Manager using it name.
Example:
```js
const TaskID = TaskerMan.getTaskId("ExampleTask");

TaskerMan.deleteTask(TaskID);
```

| Parameter   | Type       | Required | Description                  |
| :---------- | :--------- | :------- | :--------------------------- |
| `name`      | `string`   | Yes      | Task name on Task Manager.   |

#### - returns -

| Type                | Status     | Description              |
| :------------------ | :--------- | :------------------------|
| `TaskManagerStatus` | `SUCCESS`  | Return SUCCESS.          |

---
### startTask()
#### Start a Task on Task Manager.
Example:
```js
const TaskID = TaskerMan.getTaskId("ExampleTask");

TaskerMan.startTask( TaskID );
```

| Parameter   | Type       | Required | Description               |
| :---------- | :--------- | :------- | :------------------------ |
| `id`        | `number`   | Yes      | Task ID on Task Manager.  |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**
#### - logs -

| Type       | Description                   |
| :--------- | :---------------------------- |
| `SUCCESS`  | Inform Task had been started. |
| `ERROR`    | If Task does not exist.       |
| `ERROR`    | If Task is already active.    |

#### - returns -

| Type                | Status     | Description              |
| :------------------ | :--------- | :------------------------|
| `TaskManagerStatus` | `SUCCESS`  | Return SUCCESS.          |
| `TaskManagerStatus` | `ERROR`    | Return NOT_FOUND.        |
| `TaskManagerStatus` | `ERROR`    | Return BAD_REQUEST.      |

---
### stopTask()
#### Stop a Task on Task Manager.
Example:
```js
const TaskID = TaskerMan.getTaskId("ExampleTask");

TaskerMan.stopTask( TaskID );
```

| Parameter   | Type       | Required | Description                                 |
| :---------- | :--------- | :------- | :------------------------------------------ |
| `id`        | `number`   | Yes      | Task ID on Task Manager.                    |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**
#### - logs -

| Type       | Description                   |
| :--------- | :---------------------------- |
| `SUCCESS`  | Inform Task had been stopped. |
| `ERROR`    | If Task does not exist.       |
| `ERROR`    | If Task is not active.        |

#### - returns -

| Type                | Status     | Description              |
| :------------------ | :--------- | :------------------------|
| `TaskManagerStatus` | `SUCCESS`  | Return SUCCESS.          |
| `TaskManagerStatus` | `ERROR`    | Return NOT_FOUND.        |
| `TaskManagerStatus` | `ERROR`    | Return BAD_REQUEST.      |


## Routines
Routine is a collection of tasks that can be executed in order and can be repeated.

---
### activeRoutines()
Return all **active** Routines of Task Manager.

```js
const activeRoutines = TaskerMan.activeRoutines();
```
#### - returns -

| Type                    | Status     | Description    |
| :---------------------- | :--------- | :------------- |
| `string []`             | `SUCCESS`  | Active Routines.  |

---
### inactiveRoutines()
Return all **inactive** Routines of Task Manager.

```js
const inactiveRoutines = TaskerMan.inactiveRoutines();
```
#### - returns -

| Type                    | Status     | Description         |
| :---------------------- | :--------- | :------------------ |
| `string []`             | `SUCCESS`  | Inactive Routines.  |
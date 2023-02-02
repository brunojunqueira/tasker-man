# Tasker Man(ager)

[![NPM version](http://img.shields.io/npm/v/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![Downloads](https://img.shields.io/npm/dm/tasker-man.svg)](https://www.npmjs.com/package/tasker-man)
[![Build Status](https://github.com/node-schedule/node-schedule/workflows/ci/badge.svg)](https://github.com/node-schedule/node-schedule/actions)

[![NPM](https://nodei.co/npm/tasker-man.png)](https://nodei.co/npm/tasker-man/)

A powerful and simple task manager.

Note: The old methods of TaskerMan are deprecated and I strongly recommend to use the new one implementation.

## Summary

#### General
- [Installation](#installation) 
- [Usage](#usage)

#### Documentation
- [TaskManager](#taskmanager)
	- [createTaskManager](#createTaskManager())
	- [activeTasks](#activeTasks())
  - [inactiveTasks](#inactiveTasks())
  - [append](#append())
  - [remove](#remove())
  - [getIdsByName](#getIdsByName())
  - [start](#start)
  - [abort](#abort)
- [Tasks](#tasks)
	- [createTask](#createTask())
- [DTR](#dtr)

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

#### import
```js
import { createTask, createTaskManager } from "tasker-man";
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

| Type                    |  Description    |
| :---------------------- |  :------------- |
| `Task []`               |  Active Tasks.  |


---
### inactiveTasks()
Return all **inactive** Tasks of Task Manager.

```js
const tasksID = manager.getIdsByName("ExampleTask");
manager.remove(TasksID[0]);
```
#### - returns -

| Type                    |  Description      |
| :---------------------- |  :--------------- |
| `Task []`               |  Inactive Tasks.  |

### append()
Push a task on TaskManager. Example:

```js
...
const manager = createTaskManager();

const task = createTask(taskCallback, taskOptions);
manager.append(task);
```

| Parameter   | Type       | Required | Description               |
| :---------- | :--------- | :------- | :------------------------ |
| `task`        | `Task`   | Yes      | A Task Instance.          |

---
### remove()
Delete a Task from Task Manager.
Example:
```js
...
manager.remove(0);
```

| Parameter   | Type       | Required | Description               |
| :---------- | :--------- | :------- | :------------------------ |
| `id`        | `number`   | Yes      | Task ID on Task Manager.  |

**OBS: Task ID Can be got by using 'getIdsByName( )' method!**

---
### getIdsByName()
Get Tasks IDs on Task Manager using a given name.
Example:
```js
const manager = createTaskManager(task1, task2, task3);
const tasksID = manager.getIdsByName("ExampleTask");

manager.remove(tasksID[0]);
```

| Parameter   | Type       | Required | Description                  |
| :---------- | :--------- | :------- | :--------------------------- |
| `name`      | `string`   | Yes      | Task name on Task Manager.   |

---
### start()
Start a Task on Task Manager.
Example:
```js
...
const tasksIDs = manager.getIDsByName("ExampleTask");

manager.start(tasksIDs[0]);
```

| Parameter   | Type       | Required | Description               |
| :---------- | :--------- | :------- | :------------------------ |
| `id`        | `number`   | Yes      | Task ID on Task Manager.  |

**OBS: Task ID Can be got by using 'getIDsByName( )' method!**

---
### abort()
Abort a Task from Task Manager.
Example:
```js
const tasksIDs = manager.getIDsByName("ExampleTask");

manager.abort(tasksIDs[0]);
```

| Parameter   | Type       | Required | Description              |
| :---------- | :--------- | :------- | :----------------------- |
| `id`        | `number`   | Yes      | Task ID on Task Manager. |

**OBS: Task ID Can be got by using 'getIDsByName( )' method!**


## Tasks
A Task is a object that execute a callback in selected time, with some parameters like delay and repeat.

### createTask()
Create a Task on Task Manager.

```js
function taskCallback(){
	console.log("Hello TaskerMan!");
}
const taskOptions = {
	repeat: 'endlessly',
	interval: '2s'
}
const task = createTask(taskCallback, taskOptions);
```

| Parameter   | Type       |Required| Description      |
| :---------- | :--------- |:------ |:-----------------|
| `callback`  | `function` | Yes    | Function will be executed by task. |
| `taskOptions`   | `TaskOptions`   | No    | Object that contain Task parameters. |

#### - TaskOptions -

| Parameter   | Type       | Description                                                    |
| :---------- | :--------- | :------------------------------------------------------------- |
| `name`      | `string`   | **Recommended**. Name used to identify a Task on Task Manager. |
| `repeat`    | `number` or `"endlessly"`  | Times task will repeat. If "endlessly", TaskManager will run the task forever. |
| `delay`    | `number` or `string`  | Time task will take to run for the first time. Follow **SST Rule**. |
| `interval`    | `number` or `string`  | Time task will take to repeat. Follow **SST Rule**. |


## SST
SST or *Simple Sequential Time* is a time set rule created to supply big time intervals in a simple and intuitive way.

### Format

DTR use a "-yy -mm -dd -h -m -s" format.

| Symbol | Reference |
|:-------|:----------|
| yy     | Year      |
| mm     | Month     |
| dd     | Day       |
| h      | Hour      |
| m      | Minute    |
| s      | Second    |

---
### Usage

You can use DTR with any time you need, since you put the time symbols in order `year -> month -> day -> hour -> minute -> second`.

Example:

	1yy 2mm 5dd 3h 45m 10s

This mean the time interval will be set to 1 year, 2 months, 5 days, 3 hours, 45 minutes and 10 seconds.

You also can skip some symbol and will still work since you keep the order.

Example:

 	3dd 30m

This mean the time interval will be set to 3 days and 30 minutes.
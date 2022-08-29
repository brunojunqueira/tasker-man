
# tasker-man

A simple task manager.
## Documentation

### createTask()
#### Create a Task on Task Manager.
Example:
```js
  function MyCustomTask(){
      console.log("I'm running!");
  }

  TaskerMan.createTask(MyCustomTask, 5);
```

| Parameter   | Type       |Required| Description                        |
| :---------- | :--------- |:------ |:---------------------------------- |
| `callback`  | `function` | `Yes`  | Function will be executed by task. |
| `timeout`   | `number`   | `Yes`  | Delay Timeout in **seconds**. If 0 Task will run instantly and **cannot** repeat |
| `options`   | `object`   | `No`   | Task options                       |

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
  } );
```
#### - logs -

| Type       | Description                                                    |
| :--------- | :------------------------------------------------------------- |
| `Success`  | Inform Task had been created. |
| `Error`    | If timeout be lesser than 1s and not equal 0. |
| `Advertise`| If Task does not received a name. |

---
### deleteTask()
#### Delete a Task from Task Manager.
Example:
```js
  TaskerMan.deleteTask( 0 );
```

| Parâmetro   | Tipo       | Required | Descrição                                   |
| :---------- | :--------- | :------- | :------------------------------------------ |
| `id`        | `number`   | `Yes`    | Task ID on Task Manager.                    |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**

#### - logs -

| Type       | Description                                                    |
| :--------- | :------------------------------------------------------------- |
| `Success`  | Inform Task had been deleted. |
| `Error`    | If Task does not exist. |
| `Error`    | If Task is active. |

---
### getTaskId()
#### Get Task ID on Task Manager using it name.
Example:
```js
  const TaskID = TaskerMan.getTaskId("ExampleTask");

  TaskerMan.deleteTask(TaskID);
```

| Parâmetro   | Tipo       | Required | Descrição                                   |
| :---------- | :--------- | :------- | :------------------------------------------ |
| `name`      | `string`   | `Yes`    | Task name on Task Manager.                  |

---
### startTask()
#### Start a Task on Task Manager.
Example:
```js
  const TaskID = TaskerMan.getTaskId("ExampleTask");

  TaskerMan.startTask( TaskID );
```

| Parâmetro   | Tipo       | Required | Descrição                                   |
| :---------- | :--------- | :------- | :------------------------------------------ |
| `id`        | `number`   | `Yes`    | Task ID on Task Manager.                    |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**
#### - logs -

| Type       | Description                                                    |
| :--------- | :------------------------------------------------------------- |
| `Success`  | Inform Task had been started. |
| `Error`    | If Task does not exist. |
| `Error`    | If Task is already active. |

---
### stopTask()
#### Stop a Task on Task Manager.
Example:
```js
  const TaskID = TaskerMan.getTaskId("ExampleTask");

  TaskerMan.stopTask( TaskID );
```

| Parâmetro   | Tipo       | Required | Descrição                                   |
| :---------- | :--------- | :------- | :------------------------------------------ |
| `id`        | `number`   | `Yes`    | Task ID on Task Manager.                    |

**OBS: Task ID Can be got by using 'getTaskId( )' function!**
#### - logs -

| Type       | Description                                                    |
| :--------- | :------------------------------------------------------------- |
| `Success`  | Inform Task had been stopped. |
| `Error`    | If Task does not exist. |
| `Error`    | If Task is not active. |

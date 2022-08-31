import TaskerMan from '../lib/index';

TaskerMan.createTask(()=>{console.log("I'm running")}, 2, {
    name: "ExampleTask",
    repeat: true
});
const TaskID = TaskerMan.getTaskId("ExampleTask");
TaskerMan.startTask(TaskID);

console.log(TaskerMan.inactiveTasks());
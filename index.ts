import Task from "./Task/index.js"

class TaskManager{
    name : string
    tasks : Task []
    activeTasks: Task []
    inactiveTasks: Task []

    constructor(){
        this.tasks = [];
    }

    private findTaskIndex(list: Task [], id: number){
        for(let i = 0; i < list.length; i++){
            if(list[i].id === id)
                return i;
        }
    }

    /**
     * @brief Remove a Task from list.
     * @param id [optional/required] Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
     * @log [ SUCCESS ] - Informe task has been deleted.
     * @log [ ERROR ] - If Task does not exist.
     * @log [ ERROR ] - If Task is active.
     */
    private removeTask(list: Task[], id: number){
        let length = list.length;
        for(let i = id; i < length; i++){
            if(i+1 === length){
                list = list.slice(0, length-1);
            } else {
                if(list[i+1].name === `Task ${i+1}`)
                    list[i+1].name =`Task ${i}`;
                list[i+1].id = i;
                list[i] = list[i+1];
            }
        }
        return list;
    }
    /**
     * 
     * @param name [ required ] - Task's NAME on TaskManager.
     * @returns 
     */
    getTaskId(name: string){
        for(let i = 0; i < this.tasks.length; i++){
            if(this.tasks[i].name === name)
                return this.tasks[i].id;
        }
        return null;
    }
    /**
     * @brief Create a new Task to current TaskManager.
     * @param callback [ () => Any ] Function that will be executed by task.
     * @param timeout [ Number ] - Time delay in seconds task will be executed. ( If timeout be 0, task will execute instantly. And CAN NOT be repeated. )
     * @param repeat [ Boolean ] - Task will repeat?
     * @param name [ String ] - Give the task a name.
     * @log 
     */
    createTask(callback : ()=>any, timeout:number, repeat?:boolean, name?: string){
        if(timeout < 1 && timeout > 0 || timeout < 0){
            console.error("[ ERROR ] - To avoid issues, timeout cannot be lesser than 1s or negative. If your looking for delay or fast repeated tasks, please use 'setTimeout()' or 'setInterval()'. Task NOT created!");
            return;
        }
        if(!name){
            console.log("[ ADVERTISE ] - We recommended to name Tasks for easily manipulation.");
        }
        if(timeout === 0){
            repeat = false;
        }
        this.tasks.push( new Task( this.tasks.length, callback, timeout, repeat, name ) );
    }
    /**
     * @brief Start an inactive Task from current TaskManager.
     * @param id [ required ] - Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
     * @log [ SUCCESS ] - Informe task has been started.
     * @log [ ERROR ] - If Task does not exist.
     * @log [ ERROR ] - If Task is already active.
     */
    startTask(id: number){
        if(!this.tasks[id]){
            console.error("[ ERROR ] - This Task doesnt exists");
            return;
        }
        this.tasks[id].start();
        this.activeTasks.push(this.tasks[id]);
    }
    /**
     * @brief Stop an active Task from current TaskManager.
     * @param id [ required ] - Task's ID on TaskManager. OBS: Can be got by using 'getTaskId( )' function!
     * @log [ SUCCESS ] - Informe task has been stopped.
     * @log [ ERROR ] - If Task does not exist.
     * @log [ ERROR ] - If Task is not active.
     */
    stopTask(id: number){

        if(!this.tasks[id]){
            console.error("[ ERROR ] - This Task does not exists!");
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
    deleteTask(id: number){
        if(!this.tasks[id]){
            console.error("[ ERROR ] - This Task does not exists!");
            return;
        }
        if(this.tasks[id].isActive){
            console.error("[ ERROR ] - This Task is active! Please, stop Task before delete!");
            return;
        }
        this.removeTask(this.tasks, id);
        console.log(`[ SUCCESS ] - Task ${id} has been deleted!`);
    }
    
}

export default new TaskManager();
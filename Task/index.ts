export default class Task{
    name : string
    id : number
    isActive: boolean

    readonly callback : () => any
    readonly repeat : boolean = false
    readonly time : number

    private interval : number
    private timeout : number

    constructor(id: number, callback: () => any, time: number, repeat? : boolean, name?: string){
        this.name = name ?? `Task ${id}`;
        this.id = id;
        this.callback = callback;
        this.repeat = repeat ?? false;
        this.time = time*1000;
        this.isActive = false;
        console.log(`[ SUCCESS ] - #${this.id} ${this.name} has been created!`);
    }
    /**
     * @brief Start the task.
     * @log [ SUCCESS ] Informe task has been started.
     * @log [ ERROR ] If task is already active.
     */
    async start() : Promise<void> {
        if(this.isActive){
            console.error(`[ ERROR ] - #${this.id} ${this.name} is already active`);
            return;
        }
        if(this.repeat){
            this.interval = setInterval(() => {
                try{
                    this.callback();
                } catch (e){
                    console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
                }
                
            }, this.time);
        } else {
            this.timeout = setTimeout(()=>{
                try{
                    this.callback();
                } catch (e){
                    console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
                }
            }, this.time);
        }
        this.isActive = true;
        console.log(`[ SUCCESS ] - #${this.id} ${this.name} started`);
    }
    /**
     * @brief Stop the task.
     * @log [ SUCCESS ] Informe task has been stopped.
     * @log [ ERROR ] If task is not active.
     */
    stop(){
        if(!this.isActive){
            console.error(`[ ERROR ] - #${this.id} ${this.name} is not active`);
            return;
        }
        if(this.repeat){
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
    run(){
        try {
            this.callback();
        } catch (e) {
            console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
    }
}

'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Task {
    constructor(id, callback, time, repeat, name) {
        this.repeat = false;
        this.name = name !== null && name !== void 0 ? name : `Task ${id}`;
        this.id = id;
        this.callback = callback;
        this.repeat = repeat !== null && repeat !== void 0 ? repeat : false;
        this.time = time * 1000;
        this.isActive = false;
        console.log(`[ SUCCESS ] - #${this.id} ${this.name} has been created!`);
    }
    /**
     * @brief Start the task.
     * @log [ SUCCESS ] Informe task has been started.
     * @log [ ERROR ] If task is already active.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isActive) {
                console.error(`[ ERROR ] - #${this.id} ${this.name} is already active`);
                return;
            }
            if (this.repeat) {
                this.interval = setInterval(() => {
                    try {
                        this.callback();
                    }
                    catch (e) {
                        console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
                    }
                }, this.time);
            }
            else {
                this.timeout = setTimeout(() => {
                    try {
                        this.callback();
                    }
                    catch (e) {
                        console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
                    }
                }, this.time);
            }
            this.isActive = true;
            console.log(`[ SUCCESS ] - #${this.id} ${this.name} started`);
        });
    }
    /**
     * @brief Stop the task.
     * @log [ SUCCESS ] Informe task has been stopped.
     * @log [ ERROR ] If task is not active.
     */
    stop() {
        if (!this.isActive) {
            console.error(`[ ERROR ] - #${this.id} ${this.name} is not active`);
            return;
        }
        if (this.repeat) {
            clearInterval(this.interval);
        }
        else {
            clearTimeout(this.timeout);
        }
        this.isActive = false;
        console.log(`[ SUCCESS ] - #${this.id} ${this.name} stopped`);
    }
    /**
     * @brief Run task once.
     * @log [ SUCCESS ] Informe task had been executed.
     */
    run() {
        try {
            this.callback();
        }
        catch (e) {
            console.error(`[ ERROR ] - #${this.id} ${this.name} callback presented the follow error: ${e}`);
        }
    }
}

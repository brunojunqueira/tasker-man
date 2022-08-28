import Task from '../Task/index.js'

interface RoutineOptions{
    order : number [],
    repeat: boolean,

}

class Routine{
    tasks: Task []

    constructor(tasks: Task [], options? :RoutineOptions){

    }
}

module.exports = Routine;
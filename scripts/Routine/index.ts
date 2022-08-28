'use strict';

import Task from '../Task/index.js'

interface RoutineOptions{
    order : number [],
    repeat: boolean,

}

export default class Routine{
    tasks: Task []

    constructor(tasks: Task [], options? :RoutineOptions){

    }
}
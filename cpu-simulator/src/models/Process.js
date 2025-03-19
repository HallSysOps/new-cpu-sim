class Process {
    constructor(pid, arrivalTime, burstTime, priority){
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this._burstTime = burstTime; // Requested Time (Time to complete process)
        this.priority = priority;
        this.isExecuting = false;
        this.timeAllotment = 0; // Tracks how long the process has been running for in current time slice

        this.completionTime = 0;
        this.startTime = null;
        this.currentTime = null; // Storing reference to the current time
    }

    reducePriority(){ // Used for MLFQ, reduce priority once time allotment is used
        this.priority += 1;
        if (this.priority < 0) this.priority = 0;
    }

    resetProcess(){ // Used for MLFQ, reset process after a period, S
        this.priority = 0;
        this.timeAllotment = 0;
        this.isExecuting = false;
    }

    getTurnaroundTime(){
        return this.completionTime - this.arrivalTime;
    }

    getResponseTime(){
        return this.startTime - this.arrivalTime;
    }

    get burstTime(){
        return this._burstTime;
    }

    set burstTime(value){
        if(this.startTime === null){
            this.startTime = this.currentTime; // Set startTime only on the first modification of burstTime
        }
        this._burstTime = value;
    }
}

function generateProcesses(n){
    const queue = new Queue();
    const processes = [];

    for(let i = 0; i < n ; i++){
        const arrivalTime = generateRandomN(0, 10); // 0-10s arrival time
        const burstTime = generateRandomN(2, 10); // 2-10s burst time
        const priority = 0; // Rule 3 from https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-multi.pdf: When job enters system, it is placed at highest priority
        
        const process = new Process(i, arrivalTime, burstTime, priority);
        processes.push(process);
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime); // Sorting by arrivalTime
    processes.forEach(process => queue.enqueue(process)); // Setting up the process queue

    return queue;
}

function generateRandomN(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Array implementation of Queue
class Queue{
    constructor(){
        this.items = [];
        this.completedProcesses = []; // Store completed/terminated processes
    }

    enqueue(process){
        this.items.push(process);
    }

    dequeue(){ // Completion Time equals the tick when dequeue is called
        const process = this.items.shift();
        process.completionTime = process.currentTime;
        if(process){
            this.completedProcesses.push(process);
        }
        return process;
    }

    peek(){
        return this.items[0];
    }

    isEmpty(){
        return this.items.length === 0;
    }
    getItems(){
        return [...this.items];
    }

    getAvgTurnaroundTime(){
        const sum = this.completedProcesses.reduce((acc, p) => acc + p.getTurnaroundTime(), 0);
        return sum / this.completedProcesses.length;
    }

    getAvgResponseTime(){
        const sum = this.completedProcesses.reduce((acc, p) => acc + p.getResponseTime(), 0);
        return sum / this.completedProcesses.length;
    }

    getStats(){
        if (this.completedProcesses.length === 0) return null;
        return{
            avgTurnAroundTime: this.getAvgTurnaroundTime().toFixed(2),
            avgResponseTime: this.getAvgResponseTime().toFixed(2),
            totalProcesses: this.completedProcesses.length
        };
    }
}

export {generateProcesses, Queue, Process};
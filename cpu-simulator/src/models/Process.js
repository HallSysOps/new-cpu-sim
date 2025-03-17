class Process {
    constructor(pid, arrivalTime, burstTime, priority){
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime; // Requested Time (TIme to complete process)
        this.priority = priority;
        this.isExecuting = false;
        this.timeAllotment = 0; // Tracks how long the process has been running for in current time slice
    }

    reducePriority(){ // Used for MLFQ, reduce priority once time allotment is used
        this.priority -= 1;
        if (this.priority < 0) this.priority = 0;
    }

    resetProcess(){ // Used for MLFQ, reset process after a period, S
        this.priority = 0;
        this.executionTime = 0;
        this.timeAllotment = 0;
        this.isExecuting = false;
    }
}

function generateProcesses(n){
    const queue = new Queue();
    const processes = [];

    for(let i = 0; i < n ; i++){
        const arrivalTime = generateRandomN(0, 5); // 0-10s arrival time
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
    }

    enqueue(process){
        this.items.push(process);
    }

    dequeue(){
        return this.items.shift();
    }

    peek(){
        return this.items[0];
    }

    isEmpty(){
        return this.items.length === 0;
    }
}

export {generateProcesses, Queue, Process};
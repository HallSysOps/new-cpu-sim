import { Queue } from "../models/Process";

export function mlfq(queue, timeQuantum, timeAllotment, S, subS){

    // Rule 1. Priority(A) > Priority(B) = Run(A)
    // Rule 2. If Priority(A) = Priority(B) = RunRoundRobin(A,B)
    // Rule 3. When job enters queue = Place at highest priority => Implemented when process is created, priority is equal to zero
    // Rule 4. Once a job uses up its time allotment, its priority is reduced by 1
    // Rule 5. After some time period, S, move all jobs to the highest priority

    // subS tracks the time since last S

    if(!queue.isEmpty()){
        subS += 1;

        if(subS >= S){
            queue.items.forEach(p => p.resetProcess()); // Rule 5: Reset after some time period, S
            subS = 0;
        }

        queue.items.sort((a, b) => a.priority - b.priority); 

        let process = queue.peek();

        if(process.timeAllotment >= timeAllotment){
            process.reducePriority(); // Rule 4: Reduce priority once jobs uses up its time allotment
            process.timeAllotment = 0;
            
            queue.items.sort((a, b) => a.priority - b.priority);
            process = queue.peek(); // Get new highest priority process
        }

        const highestPriority = process.priority; // Rule 1: Get highest priority
        const rrQueue = new Queue();
        const nonrrQueue = new Queue();

        queue.items.forEach(p => {
        if (p.priority === highestPriority) {
            rrQueue.enqueue(p); // Pass by reference
        } else {
            nonrrQueue.enqueue(p);
        }
        });

        if(rrQueue.items.length > 1){
            roundRobin(rrQueue, timeQuantum); // Rule 2: Round Robin scheduling for processes with same priority
            queue.items = [...rrQueue.items, ...nonrrQueue.items];
        }
        else{
            process.burstTime -= 1; // Rule 1: Run process with highest priority
            if(process.burstTime === 0){
                queue.dequeue();
            }
            process.timeAllotment += 1;
        }
        return subS;
    }
}

function roundRobin(queue, timeQuantum) {
    if (!queue.isEmpty()) {
        let process = queue.peek();

        // If process has used full time slice, dequeue and enqueue it
        if (process.timeAllotment >= timeQuantum) {
            queue.dequeue();
            if (process.burstTime > 0) {
                queue.enqueue(process); // enqueue if process is not finished
            }
            process.timeAllotment = 0;
        } else {
            process.burstTime -= 1;

            if (process.burstTime === 0) {
                queue.dequeue();
            }

            process.timeAllotment += 1;
        }
    }
}
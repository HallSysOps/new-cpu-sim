import { Queue } from "../models/Process";
import {rr} from "./rr";

export function mlfq(queue, timeQuantum, timeAllotment, S, subS, currentTime){

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
        let a = 0, b = 0;

        while (b < queue.items.length && queue.items[b].priority === highestPriority) {
            b++;
        }

        process.currentTime = currentTime;

        if(b - a > 1){
            rr(queue, timeQuantum, currentTime); // Rule 2: Round Robin scheduling for processes with same priority => BROKEN
            //queue.items = [...rrQueue.items, ...nonrrQueue.items];
        }
        else{
            process.burstTime -= 1; // Rule 1: Run process with highest priority
            process.timeAllotment += 1;

            if(process.burstTime === 0){
                queue.dequeue();
            }
        }
        return subS;
    }
}

function roundRobin(queue, timeQuantum, currentTime, a, b) {
    if (a < b) {
        let process = queue.items[a]; 
        process.currentTime = currentTime;

        // If process has used full time slice, dequeue and enqueue it
        if (process.timeAllotment >= timeQuantum) {
            queue.items.splice(0, 1); // Remove the first process
            queue.items.splice(b - 1, 0, process); // Insert element at position b
            if (process.burstTime > 0) {
                queue.items[b] = process; // enqueue if process is not finished, place at position b
            }
            process.timeAllotment = 0;
            
            process = queue.items[a];
            process.burstTime -= 1;
            process.timeAllotment += 1;

            if (process.burstTime === 0) {
                queue.dequeue();
            }
        } else {
            process.burstTime -= 1;

            if (process.burstTime === 0) {
                queue.dequeue();
            }

            process.timeAllotment += 1;
        }
    }
}
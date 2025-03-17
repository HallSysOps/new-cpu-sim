import { Queue } from "../models/Process";
import { rr } from "./rr";

export function mlfq(queue, timeSlice, currentTimeSlice, S, subS, timeAllotment, subTimeAllotment){
    // Rule 1. Priority(A) > Priority(B) = Run(A)
    // Rule 2. If Priority(A) = Priority(B) = RunRoundRobin(A,B)
    // Rule 3. When job enters queue = Place at highest priority => Implemented when process is created, priority is equal to zero
    // Rule 4. Once a job uses up its time allotment, its priority is reduced by 1
    // Rule 5. After some time period, S, move all jobs to the highest priority

    // subS tracks the time since last S
    /* 
        Implementation:
            1. Interval Boost Handling => if(subs >= S)
            2. Sort Queue by priority
                2a. if first process isExecuting, executingFor++
                2b. if first process !isExecuting, isExecuting = true, foreach(p in queue => p.executingFor = 0), executingFor++
            3. Time Allotment Handling => if(executingFor === timeAllotment), priority -= 1
            4. Run Round Robin on filteredQueue if filteredQueue.length > 1
            5. Run process otherwise
    */

    if(!queue.isEmpty()){
        subS += 1;
        if (subsS >= S) {
            queue.items.forEach(p => p.priority = 0); // Reset priority if currentTimeSlice = S => Rule 5
            subS = 0; // Reset currentTimeSlice
        }
        queue.items.sort((a, b) => a.priority - b.priority); // Sorting by priority => Rule 1

        const priorityLevel = queue.peek().priority;
        const filteredQueue = new Queue();

        queue.items.forEach(process => {
            if(process.priority === priorityLevel){
                filteredQueue.enqueue(process); // Getting all equal priority processes => Rule 2
            }
        });

        if(!filteredQueue.isEmpty()){
            currentTimeSlice = rr(filteredQueue, timeSlice, currentTimeSlice); // Running Round Robin for equal priority processes => Rule 2
        }
        else{
            let process = queue.peek();
            process.burstTime -= 1;

            if(process.burstTime === 0){
                queue.dequeue();
            }
        }
    }
    return {currentTimeSlice, subS};
}
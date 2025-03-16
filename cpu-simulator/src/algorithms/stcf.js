import { Queue } from "../models/Process";

export function stcf(queue){
    // Sort all jobs currently in queue by shorest time then run shortest job
    if (!queue.isEmpty()) {
        // Sort the queue based on burstTime (ascending order)
        queue.items.sort((a, b) => a.burstTime - b.burstTime);

        let process = queue.peek(); // Get process with shortest burst time
        process.burstTime -= 1;

        if (process.burstTime === 0) {
            queue.dequeue(); // Remove process when burst time reaches 0
        }
    } 
}
import { Process } from "../models/Process";
export function updateArrivedQueue(currentTime, processQueue, arrivedQueue) {
    while (!processQueue.isEmpty() && processQueue.peek().arrivalTime <= currentTime) {
        let process = processQueue.dequeue(); // Remove from processQueue
        arrivedQueue.enqueue(process); // Add to arrivedQueue
    }
}

export function updateQueues(currentTime, processQueue, queues){
    while (!processQueue.isEmpty() && processQueue.peek().arrivalTime <= currentTime) {
        let process = processQueue.dequeue(); // Remove from processQueue
        queues.forEach(q => {
            q.enqueue(new Process(process.pid, process.arrivalTime, process.burstTime, process.priority));
        });
    }
}
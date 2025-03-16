export function updateArrivedQueue(currentTime, processQueue, arrivedQueue) {
    while (!processQueue.isEmpty() && processQueue.peek().arrivalTime <= currentTime) {
        let process = processQueue.dequeue(); // Remove from processQueue
        arrivedQueue.enqueue(process); // Add to arrivedQueue
    }
}
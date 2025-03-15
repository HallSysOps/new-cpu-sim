export function rr(queue, timeSlice, currentTimeSlice) {
    if (!queue.isEmpty()) {
        let process = queue.peek();

        //console.log(`Current Time Slice: ${currentTimeSlice}`);
        //console.log(`Process Burst Time: ${process.burstTime}`);

        // If process has used full time slice, dequeue and enqueue it
        if (currentTimeSlice >= timeSlice) {
            queue.dequeue();
            if (process.burstTime > 0) {
                queue.enqueue(process); // enqueue if process is not finished
            }
            return 0; // Reset time slice
        } else {
            process.burstTime -= 1;

            if (process.burstTime === 0) {
                queue.dequeue();
                return 0; // Reset time slice for the next process
            }

            return currentTimeSlice + 1; // Increment time slice for current process
        }
    }
    return 0; // Restart currentTimeSlice if queue is empty
}
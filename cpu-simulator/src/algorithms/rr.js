export function rr(queue, timeQuantum, currentTime) {
    if (!queue.isEmpty()) {
        let process = queue.peek();
        process.currentTime = currentTime;

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
//{/* Input field for time slice */}
//<label>Time Slice:</label>
//<input
//    type="number"
//    value={timeSlice}
//    onChange={(e) => setTimeSlice(Number(e.target.value))}
//    min="1"
///>
//{/* Display current time slice */}
//<h2>Current Time Slice: {currentTimeSlice}</h2> {/* Show current time slice */}

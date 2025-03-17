export function rr(queue, timeSlice) {
    if (!queue.isEmpty()) {
        let process = queue.peek();

        // If process has used full time slice, dequeue and enqueue it
        if (process.timeAllotment >= timeSlice) {
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

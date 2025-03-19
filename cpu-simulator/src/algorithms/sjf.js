export function sjf(queue, currentTime){
    if (!queue.isEmpty()) {
        let process = queue.peek();
        process.currentTime = currentTime;

        if(!process.isExecuting){
            queue.items.sort((a, b) => a.burstTime - b.burstTime);
            process = queue.peek();
            process.isExecuting = true;
        }

        process.burstTime -= 1;

        if(process.burstTime === 0){
            queue.dequeue();
        }
    }
}
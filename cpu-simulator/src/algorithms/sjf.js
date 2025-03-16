export function sjf(queue, isRunning){
    if (!queue.isEmpty()) {
        if(!isRunning){
            queue.items.sort((a, b) => a.burstTime - b.burstTime);
            return true;
        }

        let process = queue.peek();
        process.burstTime -= 1;

        if(process.burstTime === 0){
            queue.dequeue();
            return false;
        }
    }

    return isRunning; 
}
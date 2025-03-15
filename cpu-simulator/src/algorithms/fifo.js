export function fifo(queue, currentTime){
    if(!queue.isEmpty()){
        let process = queue.peek();

        process.burstTime -= 1;

        if(process.burstTime == 0){
            queue.dequeue();
        }
    }
    //return queue; This is not needed because in js objects are modified by ref
}
import { Queue } from "../models/Process";

export function sjf(queue, currentTime){
    if(!queue.isEmpty()){
        let arrivedProcesses = queue.items.filter(p => p.arrivalTime <= currentTime);
        if(arrivedProcesses.length >= 1){
            arrivedProcesses.sort((a,b) => a.burstTime - b.burstTime);

            let process = arrivedProcesses[0];
            process.burstTime -= 1;

            if(process.burstTime == 0){
                queue.dequeue();
            }
        }
    }    
}
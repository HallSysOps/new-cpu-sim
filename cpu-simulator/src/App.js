import React, {useState, useEffect} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses, Queue } from './models/Process';
import BarChart from './components/currentQueue';
import { fifo } from './algorithms/fifo';
import { stcf } from './algorithms/stcf';
import { updateArrivedQueue } from './algorithms/updateArrivedQueue';
import {rr} from './algorithms/rr';
import { sjf } from './algorithms/sjf';
import { mlfq } from './algorithms/mlfq';


function App() {
  /*
  const handleDownloadPDF = () => {
    // Get the canvas element (assuming Chart.js renders it with a ref)
    const canvas = document.querySelector('canvas'); // Modify this to match your chart
    if (canvas) {
      const imgData = canvas.toDataURL('image/png'); // Convert the canvas to a base64 PNG image

      const doc = new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // Adjust the dimensions (10, 10, 180, 160) as needed
      doc.save('chart.pdf'); // Save the PDF with the name 'chart.pdf'
    }
      */
     const [currentTime, setCurrentTime] = useState(0); // Used to track time once processes have been generated
     const [numProcesses, setNumProcesses] = useState(5); // Default 5 processes
     const [processQueue, setProcessQueue] = useState(new Queue());
     const [arrivedQueue, setArrivedQueue] = useState(new Queue());
     const [isRunning, setIsRunning] = useState(false);
     const [timeQuantum, setTimeQuantum] = useState(3) // Default 3s time-quantum for round robin
     const [timeAllotment, setTimeAllotment] = useState(10) // Default 10s Time allotment before priority is reduced for MLFQ
     const [subS, setSubS] = useState(0);
     const [S, setS] = useState(3); // Default 3s Boost Interval
     const [selectedAlgorithm, setSelectedAlgorithm] = useState('fifo');

     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses));
      setCurrentTime(0);
      setProcessQueue(queue);
      setArrivedQueue(new Queue());
      setIsRunning(false);
      setSubS(0);
  };
  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
        updateArrivedQueue(currentTime, processQueue, arrivedQueue);
        
        //fifo(arrivedQueue); // This automatically updates the chart as well

        //stcf(arrivedQueue);

        //rr(arrivedQueue, timeQuantum);

        //sjf(arrivedQueue);

        //const updatedSubS = mlfq(arrivedQueue, timeQuantum, timeAllotment, S, subS);
        //setSubS(updatedSubS);

        //TODO: Implement other algos and test in here 
        //TODO: Implement method to run all functions at the same time
        //TODO: Allow user to download results as a pdf(?) => get stats of completion, turnaround, etc?
        if (selectedAlgorithm === 'all') {
          // Run all algorithms with separate copies
          fifo(new Queue(arrivedQueue.items));
          stcf(new Queue(arrivedQueue.items));
          rr(new Queue(arrivedQueue.items), timeQuantum);
          sjf(new Queue(arrivedQueue.items));
          setSubS(mlfq(new Queue(arrivedQueue.items), timeQuantum, timeAllotment, S, subS));
        } else {
          // Run only the selected algorithm
          if (selectedAlgorithm === 'fifo') fifo(arrivedQueue);
          else if (selectedAlgorithm === 'stcf') stcf(arrivedQueue);
          else if (selectedAlgorithm === 'rr') rr(arrivedQueue, timeQuantum);
          else if (selectedAlgorithm === 'sjf') sjf(arrivedQueue);
          else if (selectedAlgorithm === 'mlfq') setSubS(mlfq(arrivedQueue, timeQuantum, timeAllotment, S, subS));
        }
    }, 1000);

    return () => clearInterval(interval);
}, [isRunning, currentTime, processQueue, timeQuantum, selectedAlgorithm]);


  return (
    <div className="App">
      <h1>Process Scheduler</h1>

      <label>Select Algorithm:</label>
      <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
        <option value="fifo">FIFO</option>
        <option value="stcf">STCF</option>
        <option value="rr">Round Robin</option>
        <option value="sjf">SJF</option>
        <option value="mlfq">MLFQ</option>
        <option value="all">Run All</option>
      </select>

      <button onClick={handleGenerateProcesses}>Generate Processes</button>
      <button onClick={handleStartSimulation} disabled={isRunning}>Start Simulation</button>

      <h2>Processes Waiting to Arrive</h2>
      <BarChart data={processQueue} />

      <h2>Processes in Job Scheduler ({selectedAlgorithm.toUpperCase()})</h2>
      <BarChart data={arrivedQueue} />
    </div>
  );
}

export default App;

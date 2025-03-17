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

        const updatedSubS = mlfq(arrivedQueue, timeQuantum, timeAllotment, S, subS);
        setSubS(updatedSubS);

        //TODO: Implement other algos and test in here 
        //TODO: Find out a way to pass functions as an argument to allow a user to pick what algo they want to run
        //TODO: Implement method to run all functions at the same time
        //TODO: Allow user to download results as a pdf(?) => get stats of completion, turnaround, etc?
    }, 1000);

    return () => clearInterval(interval);
}, [isRunning, currentTime, processQueue, arrivedQueue, timeQuantum]);


  return (
    <div className="App">
      <h1>Process Scheduler</h1>
      
      {/* Input field for number of processes */}
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(e.target.value)}
        min="1"
      />
      
      {/* Button to generate processes */}
      <button onClick={handleGenerateProcesses}>Generate Processes</button>

      {/* Start Simulation button */}
      <button onClick={handleStartSimulation} disabled={isRunning}>Start Simulation</button>

      {/* Charts */}
      <h2>Processes Waiting to Arrive</h2>
      <BarChart data={processQueue} />

      {/* Input field for time-quantum */}
      <label>Time-Quantum:</label>
      <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(Number(e.target.value))}
          min="1"
      />
      {/* Input field for time allotment */}
      <label>Time Allotment:</label>
      <input
          type="number"
          value={timeAllotment}
          onChange={(e) => setTimeAllotment(Number(e.target.value))}
          min="1"
      />
      {/* Input field for time-quantum */}
      <label>Boost Interval (S):</label>
      <input
          type="number"
          value={S}
          onChange={(e) => setS(Number(e.target.value))}
          min="1"
      />

      <h2>Processes in Job Scheduler</h2>
      <BarChart data={arrivedQueue} />
    </div>
  );
}

export default App;

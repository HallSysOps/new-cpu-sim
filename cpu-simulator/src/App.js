import React, {useState, useEffect} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses, Queue } from './models/Process';
import BarChart from './components/currentQueue';
import { fifo } from './algorithms/fifo';
import { sjf } from './algorithms/sjf';
import { updateArrivedQueue } from './algorithms/updateArrivedQueue';


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

     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses));
      setCurrentTime(0);
      setProcessQueue(queue);
      setArrivedQueue(new Queue());
      setIsRunning(false);
  };
  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
        updateArrivedQueue(currentTime, processQueue, arrivedQueue);
        // May need to create a queue that drops a process into an algo's queue when currentTime == arrivalTime
        fifo(arrivedQueue, currentTime); // This automatically updates the chart as well
        //TODO: Implement other algos and test in here 
        //TODO: Find out a way to pass functions as an argument to allow a user to pick what algo they want to run
        //TODO: Implement method to run all functions at the same time
        //TODO: Allow user to download results as a pdf(?) => get stats of completion, turnaround, etc?
    }, 1000);

    return () => clearInterval(interval);
}, [isRunning, currentTime, processQueue, arrivedQueue]);


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

      <h2>Processes Waiting to Arrive</h2>
      <BarChart data={processQueue} />

      <h2>Processes in Job Scheduler</h2>
      <BarChart data={arrivedQueue} />
    </div>
  );
}

export default App;

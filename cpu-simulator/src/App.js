import React, {useState, useEffect} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses, Queue } from './models/Process';
import BarChart from './components/currentQueue';
import { fifo } from './algorithms/fifo';


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

     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses));
      setCurrentTime(0);
      setProcessQueue(queue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);

        fifo(processQueue, currentTime); // This automatically updates the chart as well

    }, 1000);

    return () => clearInterval(interval);
}, [processQueue, currentTime]);


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
      <BarChart data={processQueue}/>
    </div>
  );
}

export default App;

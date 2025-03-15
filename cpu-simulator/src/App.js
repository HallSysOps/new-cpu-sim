import React, {useState} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses } from './models/Process';
import BarChart from './components/currentQueue';


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
     const [numProcesses, setNumProcesses] = useState(5); // Default 5 processes
     const [processQueue, setProcessQueue] = useState({
      pids: [],
      values: []
     });

     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses));
      const pids = queue.items.map(p => 'PID: '+ p.pid); // Just used for x-labels
      const values = queue.items.map(p => p);
      setProcessQueue({pids, values});
  };

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

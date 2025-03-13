import React, {useState} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses } from './models/Process';


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
     const [processQueue, setProcessQueue] = useState(null);

     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses)); //TODO: Make this take some int from the user
      setProcessQueue(queue.items);
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

      {/* Display the generated processes */}
      {processQueue && (
        <div>
          <h2>Generated Processes</h2>
          <ul>
            {processQueue.map((process) => (
                <li key={process.id}>
                  <strong>Process {process.id}</strong> - Arrival Time: {process.arrivalTime}, Burst Time: {process.burstTime}, Priority: {process.priority}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

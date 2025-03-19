import React, {useState, useEffect} from 'react';
import './App.css';
import Chart from './components/Chart'; // Delete when needed
import {jsPDF} from "jspdf";
import { generateProcesses, Queue } from './models/Process';
import BarChart from './components/currentQueue';
import { fifo } from './algorithms/fifo';
import { stcf } from './algorithms/stcf';
import { updateArrivedQueue, updateQueues } from './algorithms/updateArrivedQueue';
import {rr} from './algorithms/rr';
import { sjf } from './algorithms/sjf';
import { mlfq } from './algorithms/mlfq';


function App() {
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

     // Independent arrivedQueues for each scheduler when Run All is selected
      const [fifoQueue, setFifoQueue] = useState(new Queue());
      const [stcfQueue, setStcfQueue] = useState(new Queue());
      const [rrQueue, setRrQueue] = useState(new Queue());
      const [sjfQueue, setSjfQueue] = useState(new Queue());
      const [mlfqQueue, setMlfqQueue] = useState(new Queue());


     const handleGenerateProcesses = ()=>{
      const queue = generateProcesses(Number(numProcesses));
      setCurrentTime(0);
      setProcessQueue(queue);
      setArrivedQueue(new Queue());
      setIsRunning(false);
      setSubS(0);

      setFifoQueue(new Queue());
      setStcfQueue(new Queue());
      setRrQueue(new Queue());
      setSjfQueue(new Queue());
      setMlfqQueue(new Queue());
  };

  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  const renderStats = (stats) => {
    if(!stats) return null;
    return (
      <div>
        <h3>Simulation Results</h3>
          <p>Average Turnaround Time: {stats.avgTurnAroundTime} seconds</p>
          <p>Average Response Time: {stats.avgResponseTime} seconds</p>
          <p>Total Processes Completed: {stats.totalProcesses}</p>
      </div>
    );
  };
  const handleDownloadPDF = () => {
    const stats = arrivedQueue.getStats();
    if(!stats) return null;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedAlgorithm.toUpperCase()} Results`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Average Turnaround Time: ${stats.avgTurnAroundTime} seconds`, 10, 30);
    doc.text(`Average Response Time: ${stats.avgResponseTime} seconds`, 10, 40);
    doc.text(`Total Processes Completed: ${stats.totalProcesses}`, 10, 50);

    // ✅ Save as PDF
    doc.save("scheduler_results.pdf");
   };

   const handleDownloadAllPDF = (stats) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Results from all Job Schedulers", 10, 10);

    // Function to add stats to PDF
    const addStatsToPDF = (title, stats, yPosition) => {
      doc.setFontSize(14);
      doc.text(title, 10, yPosition);
      doc.setFontSize(12);
      doc.text(`Average Turnaround Time: ${stats.avgTurnAroundTime} seconds`, 10, yPosition + 10);
      doc.text(`Average Response Time: ${stats.avgResponseTime} seconds`, 10, yPosition + 20);
      doc.text(`Total Processes Completed: ${stats.totalProcesses}`, 10, yPosition + 30);
  };

  let y = 30; // Initial Y position

  addStatsToPDF("FIFO Scheduler", stats.fifo, y);
  y += 50;
  addStatsToPDF("STCF Scheduler", stats.stcf, y);
  y += 50;
  addStatsToPDF("Round Robin Scheduler", stats.rr, y);
  y += 50;
  addStatsToPDF("SJF Scheduler", stats.sjf, y);
  y += 50;
  addStatsToPDF("MLFQ Scheduler", stats.mlfq, y);

  doc.save("all_scheduler_stats.pdf");
   };
   const allStatsAvailable = () =>{
    return (
      fifoQueue.items.length === 0 && fifoQueue.getStats() &&
      stcfQueue.items.length === 0 && stcfQueue.getStats() &&
      rrQueue.items.length === 0 && rrQueue.getStats() &&
      sjfQueue.items.length === 0 && sjfQueue.getStats() &&
      mlfqQueue.items.length === 0 && mlfqQueue.getStats() 
    )
   };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
        
        
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

          updateQueues(currentTime, processQueue, [fifoQueue, stcfQueue, rrQueue, sjfQueue, mlfqQueue]);
          setFifoQueue(fifoQueue);
          setStcfQueue(stcfQueue);
          setRrQueue(rrQueue);
          setSjfQueue(sjfQueue);
          setMlfqQueue(mlfqQueue);

          fifo(fifoQueue, currentTime);
          stcf(stcfQueue, currentTime);
          rr(rrQueue, timeQuantum, currentTime);
          sjf(sjfQueue, currentTime);
          setSubS(mlfq(mlfqQueue, timeQuantum, timeAllotment, S, subS, currentTime));
        } else {
          updateArrivedQueue(currentTime, processQueue, arrivedQueue);
          // Run only the selected algorithm
          if (selectedAlgorithm === 'fifo') fifo(arrivedQueue, currentTime);
          else if (selectedAlgorithm === 'stcf') stcf(arrivedQueue, currentTime);
          else if (selectedAlgorithm === 'rr') rr(arrivedQueue, timeQuantum, currentTime);
          else if (selectedAlgorithm === 'sjf') sjf(arrivedQueue, currentTime);
          else if (selectedAlgorithm === 'mlfq') setSubS(mlfq(arrivedQueue, timeQuantum, timeAllotment, S, subS, currentTime));
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

      {/* Input for number of processes */}
      <label>Number of Processes:</label>
      <input
        type="number"
        value={numProcesses}
        onChange={(e) => setNumProcesses(e.target.value)}
        min="1" // Ensure at least 1 process is generated
      />

      {/* Show Quantum Time only if Round Robin or MLFQ is selected */}
      {(selectedAlgorithm === 'rr' || selectedAlgorithm === 'all') && (
        <>
          <label>Quantum Time:</label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(Number(e.target.value))}
          />
        </>
      )}

      {/* Show Time Allotment and S only if MLFQ is selected */}
      {selectedAlgorithm === 'mlfq' ? (
        <>
          <label>Time Allotment:</label>
          <input
            type="number"
            value={timeAllotment}
            onChange={(e) => setTimeAllotment(Number(e.target.value))}
          />

          <label>Burst Time, S:</label>
          <input
            type="number"
            value={S}
            onChange={(e) => setS(Number(e.target.value))}
          />
          <label>Quantum Time:</label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(Number(e.target.value))}
          />
        </>
      ) : selectedAlgorithm === 'all'? (
        <>
        <label>Time Allotment:</label>
        <input
          type="number"
          value={timeAllotment}
          onChange={(e) => setTimeAllotment(Number(e.target.value))}
        />

        <label>Burst Time, S:</label>
        <input
          type="number"
          value={S}
          onChange={(e) => setS(Number(e.target.value))}
        />
      </>
      ): null}

      <button onClick={handleGenerateProcesses}>Generate Processes</button>
      <button onClick={handleStartSimulation} disabled={isRunning}>
        Start Simulation
      </button>

      <h2>Processes Waiting to Arrive</h2>
      <BarChart data={processQueue} />

      {selectedAlgorithm === 'all' ? (
        <>
          <h2>Processes in Job Scheduler (ALL Schedulers)</h2>
          <div className="grid-container">
            <div>
              <h3>FIFO</h3>
              <BarChart data={fifoQueue} />
              {/* Display Stats */}
              {fifoQueue.items.length === 0 && (renderStats(fifoQueue.getStats()))}
            </div>
            <div>
              <h3>STCF</h3>
              <BarChart data={stcfQueue} />
              {/* Display Stats */}
              {stcfQueue.items.length === 0 && (renderStats(stcfQueue.getStats()))}
            </div>
            <div>
              <h3>Round Robin</h3>
              <BarChart data={rrQueue} />
              {/* Display Stats */}
              {rrQueue.items.length === 0 && (renderStats(rrQueue.getStats()))}
            </div>
            <div>
              <h3>SJF</h3>
              <BarChart data={sjfQueue} />
              {/* Display Stats */}
              {sjfQueue.items.length === 0 && (renderStats(sjfQueue.getStats()))}
            </div>
            <div>
              <h3>MLFQ</h3>
              <BarChart data={mlfqQueue} />
              {/* Display Stats */}
              {mlfqQueue.items.length === 0 && (renderStats(mlfqQueue.getStats()))}
            </div>
          </div>
          {allStatsAvailable() && (
            <button onClick={() => handleDownloadAllPDF({
        fifo: fifoQueue.getStats(),
        stcf: stcfQueue.getStats(),
        rr: rrQueue.getStats(),
        sjf: sjfQueue.getStats(),
        mlfq: mlfqQueue.getStats(),
    })}>
        Download All Results as PDF
    </button>
          )}
        </>
      ) : (
        <>
          <h2>Processes in Job Scheduler ({selectedAlgorithm.toUpperCase()})</h2>
          <BarChart data={arrivedQueue} />

          {/* Display Stats */}
          {arrivedQueue.items.length === 0 && (
            <>
            {renderStats(arrivedQueue.getStats())}
            <button onClick={handleDownloadPDF}>Download Results as PDF</button>
            </>
            )}
        </>
      )}
    </div>
  );
}

export default App;

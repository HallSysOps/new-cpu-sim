import React from 'react';
import './App.css';
import Chart from './components/Chart';
import {jsPDF} from "jspdf";

function App() {
  const handleDownloadPDF = () => {
    // Get the canvas element (assuming Chart.js renders it with a ref)
    const canvas = document.querySelector('canvas'); // Modify this to match your chart
    if (canvas) {
      const imgData = canvas.toDataURL('image/png'); // Convert the canvas to a base64 PNG image

      const doc = new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // Adjust the dimensions (10, 10, 180, 160) as needed
      doc.save('chart.pdf'); // Save the PDF with the name 'chart.pdf'
    }
  };

  return (
    <div className="App">
      <h1>Welcome to My React App</h1>
      <Chart />
      <button onClick={handleDownloadPDF}>Download Chart as PDF</button>
    </div>
  );
}

export default App;

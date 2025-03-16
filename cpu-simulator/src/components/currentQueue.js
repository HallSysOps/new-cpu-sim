import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, scales} from 'chart.js';
import { callback } from 'chart.js/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({data})=>{
    const chartData = {
        labels: data.items.map(p => 'PID: ' + p.pid + ' | Arrival Time: ' + p.arrivalTime),
        datasets: [
            {
                label: 'Processes in Queue',
                data: data.items.map(p => p.burstTime),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                //text: 'Processes in Queue',
            },
            tooltip:{
                callbacks: {
                    label: function (tooltipItem) {
                        const process = data.items[tooltipItem.dataIndex]; // Get corresponding process
                        return `PID: ${process.pid} | Arrival: ${process.arrivalTime}s | Burst: ${process.burstTime}s | Priority: ${process.priority}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Arrival Time (seconds)', // X-axis label
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Burst Time (seconds)', // Y-axis label
                },
                min: 0,
                max: 10,
            },
        },
    };

    return(
        <div style={{ width: '600px', margin: 'auto' }}>
            <Bar data={chartData} options={options}/>
        </div>
    );
};

export default BarChart;
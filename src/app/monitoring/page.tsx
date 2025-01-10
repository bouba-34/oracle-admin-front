"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const PerformanceDashboard = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [awrData, setAwrData] = useState<any[]>([]);
    const [ashData, setAshData] = useState<any[]>([]);

    useEffect(() => {
        if (chartRef.current && !chartInstance) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                const newChartInstance = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: [], // Time labels
                        datasets: [
                            { label: "CPU", data: [], borderColor: "red", fill: false },
                            { label: "I/O", data: [], borderColor: "blue", fill: false },
                            { label: "Memory", data: [], borderColor: "green", fill: false },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: "Time" } },
                            y: { title: { display: true, text: "Usage" } },
                        },
                    },
                });
                setChartInstance(newChartInstance);
            }
        }
    }, [chartInstance]);

    const fetchRealTimeStats = async () => {
        try {
            const response = await fetch("/performance/realtime");
            const data = await response.json();
            const now = new Date().toLocaleTimeString();

            if (chartInstance) {
                chartInstance.data.labels!.push(now);
                chartInstance.data.datasets[0].data.push(data.cpu);
                chartInstance.data.datasets[1].data.push(data.io);
                chartInstance.data.datasets[2].data.push(data.memory);
                chartInstance.update();
            }
        } catch (error) {
            console.error("Error fetching real-time stats:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchRealTimeStats, 5000);
        return () => clearInterval(interval);
    }, [chartInstance]);

    const fetchAwrData = async () => {
        try {
            const response = await fetch("/performance/awr");
            const data = await response.json();
            setAwrData(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching AWR data:", error);
        }
    };

    const fetchAshData = async () => {
        try {
            const response = await fetch("/performance/ash");
            const data = await response.json();
            setAshData(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching ASH data:", error);
        }
    };

    const downloadReport = (reportType: "awr" | "ash") => {
        window.location.href = `/performance/${reportType}Report`;
    };

    return (
        <div>
            <h1>Performance Dashboard</h1>
            <a href="/index">Back to Main Dashboard</a>

            <div>
                <h2>Download Reports</h2>
                <button onClick={() => downloadReport("awr")}>Download AWR Report</button>
                <button onClick={() => downloadReport("ash")}>Download ASH Report</button>
            </div>

            <div>
                <h2>Real-Time Resource Usage</h2>
                <canvas ref={chartRef}></canvas>
            </div>

            <div>
                <h2>AWR Data</h2>
                <button onClick={fetchAwrData}>Load AWR Data</button>
                <table>
                    <thead>
                    <tr>
                        {awrData.length > 0 && Object.keys(awrData[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {awrData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h2>ASH Data</h2>
                <button onClick={fetchAshData}>Load ASH Data</button>
                <table>
                    <thead>
                    <tr>
                        {ashData.length > 0 && Object.keys(ashData[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {ashData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformanceDashboard;

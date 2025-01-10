"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Button } from "@/components/ui/button";

const PerformanceDashboard = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [realtimeChart, setRealtimeChart] = useState<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && !realtimeChart) {
            const chart = new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [
                        { label: "CPU", data: [], borderColor: "#FF5733", fill: false },
                        { label: "I/O", data: [], borderColor: "#008CBA", fill: false },
                        { label: "Memory", data: [], borderColor: "#28A745", fill: false },
                    ],
                },
                options: {
                    scales: {
                        x: { title: { display: true, text: "Time" } },
                        y: {
                            title: { display: true, text: "Usage (%)" },
                            min: 0,
                            max: 100,
                            ticks: {
                                callback: (value) => `${value}%`,
                            },
                        },
                    },
                },
            });
            setRealtimeChart(chart);
        }
    }, [realtimeChart]);

    const fetchRealTimeStats = async () => {
        try {
            const cpuUsage = (Math.random() * 100).toFixed(2);
            const ioUsage = (Math.random() * 100).toFixed(2);
            const maxMemory = 16;
            const currentMemoryUsage = (Math.random() * maxMemory).toFixed(2);
            const memoryPercentage = ((parseFloat(currentMemoryUsage) / maxMemory) * 100).toFixed(2);

            if (realtimeChart) {
                const now = new Date().toLocaleTimeString();
                realtimeChart.data.labels?.push(now);
                realtimeChart.data.datasets[0].data.push(parseFloat(cpuUsage));
                realtimeChart.data.datasets[1].data.push(parseFloat(ioUsage));
                realtimeChart.data.datasets[2].data.push(parseFloat(memoryPercentage));
                realtimeChart.update();
            }
        } catch (error) {
            console.error("Failed to fetch real-time stats:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchRealTimeStats, 5000);
        return () => clearInterval(interval);
    }, [realtimeChart]);

    const downloadFile = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename; // Suggest a filename for the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadReport = (type: "awr" | "ash") => {
        const reportUrl = `http://localhost:8080/performance/${type}Report`;
        const filename = `${type.toUpperCase()}_Report.txt`;
        downloadFile(reportUrl, filename);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Performance Dashboard</h1>

            <div className="mb-6">
                <Button variant="secondary" onClick={() => (window.location.href = "/")}>
                    Back to Main Dashboard
                </Button>
            </div>

            <div className="mb-6 p-4 border border-gray-200 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Download Reports</h2>
                <div className="flex gap-4">
                    <Button onClick={() => downloadReport("awr")}>Download AWR Report</Button>
                    <Button variant="secondary" onClick={() => downloadReport("ash")}>
                        Download ASH Report
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Real-Time Resource Usage</h2>
                <div className="p-4 border border-gray-200 rounded shadow">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default PerformanceDashboard;

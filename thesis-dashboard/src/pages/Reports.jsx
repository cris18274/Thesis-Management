import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const workloadData = {
    labels: ['Dr. Smith', 'Prof. Johnson', 'Dr. Lee', 'Prof. Davis'],
    datasets: [
      {
        label: 'Active Theses',
        data: [4, 6, 2, 5],
        backgroundColor: '#6366f1',
      }
    ]
  };

  const statusData = {
    labels: ['Draft', 'In Review', 'Approved', 'Defended'],
    datasets: [
      {
        data: [12, 8, 5, 20],
        backgroundColor: ['#9ca3af', '#facc15', '#4ade80', '#60a5fa'],
      }
    ]
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics & Reports</h1>
      <p className="mb-6 text-gray-500">Note: Displaying simulated reporting data (Advance 1 requirements).</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Tutor Workload</h2>
          <Bar data={workloadData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Overall Thesis Status</h2>
          <div className="w-2/3">
            <Pie data={statusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

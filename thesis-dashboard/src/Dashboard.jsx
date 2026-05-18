import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import api from './api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeTheses: 0,
    totalProfessors: 0,
    pendingDefenses: 0
  });

  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const metricsRes = await api.get('/metrics');
        setMetrics({
          ...metricsRes.data,
          pendingDefenses: 0 // placeholder if not supported by backend yet
        });

        const thesesRes = await api.get('/theses');
        // Sort by id descending (assuming recent ones have higher id) and take top 5
        const recent = thesesRes.data.sort((a, b) => b.thesis_id - a.thesis_id).slice(0, 5);
        setRecentUpdates(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchDashboardData();
  }, []);

  const countStatus = (status) => recentUpdates.filter(t => t.status === status).length;

  const chartData = {
    labels: ['Draft', 'In Review', 'Approved', 'Defended'],
    datasets: [
      {
        label: 'Number of Theses',
        data: [countStatus('Draft'), countStatus('In Review'), countStatus('Approved'), countStatus('Defended')],
        backgroundColor: ['#9ca3af', '#facc15', '#4ade80', '#60a5fa'],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Recent Thesis Status Distribution' }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Students</h2>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Active Theses</h2>
          <p className="text-3xl font-bold text-gray-800">{metrics.activeTheses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Professors</h2>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalProfessors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Pending Defenses</h2>
          <p className="text-3xl font-bold text-gray-800">{metrics.pendingDefenses}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Thesis Updates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Tutors</th>
                  <th scope="col" className="px-6 py-3">Reviewers</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((thesis) => (
                  <tr key={thesis.thesis_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{thesis.title}</td>
                    <td className="px-6 py-4">{thesis.student_name}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {thesis.tutors?.length > 0 
                        ? thesis.tutors.map(t => `${t.name} (${t.role})`).join(', ') 
                        : 'None'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {thesis.reviewers?.length > 0 
                        ? thesis.reviewers.map(r => r.name).join(', ') 
                        : 'None'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${thesis.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
                        ${thesis.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${thesis.status === 'Draft' ? 'bg-gray-100 text-gray-800' : ''}
                        ${thesis.status === 'Defended' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {thesis.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



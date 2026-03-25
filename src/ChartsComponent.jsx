import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './ChartsComponent.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ChartsComponent() {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const generateRandomData = () => {
    // Generate bar chart data
    const bar = Array.from({ length: 7 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 10,
    }));
    setBarData(bar);

    // Generate line chart data
    const line = Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      value: Math.floor(Math.random() * 200) + 50,
    }));
    setLineData(line);

    // Generate pie chart data
    const pie = [
      { name: 'Category A', value: Math.floor(Math.random() * 100) + 20 },
      { name: 'Category B', value: Math.floor(Math.random() * 100) + 20 },
      { name: 'Category C', value: Math.floor(Math.random() * 100) + 20 },
      { name: 'Category D', value: Math.floor(Math.random() * 100) + 20 },
      { name: 'Category E', value: Math.floor(Math.random() * 100) + 20 },
    ];
    setPieData(pie);
  };

  useEffect(() => {
    generateRandomData();
  }, []);

  return (
    <div className="charts-container">
      <h1>📊 Charts with Random Data</h1>

      <button onClick={generateRandomData} className="btn generate-btn">
        Generate New Random Data
      </button>

      <div className="charts-grid">
        <div className="chart-item">
          <h2>Bar Chart</h2>
          <BarChart width={400} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-item">
          <h2>Line Chart</h2>
          <LineChart width={400} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </div>

        <div className="chart-item">
          <h2>Pie Chart</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default ChartsComponent;
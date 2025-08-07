import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartData {
    name: string;
    value: number;
}

const fetchPercentages = async () => {
    const { data: onlyPostedPercentage } = await axios.get('api/analytics/posts');
    const { data: onlyCommentedPercentage } = await axios.get('api/analytics/comments');
    const { data: neitherPercentage } = await axios.get('api/analytics/no-action');

    return {
        onlyPosted: onlyPostedPercentage,
        onlyCommented: onlyCommentedPercentage,
        neither: neitherPercentage,
    };
};

const UsersAnalytics = () => {
    const [data, setData] = useState<PieChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const percentages = await fetchPercentages();
            setData([
                { name: 'Posted', value: percentages.onlyPosted },
                { name: 'Only Commented', value: percentages.onlyCommented },
                { name: 'Neither', value: percentages.neither }
            ]);
        };
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div>
            <h2>Users Activity</h2>
            <PieChart width={400} height={400}>
                <Pie data={data} cx={200} cy={200}
                    innerRadius={60}
                    outerRadius={100}
                    fill='#8884d8'
                    paddingAngle={5}
                    dataKey="value">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default UsersAnalytics;
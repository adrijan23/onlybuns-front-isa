import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const CommentAnalytics = () => {
    const currentYear = new Date().getFullYear();
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState<number[]>([]);
    const [viewType, setViewType] = useState("yearly");
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [yearlyData, setYearlyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        fetchAvailableYears();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchYearlyData(selectedYear);
            fetchAvailableMonths(selectedYear);
        }
    }, [selectedYear]);

    useEffect(() => {
        if (viewType === "yearly") {
            fetchYearlyData(selectedYear);
        } else {
            fetchMonthlyData(selectedYear, selectedMonth);
        }
    }, [selectedYear, selectedMonth, viewType]);

    const fetchAvailableYears = async () => {
        try {
            const response = await axios.get("api/posts/comments/years");
            setAvailableYears(response.data);

            if (response.data.length > 0) {
                setSelectedYear(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching years:", error);
        }
    };

    const fetchAvailableMonths = async (year: number) => {
        try {
            const response = await axios.get(`api/posts/comments/months?year=${year}`);
            setAvailableMonths(response.data);

            if (response.data.length > 0) {
                setSelectedMonth(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching years:", error);
        }
    };

    const fetchYearlyData = async (year: any) => {
        try {
            const response = await axios.get(`api/posts/comments/analytics/yearly?year=${year}`);
            setYearlyData(response.data.map((item: any[]) => ({
                month: monthNames[item[0] - 1],
                posts: item[1]
            })));
        } catch (error) {
            console.error("Error fetching yearly data:", error);
        }
    };

    const fetchMonthlyData = async (year: any, month: any) => {
        try {
            const response = await axios.get(`api/posts/comments/analytics/monthly?year=${year}&month=${month}`);
            setMonthlyData(response.data.map((item: any[]) => ({
                day: item[0],
                posts: item[1]
            })));
        } catch (error) {
            console.error("Error fetching monthly data:", error);
        }
    };

    return (
        <div>
            <h2>{viewType === "yearly" ? "Yearly" : "Monthly"} Comments Analytics</h2>

            {/* Dropdown for selecting year */}
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
                {availableYears.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* Toggle between yearly and monthly view */}
            <div>
                <label>
                    <input
                        type="radio"
                        value="yearly"
                        checked={viewType === "yearly"}
                        onChange={() => setViewType("yearly")}
                    />
                    Yearly
                </label>
                <label>
                    <input
                        type="radio"
                        value="monthly"
                        checked={viewType === "monthly"}
                        onChange={() => setViewType("monthly")}
                    />
                    Monthly
                </label>
            </div>

            {/* If monthly view, show dropdown for selecting the month */}
            {viewType === "monthly" && (
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                    {availableMonths.map((month) => (
                        <option key={month} value={month}>
                            {monthNames[month - 1]}
                        </option>
                    ))}
                </select>
            )}

            {/* Display the chart based on selected view */}
            {viewType === "yearly" && yearlyData.length > 0 && (
                <LineChart width={600} height={300} data={yearlyData}>
                    <Line type="monotone" dataKey="posts" stroke="#ff7300" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            )}

            {viewType === "monthly" && monthlyData.length > 0 && (
                <LineChart width={600} height={300} data={monthlyData}>
                    <Line type="monotone" dataKey="posts" stroke="#00bfff" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            )}
        </div>
    );
};

export default CommentAnalytics;

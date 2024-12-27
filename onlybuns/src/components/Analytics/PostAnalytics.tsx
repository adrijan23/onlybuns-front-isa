// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

// interface Post {
//   id: number;
//   createdAt: string;
// }

// // Utility to group posts by month
// const groupByMonth = (posts: Post[]) => {
//   return posts.reduce((acc: any, post: Post) => {
//     const month = new Date(post.createdAt).getMonth() + 1; // getMonth is 0-indexed
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(post);
//     return acc;
//   }, {});
// };

// // Utility to group posts by week
// const groupByWeek = (posts: Post[]) => {
//   return posts.reduce((acc: any, post: Post) => {
//     const week = Math.ceil(new Date(post.createdAt).getDate() / 7); // Simple week calculation
//     if (!acc[week]) acc[week] = [];
//     acc[week].push(post);
//     return acc;
//   }, {});
// };

// const PostAnalytics = () => {
//   const currentYear = new Date().getFullYear();
//   const [years, setYears] = useState<number[]>([]);
//   const [viewType, setViewType] = useState("yearly");
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState(1);
//   const [selectedWeek, setSelectedWeek] = useState(1);
//   const [allPosts, setAllPosts] = useState<Post[]>([]); // Holds all posts for the selected year

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   // Fetch available years on component mount
//   useEffect(() => {
//     fetchAvailableYears();
//   }, []);

//   // Fetch posts for the selected year
//   useEffect(() => {
//     fetchPostsForYear(selectedYear);
//   }, [selectedYear]);

//   const fetchAvailableYears = async () => {
//     try {
//       const response = await axios.get("/api/posts/years");
//       setYears(response.data);
//       if (response.data.length > 0) {
//         setSelectedYear(response.data[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching years:", error);
//     }
//   };

//   const fetchPostsForYear = async (year: number) => {
//     try {
//       const response = await axios.get(`/api/posts/analytics?year=${year}`);
//       setAllPosts(response.data); // Assuming the response contains all posts for the year
//     } catch (error) {
//       console.error("Error fetching posts for year:", error);
//     }
//   };

//   const getFilteredPosts = () => {
//     if (viewType === "yearly") {
//       return Object.keys(groupByMonth(allPosts)).map((month) => ({
//         month: monthNames[Number(month) - 1],
//         posts: groupByMonth(allPosts)[month].length,
//       }));
//     } else if (viewType === "monthly") {
//       const postsForMonth = allPosts.filter((post) => new Date(post.createdAt).getMonth() + 1 === selectedMonth);
//       return postsForMonth.map((post) => ({
//         day: new Date(post.createdAt).getDate(),
//         posts: 1,
//       }));
//     } else if (viewType === "weekly") {
//       const postsForMonth = allPosts.filter((post) => new Date(post.createdAt).getMonth() + 1 === selectedMonth);
//       const postsByWeek = groupByWeek(postsForMonth);
//       return postsByWeek[selectedWeek]?.map((post: Post) => ({
//         day: new Date(post.createdAt).getDate(),
//         posts: 1,
//       })) || [];
//     }
//     return [];
//   };

//   const filteredPosts = getFilteredPosts();

//   return (
//     <div>
//       <h2>{viewType.charAt(0).toUpperCase() + viewType.slice(1)} Post Analytics</h2>

//       {/* Dropdown for selecting year */}
//       <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
//         {years.map((year) => (
//           <option key={year} value={year}>
//             {year}
//           </option>
//         ))}
//       </select>

//       {/* Toggle between view types */}
//       <div>
//         <label>
//           <input type="radio" value="yearly" checked={viewType === "yearly"} onChange={() => setViewType("yearly")} />
//           Yearly
//         </label>
//         <label>
//           <input type="radio" value="monthly" checked={viewType === "monthly"} onChange={() => setViewType("monthly")} />
//           Monthly
//         </label>
//         <label>
//           <input type="radio" value="weekly" checked={viewType === "weekly"} onChange={() => setViewType("weekly")} />
//           Weekly
//         </label>
//       </div>

//       {/* If monthly or weekly view, show dropdown for selecting the month */}
//       {(viewType === "monthly" || viewType === "weekly") && (
//         <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
//           {monthNames.map((month, index) => (
//             <option key={index} value={index + 1}>
//               {month}
//             </option>
//           ))}
//         </select>
//       )}

//       {/* If weekly view, show dropdown for selecting the week */}
//       {viewType === "weekly" && (
//         <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
//           {[1, 2, 3, 4, 5].map((week) => (
//             <option key={week} value={week}>
//               Week {week}
//             </option>
//           ))}
//         </select>
//       )}

//       {/* Display chart based on filtered data */}
//       {filteredPosts.length > 0 && (
//         <LineChart width={600} height={300} data={filteredPosts}>
//           <Line type="monotone" dataKey="posts" stroke="#ff7300" />
//           <CartesianGrid stroke="#ccc" />
//           <XAxis dataKey={viewType === "yearly" ? "month" : "day"} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//         </LineChart>
//       )}
//     </div>
//   );
// };

// export default PostAnalytics;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const PostAnalytics = () => {
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
      const response = await axios.get("api/posts/years");
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
      const response = await axios.get(`api/posts/months?year=${year}`);
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
      const response = await axios.get(`api/posts/analytics/yearly?year=${year}`);
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
      const response = await axios.get(`api/posts/analytics/monthly?year=${year}&month=${month}`);
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
      <h2>{viewType === "yearly" ? "Yearly" : "Monthly"} Posts Analytics</h2>

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

export default PostAnalytics;

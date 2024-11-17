import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import axios from "axios";
import { config, path } from "@/path";
import { toPng } from "html-to-image";
import { Button } from "../ui/button";

const ResultChart = ({ studentId, semester }) => {
  const [rawResults, setRawResults] = useState([]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null); // Reference to the chart container

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const urlLink = !semester
          ? `${path}/result/student/${studentId}`
          : `${path}/result/student/${studentId}?semester=${semester}`;
        const response = await axios.get(urlLink, config);
        const fetchedResults = response.data || [];

        // Prepare data
        const formattedData = fetchedResults.map((result) => ({
          subject: result.subject?.paperCode || "N/A",
          internalMarks: result.internalMarks || 0,
          externalMarks: result.externalMarks || 0,
        }));

        setRawResults(formattedData);
      } catch (error) {
        console.error("Failed to fetch results", error);
      }
    };

    fetchResults();
  }, [studentId, semester]);

  useEffect(() => {
    if (rawResults.length > 0) {
      const timeout = setTimeout(() => setChartData(rawResults), 200);
      return () => clearTimeout(timeout);
    }
  }, [rawResults]);

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const pngData = await toPng(chartRef.current, {
          backgroundColor: "white",
        });
        const link = document.createElement("a");
        link.href = pngData;
        link.download = "result-chart.png";
        link.click();
      } catch (error) {
        console.error("Failed to download chart", error);
      }
    }
  };

  return (
    <div className="chart-container">
      <div ref={chartRef}>
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="subject"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            label={{ value: "Marks", angle: -90, position: "insideLeft" }}
          />
          <Tooltip wrapperClassName="rounded-md" />
          <Bar
            dataKey="internalMarks"
            stackId="marks"
            fill="#34d399"
            name="Internal Marks"
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
          <Bar
            dataKey="externalMarks"
            stackId="marks"
            fill="#f87171"
            name="External Marks"
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </div>
      <Button onClick={handleDownload} className="btn">
        Download
      </Button>
    </div>
  );
};

export default ResultChart;

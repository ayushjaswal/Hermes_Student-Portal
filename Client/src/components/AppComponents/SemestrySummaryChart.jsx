import { useEffect, useRef, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Bar, Line } from "recharts";
import axios from "axios";
import { config, path } from "@/path";
import { Button } from "../ui/button";
import { toPng } from "html-to-image";

const SemesterSummaryChart = ({ studentId }) => {
  const [semesterData, setSemesterData] = useState([]);
  const chartRef = useRef(null); // Reference to the chart container

  useEffect(() => {
    const fetchSemesterSummary = async () => {
      try {
        const response = await axios.get(
          `${path}/result/student/${studentId}/semester-summary`,
          config
        );
        console.log(response.data);
        setSemesterData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch semester summary", error);
      }
    };

    fetchSemesterSummary();
  }, [studentId]);
  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const pngData = await toPng(chartRef.current, {
          backgroundColor: "white",
        });
        const link = document.createElement("a");
        link.href = pngData;
        link.download = "semResult-chart.png";
        link.click();
      } catch (error) {
        console.error("Failed to download chart", error);
      }
    }
  };
  return (
    <div className="chart-container">
      <div ref={chartRef}>
        <LineChart
          width={600}
          height={300}
          data={semesterData}
          margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="semester"
            label={{ value: "Semester", position: "insideBottom", offset: -10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: "Percentage (%)",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Line
            dataKey="percentage"
            stroke="hsl(var(--chart-1))"
            type="monotone"
            animationDuration={800}
            radius={[10, 10, 0, 0]}
          />
        </LineChart>
      </div>
      <Button onClick={handleDownload} className="btn">
        Download
      </Button>
    </div>
  );
};

export default SemesterSummaryChart;

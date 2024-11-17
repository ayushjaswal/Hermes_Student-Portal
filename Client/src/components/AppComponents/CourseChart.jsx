import { useEffect, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Button } from "../ui/button";
import { toPng } from "html-to-image";

const CourseChart = ({ data, studentId }) => {
  const chartRef = useRef(null); // Reference to the chart container

  // Parse data for chart
  const parsedData = data.map((entry) => ({
    semester: entry.semester,
    midSemMarks: entry.midSemMarks,
    isHighlighted: entry.student === studentId,
  }));

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const pngData = await toPng(chartRef.current, {
          backgroundColor: "white",
        });
        const link = document.createElement("a");
        link.href = pngData;
        link.download = "midsem-chart.png";
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
          data={parsedData}
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
              value: "Mid-Sem Marks",
              angle: -90,
              position: "insideLeft",
            }}
            domain={[0, 100]} // Assuming max marks are 100
          />
          <Tooltip />
          <Line
            dataKey="midSemMarks"
            stroke="#8884d8"
            type="monotone"
            animationDuration={800}
            dot={{
              stroke: "#8884d8",
              strokeWidth: 2,
              r: 4,
              fill: ({ payload }) => (payload.isHighlighted ? "blue" : "white"),
            }}
          />
        </LineChart>
      </div>
      <Button onClick={handleDownload} className="btn">
        Download Chart
      </Button>
    </div>
  );
};

export default CourseChart;

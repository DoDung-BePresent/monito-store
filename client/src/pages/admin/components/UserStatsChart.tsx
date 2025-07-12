"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBussinessMetric } from "@/services/adminService";

// Dữ liệu API
type BusinessMetric = {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

const daysMap: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const UserStatsChart = () => {
  const [timeRange, setTimeRange] = useState("90d");
  const [chartData, setChartData] = useState<BusinessMetric[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getBussinessMetric(daysMap[timeRange]);
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch business statistics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeRange]);

  // Transform BusinessMetric[] -> single object for recharts
  const transformedData = [
    chartData.reduce((acc, stat) => {
      const numericValue = parseFloat(String(stat.value).replace(/[^\d.-]/g, ""));
      acc[stat.name] = numericValue;
      return acc;
    }, { name: "Statistics" } as Record<string, string | number>)
  ];

  // Màu theo xu hướng
  const labelColors: Record<string, string> = {};
  chartData.forEach((stat) => {
    labelColors[stat.name] =
      stat.trend === "up" ? "#22c55e" : "#ef4444"; // xanh lá hoặc đỏ
  });

  const uniqueLabels = chartData.map((stat) => stat.name);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Business Metrics</CardTitle>
          <CardDescription>
            Showing statistics for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformedData} barGap={16}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip />
              {uniqueLabels.map((label) => (
                <Bar
                  key={label}
                  dataKey={label}
                  fill={labelColors[label] || "#3b82f6"}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStatsChart;

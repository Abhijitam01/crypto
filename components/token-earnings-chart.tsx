/**
 * Token Earnings Chart Component
 *
 * This client component displays a chart of the user's token earnings over time.
 * It visualizes token accumulation to motivate continued learning.
 *
 * Features:
 * - Line chart showing token earnings over time
 * - Responsive design that adapts to container size
 * - Tooltip with detailed information on hover
 * - Customizable time period (week, month, year)
 */

"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { Button } from "@/components/ui/button"

// Sample data for the chart
const weeklyData = [
  { day: "Mon", tokens: 10 },
  { day: "Tue", tokens: 25 },
  { day: "Wed", tokens: 15 },
  { day: "Thu", tokens: 30 },
  { day: "Fri", tokens: 22 },
  { day: "Sat", tokens: 18 },
  { day: "Sun", tokens: 0 },
]

const monthlyData = [
  { day: "Week 1", tokens: 50 },
  { day: "Week 2", tokens: 75 },
  { day: "Week 3", tokens: 60 },
  { day: "Week 4", tokens: 90 },
]

const yearlyData = [
  { day: "Jan", tokens: 120 },
  { day: "Feb", tokens: 150 },
  { day: "Mar", tokens: 200 },
  { day: "Apr", tokens: 180 },
  { day: "May", tokens: 220 },
  { day: "Jun", tokens: 250 },
  { day: "Jul", tokens: 300 },
  { day: "Aug", tokens: 280 },
  { day: "Sep", tokens: 350 },
  { day: "Oct", tokens: 400 },
  { day: "Nov", tokens: 380 },
  { day: "Dec", tokens: 450 },
]

type TimeRange = "week" | "month" | "year"

export default function TokenEarningsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week")

  // Select data based on time range
  const data = timeRange === "week" ? weeklyData : timeRange === "month" ? monthlyData : yearlyData

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded border border-gray-700 text-white text-xs">
          <p className="font-bold">{`${label}: ${payload[0].value} Tokens`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-end mb-2">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            className={`px-2 py-1 text-xs rounded ${timeRange === "week" ? "bg-gray-700" : "hover:bg-gray-700/50"}`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`px-2 py-1 text-xs rounded ${timeRange === "month" ? "bg-gray-700" : "hover:bg-gray-700/50"}`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`px-2 py-1 text-xs rounded ${timeRange === "year" ? "bg-gray-700" : "hover:bg-gray-700/50"}`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#94A3B8" }}
            axisLine={{ stroke: "#2D3748" }}
            tickLine={{ stroke: "#2D3748" }}
          />
          <YAxis
            tick={{ fill: "#94A3B8" }}
            axisLine={{ stroke: "#2D3748" }}
            tickLine={{ stroke: "#2D3748" }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="tokens"
            stroke="url(#tokenGradient)"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4, strokeDasharray: "" }}
            activeDot={{ r: 6, fill: "#8B5CF6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


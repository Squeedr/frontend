"use client"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  Cell,
  Line,
  Bar,
} from "recharts"

interface ChartProps {
  data: any[]
  xAxisKey: string
  yAxisKey?: string
  series?: { name: string; key: string; color: string }[]
  nameKey?: string
  valueKey?: string
  colorKey?: string
  height?: number
  stacked?: boolean
}

export function BarChart({ data, xAxisKey, yAxisKey, height = 300, series, stacked }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {series ? (
          series.map((s) => (
            <Bar key={s.key} dataKey={s.key} fill={s.color} name={s.name} stackId={stacked ? "stack" : undefined} />
          ))
        ) : (
          <Bar dataKey={yAxisKey || "value"} fill="var(--primary)" />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function LineChart({ data, xAxisKey, yAxisKey, series, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {series ? (
          series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} name={s.name} activeDot={{ r: 8 }} />
          ))
        ) : (
          <Line type="monotone" dataKey={yAxisKey || "value"} stroke="var(--primary)" activeDot={{ r: 8 }} />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function PieChart({ data, nameKey, valueKey, colorKey, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={valueKey || "value"}
          nameKey={nameKey || "name"}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry[colorKey || "color"]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

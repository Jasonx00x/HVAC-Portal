"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenueByMonth, statusCounts } from "@/lib/mock-data";

const colors = ["#126b79", "#d8523f", "#237a57", "#b7791f", "#475467"];

export function RevenueChart() {
  return (
    <ResponsiveContainer height={260} width="100%">
      <BarChart data={revenueByMonth}>
        <CartesianGrid stroke="#edf0f3" vertical={false} />
        <XAxis dataKey="month" tickLine={false} />
        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} width={48} />
        <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
        <Legend />
        <Bar dataKey="revenue" fill="#126b79" name="Revenue" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cost" fill="#d8523f" name="Known job cost" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusChart() {
  return (
    <ResponsiveContainer height={260} width="100%">
      <PieChart>
        <Pie cx="50%" cy="50%" data={statusCounts} dataKey="value" innerRadius={58} nameKey="name" outerRadius={88} paddingAngle={3}>
          {statusCounts.map((entry, index) => (
            <Cell fill={colors[index % colors.length]} key={entry.name} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

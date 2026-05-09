"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/components/feorm/listing-card";

const revenueData = [
  { month: "Oct", revenue: 420000 },
  { month: "Nov", revenue: 580000 },
  { month: "Dec", revenue: 390000 },
  { month: "Jan", revenue: 720000 },
  { month: "Feb", revenue: 640000 },
  { month: "Mar", revenue: 842000 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bento-card px-3 py-2 !shadow-md">
      <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-1">
        {label}
      </p>
      <p className="font-serif-display text-sm text-[#1E1A14]">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

export default function RevenueChart() {
  // This component is dynamically imported with ssr: false,
  // so recharts only runs on the client side
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={revenueData}
        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#787774",
            fontSize: 10,
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        />
        <YAxis hide />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(60,47,26,0.03)" }}
        />
        <Bar dataKey="revenue" fill="#E8C96A" radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

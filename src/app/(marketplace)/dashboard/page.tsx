"use client";

import { useFeorm } from "@/context/feorm-context";
import { formatPrice } from "@/components/feorm/listing-card";

export default function DashboardPage() {
  const { user } = useFeorm();

  const stats = [
    { label: "Active Listings", value: "6", accent: false },
    { label: "Earnings Available", value: "N$ 8,420", accent: true },
    { label: "Pending Requests", value: "3", accent: false },
    { label: "Occupancy Rate", value: "67%", accent: false },
  ];

  const pendingRequests = [
    {
      id: 1,
      title: "John Deere 5075E — Rental Request",
      requester: "Anna //Khaoes",
      duration: "3 days",
      amount: 475000,
      type: "equipment",
    },
    {
      id: 2,
      title: "Otjozondjupa Cattle Farm — Stay Request",
      requester: "Pieter Gaseb",
      duration: "5 days",
      amount: 425000,
      type: "stay",
    },
    {
      id: 3,
      title: "Kunene River Camp — Stay Request",
      requester: "Hannes van Wyk",
      duration: "4 days",
      amount: 380000,
      type: "stay",
    },
  ];

  const recentActivity = [
    { action: "Payment received", detail: "Erongo Granite Lodge — N$ 2,400", time: "2h ago" },
    { action: "Booking confirmed", detail: "Kalahari Goat Station — 3 nights", time: "5h ago" },
    { action: "Equipment returned", detail: "Disc Harrow Implement — Condition: Good", time: "1d ago" },
  ];

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Host Dashboard
        </p>
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Welcome back, {user?.name || "Host"}
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bento-card p-5">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2">
              {s.label}
            </p>
            <p className={`font-serif-display text-2xl md:text-3xl ${s.accent ? "text-[#346538]" : "text-[#1E1A14]"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pending Requests */}
      <div className="mb-12">
        <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
          Pending Requests
        </h3>
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bento-card p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
                      req.type === "stay" ? "tag-pastel" : "tag-machinery"
                    }`}
                  >
                    Pending
                  </span>
                  <span className="font-mono-feorm text-[9px] text-[#787774] uppercase tracking-widest">
                    {req.type === "stay" ? "Stay" : "Equipment"}
                  </span>
                </div>
                <h4 className="font-serif-display text-lg text-[#1E1A14]">
                  {req.title}
                </h4>
                <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
                  Requested by {req.requester} — {req.duration} — {formatPrice(req.amount)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors active:scale-[0.98]">
                  Accept
                </button>
                <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors active:scale-[0.98]">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
          Recent Activity
        </h3>
        <div className="bento-card">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-5 ${
                i < recentActivity.length - 1 ? "border-b border-[#3C2F1A]/5" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">{item.action}</p>
                <p className="text-xs text-[#787774] font-mono-feorm">{item.detail}</p>
              </div>
              <span className="font-mono-feorm text-[9px] text-[#787774] uppercase tracking-widest">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

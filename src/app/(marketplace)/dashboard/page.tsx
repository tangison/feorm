"use client";

export default function DashboardPage() {
  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Host Dashboard
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Active Listings
          </p>
          <p className="font-serif-display text-3xl text-[#1E1A14]">3</p>
        </div>
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Earnings Available
          </p>
          <p className="font-serif-display text-3xl text-[#346538]">N$ 4,200</p>
        </div>
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Pending Requests
          </p>
          <p className="font-serif-display text-3xl text-[#E8C96A]">2</p>
        </div>
      </div>

      <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
        Pending Requests
      </h3>
      <div className="space-y-4">
        <div className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1 inline-block mb-2">
              Pending
            </span>
            <h4 className="font-serif-display text-lg text-[#1E1A14]">
              John Deere 5075E — Rental Request
            </h4>
            <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
              Requested by Anna K. — 3 days — N$ 4,500
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors">
              Accept
            </button>
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors">
              Decline
            </button>
          </div>
        </div>
        <div className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1 inline-block mb-2">
              Pending
            </span>
            <h4 className="font-serif-display text-lg text-[#1E1A14]">
              Otjozondjupa Cattle Farm — Stay Request
            </h4>
            <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
              Requested by Pieter G. — 5 days — N$ 4,250
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors">
              Accept
            </button>
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

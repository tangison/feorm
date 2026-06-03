"use client";

import { useState, useEffect, useCallback } from "react";
import { useFeormAuth } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import {
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Tent,
  Wrench,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PendingProvider {
  id: string;
  name: string | null;
  surname: string | null;
  role: string;
  region: string | null;
  created_at: string;
  verified: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
}

export default function AdminPage() {
  const { user } = useFeormAuth();
  const router = useRouter();
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        fetch("/api/admin?action=pending-verifications"),
        fetch("/api/admin?action=stats"),
      ]);

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingProviders(data.pending ?? []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch {
      // Admin data fetch failed silently
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      router.push("/marketplace");
      return;
    }
    // Use a timeout to avoid calling setState synchronously in the effect
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, router, fetchData]);

  const handleApprove = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", userId }),
      });
      if (res.ok) {
        setPendingProviders((prev) => prev.filter((p) => p.id !== userId));
        toast({ title: "Provider approved" });
      } else {
        toast({ title: "Could not approve this provider", description: "Something went wrong on our end. Please try again." });
      }
    } catch {
      toast({ title: "Could not approve this provider", description: "Something went wrong on our end. Please try again." });
    }
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const handleReject = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", userId }),
      });
      if (res.ok) {
        setPendingProviders((prev) => prev.filter((p) => p.id !== userId));
        toast({ title: "Provider rejected" });
      } else {
        toast({ title: "Could not reject this provider", description: "Something went wrong on our end. Please try again." });
      }
    } catch {
      toast({ title: "Could not reject this provider", description: "Something went wrong on our end. Please try again." });
    }
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-NA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-harvest" />
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground">
            Admin Dashboard
          </p>
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Feorm Administration
        </h1>
        <p className="text-sm text-muted-foreground">
          Review provider verifications and monitor platform activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bento-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-muted-foreground" />
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
              Total Users
            </p>
          </div>
          <p className="font-mono-feorm text-2xl md:text-3xl text-earth">
            {stats?.totalUsers ?? "—"}
          </p>
        </div>
        <div className="bento-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Tent size={14} className="text-muted-foreground" />
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
              Total Listings
            </p>
          </div>
          <p className="font-mono-feorm text-2xl md:text-3xl text-earth">
            {stats?.totalListings ?? "—"}
          </p>
        </div>
        <div className="bento-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-muted-foreground" />
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
              Total Bookings
            </p>
          </div>
          <p className="font-mono-feorm text-2xl md:text-3xl text-earth">
            {stats?.totalBookings ?? "—"}
          </p>
        </div>
      </div>

      {/* Pending Verifications */}
      <section aria-labelledby="pending-heading">
        <div className="flex items-center justify-between mb-4">
          <h3
            id="pending-heading"
            className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Pending Verifications
          </h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary-feorm flex items-center gap-2 px-3 py-1.5 text-[9px] uppercase tracking-widest min-h-[36px] disabled:opacity-50"
            aria-label="Refresh verifications"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading && pendingProviders.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-24 rounded-[8px]" />
            ))}
          </div>
        ) : pendingProviders.length === 0 ? (
          <div className="bento-card p-8 text-center">
            <CheckCircle size={32} className="mx-auto mb-3 text-verified" />
            <p className="text-sm text-earth font-medium mb-1">All caught up</p>
            <p className="text-xs text-muted-foreground">
              No pending verifications to review
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingProviders.map((provider) => {
              const isProcessing = processingIds.has(provider.id);
              const displayName =
                [provider.name, provider.surname].filter(Boolean).join(" ") ||
                "Unknown";
              const roleLabel =
                provider.role === "provider_stay"
                  ? "Stay Provider"
                  : "Equipment Provider";

              return (
                <div
                  key={provider.id}
                  className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
                          provider.role === "provider_stay"
                            ? "tag-pastel"
                            : "tag-machinery"
                        }`}
                      >
                        {roleLabel}
                      </span>
                      <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                        {provider.region || "No region"}
                      </span>
                    </div>
                    <h4 className="font-serif-display text-lg text-earth">
                      {displayName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-mono-feorm">
                      Submitted {formatDate(provider.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(provider.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-verified-bg text-verified rounded-full hover:bg-verified-hover transition-colors active:scale-[0.98] min-h-[44px] disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(provider.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-destructive-bg text-destructive rounded-full hover:bg-destructive-hover transition-colors active:scale-[0.98] min-h-[44px] disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

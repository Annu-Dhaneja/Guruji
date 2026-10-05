import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  BookOpen,
  Shirt,
  Sparkles,
  Download,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Zap,
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/overview-stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-purple-400">
        <Activity className="w-8 h-8 animate-spin mr-3" />
        <span>Loading Control Center Real-Time Analytics...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-teal-900/40 border border-purple-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span>Real-time Website Control Center Active</span>
          </div>
          <p className="text-slate-300 text-sm">
            All CMS changes revalidate live across public pages. Security audit logs and database synchronization are enabled.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Backend Authorized
          </span>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Total Revenue</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹{stats.totalRevenue?.toLocaleString('en-IN')}</div>
          <div className="flex items-center text-xs text-emerald-400 gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% from last month
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Total Orders</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalOrders}</div>
          <div className="flex items-center text-xs text-slate-400 gap-2 font-medium">
            <span className="text-amber-400">{stats.pendingOrders} Pending</span>
            <span>•</span>
            <span className="text-emerald-400">{stats.completedOrders} Completed</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Visitors & Users</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalVisitors?.toLocaleString()}</div>
          <div className="flex items-center text-xs text-indigo-300 gap-1 font-medium">
            <span>{stats.totalUsers} registered users</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>SEO Health Score</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 mb-1">{stats.seoHealthScore}/100</div>
          <div className="flex items-center text-xs text-slate-400 font-medium">
            <span>Live sitemap & Google schema active</span>
          </div>
        </div>
      </div>

      {/* Secondary Service Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Book Cover Projects</div>
            <div className="text-lg font-bold text-white">{stats.bookCoverProjects} active</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Wardrobe Consults</div>
            <div className="text-lg font-bold text-white">{stats.wardrobeConsultations} requests</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">AI Prompt Sales</div>
            <div className="text-lg font-bold text-white">₹{stats.promptSales?.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Digital Downloads</div>
            <div className="text-lg font-bold text-white">{stats.downloads} items</div>
          </div>
        </div>
      </div>

      {/* Analytics Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-base">Monthly Revenue & Orders</h3>
              <p className="text-slate-400 text-xs">Real-time studio transaction tracking</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">2026 YTD</span>
          </div>

          <div className="space-y-4">
            {stats.analyticsCharts?.revenueMonthly?.map((m: any) => (
              <div key={m.month} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{m.month}</span>
                  <span className="text-purple-300">₹{m.revenue?.toLocaleString()} ({m.orders} orders)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-teal-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (m.revenue / 50000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Services & Products */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-white font-bold text-base mb-3">Top Services</h3>
            <div className="space-y-2">
              {stats.topServices?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl text-xs text-slate-200">
                  <span className="font-medium truncate max-w-[200px]">{item}</span>
                  <span className="text-teal-400 font-semibold">High Demand</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-base mb-3">Top Products</h3>
            <div className="space-y-2">
              {stats.topProducts?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl text-xs text-slate-200">
                  <span className="font-medium truncate max-w-[200px]">{item}</span>
                  <span className="text-purple-400 font-semibold">Top Seller</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-base">Recent Audit & Security Logs</h3>
            <p className="text-slate-400 text-xs">Full administrative activity trail</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Admin</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentActivities?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{log.adminName}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{log.resource}</td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

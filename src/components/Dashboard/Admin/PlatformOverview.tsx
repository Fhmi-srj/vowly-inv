import * as React from "react";
import { useState, useEffect } from "react";
import { Users, Layout, Activity, UserPlus, ArrowRight, Loader2 } from "lucide-react";

interface Stats {
    totalUsers: number;
    totalInvitations: number;
    recentUsers: any[];
}

const PlatformOverview: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                setStats(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-950 border border-white/5 p-8 rounded-[2rem] shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-black tracking-widest uppercase text-slate-500">Total Pengguna</p>
                    </div>
                    <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
                    <p className="text-xs text-slate-400 mt-2">+12% dari bulan lalu</p>
                </div>

                <div className="bg-slate-950 border border-white/5 p-8 rounded-[2rem] shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Layout className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-black tracking-widest uppercase text-slate-500">Undangan Aktif</p>
                    </div>
                    <p className="text-4xl font-bold text-white">{stats?.totalInvitations || 0}</p>
                    <p className="text-xs text-slate-400 mt-2">vowly.com/live</p>
                </div>

                <div className="bg-slate-950 border border-white/5 p-8 rounded-[2rem] shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-black tracking-widest uppercase text-slate-500">Registrasi Baru</p>
                    </div>
                    <p className="text-4xl font-bold text-white">4</p>
                    <p className="text-xs text-slate-400 mt-2">Dalam 24 jam terakhir</p>
                </div>
            </div>

            {/* RECENT USERS TABLE */}
            <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white">Pengguna Terbaru</h3>
                        <p className="text-xs text-slate-400 mt-1">Daftar pendaftar terakhir di platform Anda.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all">
                        LIHAT SEMUA <ArrowRight size={14} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-black/20">
                                <th className="px-8 py-5">Nama</th>
                                <th className="px-8 py-5">Kontak</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.recentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-500/20">
                                                {user.full_name?.charAt(0)}
                                            </div>
                                            <p className="font-bold text-sm text-slate-100">{user.full_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-400">{user.phone}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlatformOverview;

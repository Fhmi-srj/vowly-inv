import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Globe, Link as LinkIcon, ExternalLink, MoreVertical, Loader2 } from "lucide-react";

interface InvitationData {
    id: number;
    slug: string;
    theme_id: string;
    status: string;
    owner_name: string;
    owner_phone: string;
    created_at: string;
}

const InvitationManagement: React.FC = () => {
    const [invitations, setInvitations] = useState<InvitationData[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const res = await fetch("/api/admin/invitations");
            if (res.ok) {
                const data = await res.json();
                setInvitations(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvitations = invitations.filter(i =>
        i.slug.toLowerCase().includes(search.toLowerCase()) ||
        i.owner_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-reveal">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif italic font-bold text-slate-900">Daftar Undangan</h2>
                    <p className="text-slate-500 text-sm mt-1">Mengelola {invitations.length} undangan yang diterbitkan di Vowly.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari slug atau nama owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50/50">
                                <th className="px-8 py-5">Subdomain / Slug</th>
                                <th className="px-8 py-5">Pemilik (Owner)</th>
                                <th className="px-8 py-5">Theme</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvitations.map((invite) => (
                                <tr key={invite.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">{invite.slug}</p>
                                                <a href={`/${invite.slug}`} target="_blank" className="text-[10px] text-indigo-500 flex items-center gap-1 hover:underline">
                                                    Lihat Undangan <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium text-slate-700">{invite.owner_name}</p>
                                            <p className="text-[11px] text-slate-400">{invite.owner_phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 capitalize">
                                            {invite.theme_id}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${invite.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {invite.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvitations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic text-sm">
                                        Tidak ada undangan yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvitationManagement;

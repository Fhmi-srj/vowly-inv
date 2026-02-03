import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Layout, Eye, Settings, ExternalLink } from "lucide-react";

interface Invitation {
    id: number;
    slug: string;
    views_count: number;
    created_at: string;
}

const InvitationList: React.FC = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const res = await fetch("/api/invitations");
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl italic">Undangan Anda</h2>
                <a
                    href="/dashboard/create"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" /> Buat Undangan Baru
                </a>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400">Loading invitations...</div>
            ) : invitations.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] space-y-4">
                    <Layout className="h-12 w-12 mx-auto text-slate-200" />
                    <p className="text-slate-400">Belum ada undangan. Mulai buat sekarang!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => (
                        <div key={inv.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                    <Layout className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <Eye className="h-3 w-3" /> {inv.views_count} Views
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-1">/{inv.slug}</h3>
                            <p className="text-xs text-slate-400 mb-8">Dibuat pada {new Date(inv.created_at).toLocaleDateString()}</p>

                            <div className="flex items-center gap-3 pt-6 border-t border-slate-50 dark:border-white/5">
                                <a
                                    href={`/dashboard/manage/${inv.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                                >
                                    <Settings className="h-3.5 w-3.5" /> Kelola
                                </a>
                                <a
                                    href={`/${inv.slug}`}
                                    target="_blank"
                                    className="px-4 py-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvitationList;

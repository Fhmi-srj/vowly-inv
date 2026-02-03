import * as React from "react";
import { useState, useEffect } from "react";
import { Palette, Layers, CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";

interface TemplateInfo {
    id: string;
    name: string;
    color: string;
    count: number;
}

const TemplateRegistry: React.FC = () => {
    const [templates, setTemplates] = useState<TemplateInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/admin/templates");
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
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
        <div className="space-y-10 animate-reveal">
            <div>
                <h2 className="text-3xl font-serif italic font-bold text-slate-900">Template Registry</h2>
                <p className="text-slate-500 text-sm mt-1">Katalog desain undangan yang tersedia dan statistik penggunaannya.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <div key={template.id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 ${template.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                <Palette size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Active
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-serif italic font-bold text-slate-900">{template.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Theme ID: {template.id}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Digunakan Oleh</p>
                                <p className="text-xl font-bold text-slate-900">{template.count} Koleksi</p>
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* ADD NEW PLACEHOLDER */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 hover:bg-slate-100 transition-all group cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 shadow-sm transition-colors">
                        <Layers size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Tambah Desain Baru</p>
                        <p className="text-xs text-slate-400 max-w-[180px]">Daftarkan template tema baru ke dalam registry.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateRegistry;

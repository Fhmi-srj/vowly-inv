import * as React from "react";
import { useStore } from "@nanostores/react";
import { LogOut, LayoutDashboard, Users, CreditCard, Palette, Globe, Shield } from "lucide-react";
import { activeAdminTabStore, setActiveAdminTab, type AdminTab } from "../../../store/adminStore";

const AdminSidebar: React.FC = () => {
    const activeTab = useStore(activeAdminTabStore);

    const menuItems: { id: AdminTab; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Manajemen User', icon: Users },
        { id: 'invitations', label: 'Semua Undangan', icon: Globe },
        { id: 'templates', label: 'Template Registry', icon: Palette },
        { id: 'payments', label: 'Transaksi', icon: CreditCard },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 hidden lg:block">
            <div className="flex flex-col h-full p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Shield className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-serif italic font-bold tracking-tight text-slate-900">
                        Vowly <span className="text-indigo-600 font-sans text-xs not-italic font-black align-top ml-1">PRO</span>
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveAdminTab(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${isActive
                                        ? "bg-slate-50 border border-slate-100 text-indigo-600 font-bold shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <form action="/api/auth/logout" method="POST" className="mt-auto">
                    <button type="submit" className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all group">
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default AdminSidebar;

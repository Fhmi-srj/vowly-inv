import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { activeTabStore, setActiveTab } from '../../store/dashboardStore';
import type { DashboardTab } from '../../store/dashboardStore';
import {
    LogOut,
    LayoutDashboard,
    Settings,
    Users,
    MessageCircle,
    Heart,
    User,
    QrCode,
    Printer,
    X
} from "lucide-react";

interface SidebarProps {
    invitationId?: number;
    userName?: string;
    initialTab?: DashboardTab;
}

const Sidebar: React.FC<SidebarProps> = ({ invitationId, userName, initialTab }) => {
    const $activeTab = useStore(activeTabStore);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (initialTab) {
            activeTabStore.set(initialTab);
        }
    }, [initialTab]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleNavClick = (tab: DashboardTab, e: React.MouseEvent) => {
        // If we're on a manage page and have an invitationId, handle as SPA
        if (invitationId && window.location.pathname.includes('/dashboard/manage/')) {
            e.preventDefault();
            setActiveTab(tab);
            setIsOpen(false);
        }
        // Otherwise, let the link handle standard navigation to another page
    };

    const getLink = (tab: DashboardTab) => {
        if (invitationId) {
            return `/dashboard/manage/${invitationId}?tab=${tab}`;
        }
        return `/dashboard?tab=${tab}`;
    };

    const navItems = [
        { id: 'overview' as const, label: 'Ringkasan', icon: LayoutDashboard },
    ];

    const manageItems = invitationId ? [
        { id: 'rsvp' as const, label: 'Data RSVP', icon: Users },
        { id: 'wishes' as const, label: 'Ucapan & Doa', icon: MessageCircle },
        { id: 'qr' as const, label: 'QR Generator', icon: QrCode },
        { id: 'pdf' as const, label: 'Design PDF', icon: Printer },
    ] : [];

    const accountItems = [
        { id: 'settings' as const, label: 'Pengaturan', icon: Settings },
        { id: 'profile' as const, label: 'Profil Saya', icon: User },
    ];

    const renderLink = (item: { id: DashboardTab, label: string, icon: any }) => (
        <a
            key={item.id}
            href={getLink(item.id)}
            onClick={(e) => handleNavClick(item.id, e)}
            className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold transition-all ${$activeTab === item.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"}`}
        >
            <item.icon size={18} />
            <span className="text-sm">{item.label}</span>
        </a>
    );

    return (
        <>
            {/* Mobile Hamburger (Only shows if this component is placed in a way that it can control it) */}
            {/* Note: The Button is in Header usually, so we might need a store for isOpen too if they are separate islands */}

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full p-8">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                <Heart className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-serif italic font-bold">Vowly</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 mb-2 mt-4">Menu Utama</p>
                        {navItems.map(renderLink)}

                        {invitationId && (
                            <>
                                <div className="mt-4"></div>
                                {manageItems.map(renderLink)}
                            </>
                        )}

                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 mb-2 mt-8">Akun & Sistem</p>
                        {accountItems.map(renderLink)}
                    </nav>

                    <form action="/api/auth/logout" method="POST" className="mt-auto">
                        <button type="submit" className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all">
                            <LogOut size={20} />
                            <span>Log Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Expose toggle function for header to use */}
            {typeof window !== 'undefined' && (window as any).toggleSidebar === undefined && (
                <script dangerouslySetInnerHTML={{ __html: `window.toggleSidebar = () => { window.dispatchEvent(new CustomEvent('toggle-sidebar')); }` }} />
            )}

            {/* Listen for toggle event */}
            {useEffect(() => {
                const handler = () => setIsOpen(!isOpen);
                window.addEventListener('toggle-sidebar', handler);
                return () => window.removeEventListener('toggle-sidebar', handler);
            }, [isOpen])}
        </>
    );
};

export default Sidebar;

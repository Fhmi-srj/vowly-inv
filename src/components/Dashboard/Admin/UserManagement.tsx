import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Shield, User, Loader2 } from "lucide-react";

interface UserData {
    id: number;
    full_name: string;
    phone: string;
    role: string;
    created_at: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search)
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
                    <h2 className="text-3xl font-serif italic font-bold text-slate-900">Manajemen Pengguna</h2>
                    <p className="text-slate-500 text-sm mt-1">Total {users.length} pengguna terdaftar di platform.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau nomor HP..."
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
                                <th className="px-8 py-5">Pengguna</th>
                                <th className="px-8 py-5">Kontak</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Tanggal Bergabung</th>
                                <th className="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                {user.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">{user.full_name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">ID: #{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-slate-600">{user.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin'
                                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-400">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic text-sm">
                                        Tidak ada pengguna yang ditemukan.
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

export default UserManagement;

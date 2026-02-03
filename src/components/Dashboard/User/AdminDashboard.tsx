import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  MessageCircle,
  QrCode,
  Printer,
  Save,
  Loader2,
  X,
  Settings,
  LayoutDashboard,
  Link,
  Copy,
  Activity,
  Calendar as CalendarIcon,
  CreditCard,
  ExternalLink,
  Check,
} from "lucide-react";
import QRCodeManager from "./QRCodeManager";
import InvitationManager from "./InvitationManager";
import SettingsManager from "./SettingsManager";

// --- TYPES ---
interface RSVP {
  id: number;
  guest_name: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  guest_count: number;
  message: string;
  created_at: string;
}

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

// --- REUSABLE TABLE COMPONENT ---
const DataTable = <T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onBulkDelete,
}: {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  // Filter Search
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setSelected([]);
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(paginatedData.map((d) => d.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const executeBulkDelete = () => {
    if (onBulkDelete && selected.length > 0) {
      if (confirm(`Yakin hapus ${selected.length} data terpilih?`)) {
        onBulkDelete(selected);
        setSelected([]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} Data
              </option>
            ))}
          </select>
          {onBulkDelete && selected.length > 0 && (
            <button
              type="button"
              onClick={executeBulkDelete}
              className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Hapus ({selected.length})
            </button>
          )}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                {onBulkDelete && (
                  <th className="w-4 px-6 py-4">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((d) => selected.includes(d.id))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 font-bold ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + (onBulkDelete ? 2 : onEdit ? 1 : 0)
                    }
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    {onBulkDelete && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-4 ${col.className || ""}`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(item)}
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Yakin hapus data ini secara permanen?"
                                  )
                                )
                                  onDelete(item.id);
                              }}
                              className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Halaman {filteredData.length === 0 ? 0 : page} dari {totalPages}{" "}
          (Total {filteredData.length} Data)
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = ({
  invitationId,
  invitation,
  initialRsvps,
  initialWishes,
  initialSettings,
  siteUrl,
}: {
  invitationId: number;
  invitation: { slug: string; status: string; created_at: string; buyer_name?: string; views_count?: number };
  initialRsvps: RSVP[];
  initialWishes: Wish[];
  initialSettings: Record<string, string>;
  siteUrl: string;
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "rsvp" | "wishes" | "qr" | "pdf" | "settings">(
    "overview"
  );

  // Data States
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [wishes, setWishes] = useState(initialWishes);

  // UI/Loading States
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- GENERIC DELETE HANDLER ---
  const handleDelete = async (type: "rsvp" | "wish", ids: number[]) => {
    if (ids.length === 0) return;
    setIsDeleting(true);

    try {
      const actionKey = type === "rsvp" ? "delete_rsvp" : "delete_wish";

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionKey, ids, invitationId }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        if (type === "rsvp")
          setRsvps((prev) => prev.filter((i) => !ids.includes(i.id)));
        if (type === "wish")
          setWishes((prev) => prev.filter((i) => !ids.includes(i.id)));
      } else {
        alert("Gagal menghapus: " + (json.error || "Unknown Error"));
      }
    } catch (e) {
      alert("Error Network: Gagal menghubungi server.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- GENERIC UPDATE HANDLER ---
  const handleUpdate = async (type: "rsvp" | "wish", id: number, data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type === "rsvp" ? "update_rsvp" : "update_wish",
          id,
          data,
          invitationId,
        }),
      });

      if (res.ok) {
        if (type === "rsvp") {
          setRsvps((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
          );
        } else {
          setWishes((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
          );
        }
        setIsModalOpen(false);
      } else {
        alert("Gagal update data.");
      }
    } catch (e) {
      alert("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- TABS CONFIG ---
  const tabs = [
    { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { id: "rsvp", label: "Data RSVP", icon: Users },
    { id: "wishes", label: "Ucapan & Doa", icon: MessageCircle },
    { id: "qr", label: "QR Generator", icon: QrCode },
    { id: "pdf", label: "Design PDF", icon: Printer },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin ke clipboard!");
  };

  return (
    <div>
      {/* LOADING OVERLAY */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg font-bold text-slate-700">
              Menghapus Data...
            </span>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-1 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === "overview" && (
        <div className="animate-reveal space-y-8">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Total Kunjungan</p>
                  <h4 className="mt-2 text-4xl font-bold dark:text-white">{invitation?.views_count || 0}</h4>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-600">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live Monitoring
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Tanggal Dibuat</p>
                  <h4 className="mt-2 text-lg font-bold dark:text-white">
                    {invitation?.created_at ? new Date(invitation.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </h4>
                </div>
                <div className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <CalendarIcon className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-400">Pembeli: {invitation?.buyer_name || "Guest"}</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-sm dark:bg-primary/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold tracking-widest text-primary uppercase">Status Paket</p>
                  <h4 className="mt-2 text-xl font-bold text-primary dark:text-primary-light">Vowly Premium</h4>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase">
                  <Check className="h-3 w-3" /> Aktif Selamanya
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total RSVP</p>
                  <p className="text-xl font-bold dark:text-white">{initialRsvps.length} Orang</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Ucapan</p>
                  <p className="text-xl font-bold dark:text-white">{initialWishes.length} Pesan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* INVITATION LINKS */}
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h5 className="mb-6 flex items-center gap-2 text-xl font-bold dark:text-white">
                <Link className="h-5 w-5 text-primary" /> Link Undangan
              </h5>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tamu Pria</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 truncate rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      {`${siteUrl}/${invitation?.slug || ""}`}
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${siteUrl}/${invitation?.slug || ""}`)}
                      className="rounded-2xl bg-slate-100 p-3.5 text-slate-600 hover:bg-primary hover:text-white transition-all dark:bg-slate-700 dark:text-slate-300"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <a
                      href={`/${invitation?.slug || ""}`}
                      target="_blank"
                      className="rounded-2xl bg-blue-50 p-3.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all dark:bg-blue-900/20"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tamu Wanita</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 truncate rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      {`${siteUrl}/${invitation?.slug || ""}`}
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${siteUrl}/${invitation?.slug || ""}`)}
                      className="rounded-2xl bg-slate-100 p-3.5 text-slate-600 hover:bg-primary hover:text-white transition-all dark:bg-slate-700 dark:text-slate-300"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <a
                      href={`/${invitation?.slug || ""}`}
                      target="_blank"
                      className="rounded-2xl bg-blue-50 p-3.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all dark:bg-blue-900/20"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK PREVIEW / HELP */}
            <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-xl dark:from-slate-800 dark:to-slate-950">
              <h5 className="mb-4 text-2xl font-serif italic font-bold">Butuh Bantuan?</h5>
              <p className="mb-8 text-slate-400">Undangan Anda sudah siap dibagikan. Jika ingin mengubah desain atau informasi acara, buka tab **Pengaturan**.</p>

              <div className="space-y-4">
                <a href="https://wa.me/6281234567890" className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-5 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-500">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="font-bold">WhatsApp Support</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                </a>
                <div className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/20 p-2 text-primary">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <span className="font-bold">Upgrade Ke Platinum</span>
                  </div>
                  <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap">Upgrade</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: RSVP --- */}
      {activeTab === "rsvp" && (
        <div className="animate-reveal space-y-6">
          <div className="flex justify-end">
            <a
              href="/api/export-rsvp"
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700"
            >
              <Download className="h-4 w-4" /> EXPORT CSV
            </a>
          </div>
          <DataTable
            data={rsvps}
            columns={[
              {
                header: "Nama Tamu",
                accessor: "guest_name",
                className: "font-medium",
              },
              {
                header: "Status",
                accessor: (item) => (
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.attendance === "hadir"
                      ? "bg-green-100 text-green-700"
                      : item.attendance === "tidak_hadir"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {item.attendance.replace("_", " ")}
                  </span>
                ),
              },
              { header: "Pax", accessor: "guest_count" },
              {
                header: "Pesan",
                accessor: (item) => (
                  <span className="block max-w-[200px] truncate text-slate-500">
                    {item.message}
                  </span>
                ),
              },
              {
                header: "Waktu",
                accessor: (item) =>
                  new Date(item.created_at).toLocaleDateString("id-ID"),
              },
            ]}
            onEdit={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
            onDelete={(id) => handleDelete("rsvp", [id])}
            onBulkDelete={(ids) => handleDelete("rsvp", ids)}
          />
        </div>
      )}

      {/* --- TAB: WISHES --- */}
      {activeTab === "wishes" && (
        <div className="animate-reveal space-y-6">
          <div className="flex justify-end">
            <a
              href="/api/export-wishes"
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Download className="h-4 w-4" /> EXPORT CSV
            </a>
          </div>
          <DataTable
            data={wishes}
            columns={[
              {
                header: "Nama Pengirim",
                accessor: "name",
                className: "font-medium",
              },
              {
                header: "Ucapan",
                accessor: (item) => (
                  <span className="block max-w-[300px] text-wrap text-slate-500 italic">
                    "{item.message}"
                  </span>
                ),
              },
              {
                header: "Waktu",
                accessor: (item) =>
                  new Date(item.created_at).toLocaleDateString("id-ID"),
              },
            ]}
            onEdit={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
            onDelete={(id) => handleDelete("wish", [id])}
            onBulkDelete={(ids) => handleDelete("wish", ids)}
          />
        </div>
      )}

      {/* --- TAB: QR --- */}
      {activeTab === "qr" && (
        <div className="animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <QRCodeManager siteUrl={siteUrl} />
        </div>
      )}

      {/* --- TAB: PDF --- */}
      {activeTab === "pdf" && (
        <div className="animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <InvitationManager />
        </div>
      )}

      {/* --- TAB: SETTINGS --- */}
      {activeTab === "settings" && (
        <div className="animate-reveal">
          <SettingsManager
            invitationId={invitationId}
            initialSettings={initialSettings}
          />
        </div>
      )}

      {/* --- EDIT MODAL (RSVP & WISHES) --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">Edit Data</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                handleUpdate(
                  activeTab === "rsvp" ? "rsvp" : "wish",
                  editingItem.id,
                  data
                );
              }}
              className="space-y-4"
            >
              {activeTab === "rsvp" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Nama Tamu
                    </label>
                    <input
                      name="guest_name"
                      defaultValue={editingItem.guest_name}
                      className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Status
                      </label>
                      <select
                        name="attendance"
                        defaultValue={editingItem.attendance}
                        className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="hadir">Hadir</option>
                        <option value="ragu">Ragu</option>
                        <option value="tidak_hadir">Tidak Hadir</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Pax
                      </label>
                      <input
                        type="number"
                        name="guest_count"
                        defaultValue={editingItem.guest_count}
                        min={1}
                        className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      defaultValue={editingItem.message}
                      className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      rows={3}
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Nama Pengirim
                    </label>
                    <input
                      name="name"
                      defaultValue={editingItem.name}
                      className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Ucapan
                    </label>
                    <textarea
                      name="message"
                      defaultValue={editingItem.message}
                      className="w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      rows={5}
                      required
                    ></textarea>
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}{" "}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

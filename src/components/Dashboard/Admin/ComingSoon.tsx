import * as React from "react";
import { CreditCard, Rocket } from "lucide-react";

const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                <CreditCard size={40} className="animate-pulse" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-serif italic font-bold text-slate-900">{title}</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Fitur ini sedang dalam tahap pengembangan intensif untuk memberikan pengalaman terbaik bagi Anda.
                </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-200">
                <Rocket size={14} /> Coming Soon
            </div>
        </div>
    );
};

export default ComingSoon;

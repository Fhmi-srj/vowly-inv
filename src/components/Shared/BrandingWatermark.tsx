import type { FC } from 'react';
import { Heart } from 'lucide-react';

export const BrandingWatermark: FC = () => {
    return (
        <div className="py-12 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2">
                <Heart className="h-3 w-3 text-pink-500 fill-current" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">Undangan Digital by</span>
            </div>
            <a
                href="https://vowly.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-serif italic text-slate-800 hover:text-pink-500 transition-colors"
            >
                Vowly
            </a>
        </div>
    );
};

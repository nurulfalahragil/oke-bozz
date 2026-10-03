import React from 'react';
import { Film, HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Oke<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Bozz</span> AI Studio
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Creative Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Studio AI Terpadu: Iklan Storyboard • Animasi • Desainer • Teks to Suara
              </p>
            </div>
          </div>

          {/* Actions & Guide */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Panduan Penggunaan Flow AI, Kling, & Midjourney"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Panduan Flow AI &amp; Video</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


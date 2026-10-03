import React from 'react';
import {
  Film,
  Sparkles,
  Clapperboard,
  Palette,
  Volume2,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export type ActiveMenu = 'storyboard' | 'animasi' | 'desainer' | 'tts';

interface SidebarProps {
  activeMenu: ActiveMenu;
  onSelectMenu: (menu: ActiveMenu) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpenMobile,
  onToggleMobile,
}) => {
  const menuItems = [
    {
      id: 'storyboard' as ActiveMenu,
      number: '1',
      title: 'Iklan Storyboard',
      subtitle: 'Generator Prompt TTI & TTV Iklan',
      icon: Film,
      badge: 'Utama',
      gradient: 'from-indigo-500 to-purple-600',
      activeColor: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50',
    },
    {
      id: 'animasi' as ActiveMenu,
      number: '2',
      title: 'Animasi',
      subtitle: 'Prompt Motion & Animasi Produk',
      icon: Clapperboard,
      badge: '3D/2D',
      gradient: 'from-purple-500 to-pink-600',
      activeColor: 'bg-purple-600/20 text-purple-300 border-purple-500/50',
    },
    {
      id: 'desainer' as ActiveMenu,
      number: '3',
      title: 'Desainer',
      subtitle: 'Poster, Banner & Feed Promo',
      icon: Palette,
      badge: 'Visual',
      gradient: 'from-pink-500 to-rose-600',
      activeColor: 'bg-pink-600/20 text-pink-300 border-pink-500/50',
    },
    {
      id: 'tts' as ActiveMenu,
      number: '4',
      title: 'Teks to Suara',
      subtitle: 'Voiceover & Pacing Audio Iklan',
      icon: Volume2,
      badge: 'Audio',
      gradient: 'from-emerald-500 to-teal-600',
      activeColor: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onToggleMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Oke<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Bozz</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Studio Kreatif AI Terpadu</p>
            </div>
          </div>

          <button
            onClick={onToggleMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-3 pt-2 pb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Menu Utama Studio
            </span>
          </div>

          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectMenu(item.id);
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-3 relative ${
                  isActive
                    ? `${item.activeColor} shadow-md shadow-indigo-950/40 font-semibold`
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? `bg-gradient-to-tr ${item.gradient} text-white shadow-md shadow-indigo-600/30`
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">{item.number}.</span>
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                </div>

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 4 Studio Modules Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Pilih menu di panel kiri untuk beralih fungsi studio iklan &amp; prompt AI.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

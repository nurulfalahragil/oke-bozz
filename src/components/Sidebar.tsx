import React from 'react';
import {
  Film,
  Sparkles,
  Clapperboard,
  Palette,
  Volume2,
  Layers,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Zap,
  FileText
} from 'lucide-react';

export type ActiveMenu = 'storyboard' | 'iklan-simpel' | 'animasi' | 'desainer' | 'tts';

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
  const isStoryboardGroupActive = activeMenu === 'storyboard' || activeMenu === 'iklan-simpel';

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
      hasSubmenu: true,
      subItems: [
        {
          id: 'storyboard' as ActiveMenu,
          title: 'Storyboard Lengkap',
          subtitle: '40 Gaya, Multi-Panel & Master Sheet',
          icon: FileText,
          badge: '40 Gaya',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        },
        {
          id: 'iklan-simpel' as ActiveMenu,
          title: 'Iklan Simpel',
          subtitle: 'Format Cepat 15–30s, Hook & Caption',
          icon: Zap,
          badge: 'Instan ⚡',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        },
      ],
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
            const isItemActive =
              item.id === 'storyboard'
                ? isStoryboardGroupActive
                : activeMenu === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="space-y-1">
                {/* Main Menu Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (item.id === 'storyboard') {
                      onSelectMenu(activeMenu === 'iklan-simpel' ? 'iklan-simpel' : 'storyboard');
                    } else {
                      onSelectMenu(item.id);
                    }
                    if (isOpenMobile && !item.hasSubmenu) onToggleMobile();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-3 relative ${
                    isItemActive
                      ? `${item.activeColor} shadow-md shadow-indigo-950/40 font-semibold`
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isItemActive
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
                          isItemActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>

                  {item.hasSubmenu ? (
                    <ChevronDown
                      className={`w-4 h-4 text-indigo-400 flex-shrink-0 transition-transform ${
                        isItemActive ? 'rotate-0' : '-rotate-90 text-slate-500'
                      }`}
                    />
                  ) : (
                    isItemActive && <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  )}
                </button>

                {/* Sub Menu Items (Under Menu 1: Iklan Storyboard) */}
                {item.hasSubmenu && (
                  <div
                    className={`pl-4 pr-1 space-y-1 transition-all ${
                      isStoryboardGroupActive ? 'block mt-1' : 'hidden'
                    }`}
                  >
                    {item.subItems?.map((sub) => {
                      const isSubActive = activeMenu === sub.id;
                      const SubIcon = sub.icon;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMenu(sub.id);
                            if (isOpenMobile) onToggleMobile();
                          }}
                          className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-2.5 relative ${
                            isSubActive
                              ? sub.id === 'iklan-simpel'
                                ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-xs font-bold'
                                : 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-xs font-bold'
                              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-800'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center ${
                              isSubActive
                                ? sub.id === 'iklan-simpel'
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <SubIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs truncate">{sub.title}</span>
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border ${sub.badgeColor}`}
                              >
                                {sub.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{sub.subtitle}</p>
                          </div>

                          {isSubActive && (
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                sub.id === 'iklan-simpel' ? 'bg-amber-400' : 'bg-indigo-400'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Studio Modules Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Termasuk sub-menu <strong>Iklan Simpel</strong> untuk prompt video cepat 15s.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar, ActiveMenu } from './components/Sidebar';
import { Header } from './components/Header';
import { GuideModal } from './components/GuideModal';
import { StoryboardStudioView } from './components/modules/StoryboardStudioView';
import { SimpleAdStudioView } from './components/modules/SimpleAdStudioView';
import { AnimationStudioView } from './components/modules/AnimationStudioView';
import { DesignerStudioView } from './components/modules/DesignerStudioView';
import { TextToSpeechStudioView } from './components/modules/TextToSpeechStudioView';
import { DEFAULT_REQUEST, INITIAL_EMPTY_STORYBOARD } from './data/defaultData';
import { GeneratorRequest, StoryboardData } from './types';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('storyboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [customVoText, setCustomVoText] = useState<string>('');

  // Shared state across studios (uploading product photo reflects in Designer, Animation, and Simple Ad!)
  const [request, setRequest] = useState<GeneratorRequest>(DEFAULT_REQUEST);
  const [storyboardData, setStoryboardData] = useState<StoryboardData>(INITIAL_EMPTY_STORYBOARD);

  const handleSendToTts = (scriptText: string) => {
    setCustomVoText(scriptText);
    setActiveMenu('tts');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL: Multi-Module Sidebar Navigation with Submenus */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        isOpenMobile={isOpenMobile}
        onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
      />

      {/* RIGHT PANEL: Active Studio Application View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Mobile Menu Button */}
        <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 md:hidden">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold capitalize">Menu Studio</span>
          </button>

          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
            OkeBozz AI
          </span>
        </div>

        {/* Global Header (Actions & Guide) */}
        <Header
          onOpenGuide={() => setGuideOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Menu 1.1: Iklan Storyboard (Lengkap / Multi-Panel) */}
          {activeMenu === 'storyboard' && (
            <StoryboardStudioView
              request={request}
              setRequest={setRequest}
              storyboardData={storyboardData}
              setStoryboardData={setStoryboardData}
              onOpenGuide={() => setGuideOpen(true)}
              onSwitchToSimpleAd={() => setActiveMenu('iklan-simpel')}
            />
          )}

          {/* Menu 1.2: Sub Menu Iklan Simpel (Instan & Cepat) */}
          {activeMenu === 'iklan-simpel' && (
            <SimpleAdStudioView
              request={request}
              setRequest={setRequest}
              onSwitchToStoryboard={() => setActiveMenu('storyboard')}
              onSwitchToTts={handleSendToTts}
            />
          )}

          {/* Menu 2: Animasi */}
          {activeMenu === 'animasi' && (
            <AnimationStudioView
              productName={request.productName}
              productImage={request.productImage}
            />
          )}

          {/* Menu 3: Desainer */}
          {activeMenu === 'desainer' && (
            <DesignerStudioView
              productName={request.productName}
              tagline={request.tagline || ''}
              productImage={request.productImage}
              brandName={request.brandName || ''}
            />
          )}

          {/* Menu 4: Teks to Suara */}
          {activeMenu === 'tts' && (
            <TextToSpeechStudioView
              productName={request.productName}
              defaultVoText={
                customVoText ||
                storyboardData.parts[0]?.scenes?.map((s) => s.vo).join(' ') ||
                'Selamat datang di OkeBozz AI Studio. Silakan ketik atau pilih naskah iklan Anda.'
              }
              defaultDuration={storyboardData.durationTotal || 15}
            />
          )}
        </main>

        {/* Guide Modal */}
        <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/50 py-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} OkeBozz AI Studio — Iklan Storyboard • Iklan Simpel • Animasi • Desainer • Teks to Suara</p>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>Flow AI • Midjourney • Kling AI • Runway Gen-3</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SimcInspectorTab } from './components/SimcInspectorTab';
import { DelveMasteryTab } from './components/DelveMasteryTab';
import { FolioRunesTab } from './components/FolioRunesTab';
import { NoRaidRoadmapTab } from './components/NoRaidRoadmapTab';
import { DatabaseExplorerTab } from './components/DatabaseExplorerTab';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { BuildsSimulatorTab } from './components/BuildsSimulatorTab';
import { WowItem, ActiveSpec, CombatScenario } from './types/wow';
import { TooltipProvider } from './context/TooltipContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simc');
  const [scenario, setScenario] = useState<CombatScenario>('patchwerk');
  const [currentSpec, setCurrentSpec] = useState<ActiveSpec>('demonology');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  const handleSelectItemForAudit = (item: WowItem) => {
    setActiveTab('simc');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scenario={scenario}
        setScenario={setScenario}
        currentSpec={currentSpec}
        setCurrentSpec={setCurrentSpec}
        onOpenAiChat={() => setIsAiDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simc' && (
          <SimcInspectorTab
            scenario={scenario}
            setScenario={setScenario}
            currentSpec={currentSpec}
          />
        )}
        {activeTab === 'builds' && <BuildsSimulatorTab externalSpecId={currentSpec} onSpecChange={setCurrentSpec} />}
        {activeTab === 'delves' && <DelveMasteryTab scenario={scenario as any} setScenario={setScenario as any} />}
        {activeTab === 'runes' && <FolioRunesTab />}
        {activeTab === 'noraid' && <NoRaidRoadmapTab />}
        {activeTab === 'database' && <DatabaseExplorerTab onSelectItemForAudit={handleSelectItemForAudit} />}
      </main>

      {/* AI Tactical Consultant Drawer */}
      <AiConsultantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        scenario={scenario}
        currentSpec={currentSpec}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-zinc-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-zinc-400">
            World of Warcraft: Midnight — Patch 12.1.5 (A Maldição de Ula'tek) · Temporada 2
          </p>
          <p className="text-[11px] text-zinc-600">
            Auditado com dados oficiais do tooltip PT-BR (locale=8 / DB2). Respeito estrito aos 5 tetos de build (331 craft, 2 embelezamentos, 1 diamante, 72 runas, R4 berloques).
          </p>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}

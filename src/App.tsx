import React, { useEffect, useState } from 'react';
import { Navbar, Area } from './components/Navbar';
import { SimcInspectorTab } from './components/SimcInspectorTab';
import { DelveMasteryTab } from './components/DelveMasteryTab';
import { FolioRunesTab } from './components/FolioRunesTab';
import { NoRaidRoadmapTab } from './components/NoRaidRoadmapTab';
import { DatabaseExplorerTab } from './components/DatabaseExplorerTab';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { BuildsSimulatorTab } from './components/BuildsSimulatorTab';
import { WowItem, ActiveSpec, CombatScenario } from './types/wow';
import { TooltipProvider } from './context/TooltipContext';
import { fetchCatalogItems } from './services/catalogService';
import { aplicarCatalogo } from './data/items';

type SubTab = { id: string; label: string };

const SUBTABS: Record<Area, SubTab[]> = {
  simular: [
    { id: 'inspecionar', label: 'Inspecionar' },
    { id: 'builds', label: 'Builds' },
  ],
  explorar: [
    { id: 'itens', label: 'Itens' },
    { id: 'runas', label: 'Runas' },
  ],
  planejar: [
    { id: 'progressao', label: 'Progressão' },
    { id: 'delves', label: 'Delves' },
  ],
};

export default function App() {
  const [area, setAreaState] = useState<Area>('simular');
  const [sub, setSub] = useState<string>(SUBTABS.simular[0].id);
  const [scenario, setScenario] = useState<CombatScenario>('patchwerk');
  const [currentSpec, setCurrentSpec] = useState<ActiveSpec>('demonology');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  const setArea = (nova: Area) => {
    setAreaState(nova);
    setSub(SUBTABS[nova][0].id);
  };

  const irParaAuditoria = () => {
    setAreaState('simular');
    setSub('inspecionar');
  };

  // Reconcile item names with the authoritative Python catalog (best effort).
  useEffect(() => {
    fetchCatalogItems()
      .then((itens) => aplicarCatalogo(itens))
      .catch(() => {
        /* backend offline: keep the bundled names */
      });
  }, []);

  const handleSelectItemForAudit = (_item: WowItem) => {
    irParaAuditoria();
  };

  const subtabs = SUBTABS[area];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar
          area={area}
          setArea={setArea}
          scenario={scenario}
          setScenario={setScenario}
          currentSpec={currentSpec}
          setCurrentSpec={setCurrentSpec}
          onOpenAiChat={() => setIsAiDrawerOpen(true)}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
          {/* Secondary tabs (only when the area has more than one section) */}
          {subtabs.length > 1 && (
            <div className="flex items-center gap-1 mb-8 border-b border-zinc-900 pb-2">
              {subtabs.map((tab) => {
                const ativo = sub === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSub(tab.id)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${ativo
                        ? 'text-white bg-zinc-800/80'
                        : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {area === 'simular' && sub === 'inspecionar' && (
            <SimcInspectorTab scenario={scenario} setScenario={setScenario} currentSpec={currentSpec} />
          )}
          {area === 'simular' && sub === 'builds' && (
            <BuildsSimulatorTab externalSpecId={currentSpec} onSpecChange={setCurrentSpec} />
          )}

          {area === 'explorar' && sub === 'itens' && (
            <DatabaseExplorerTab onSelectItemForAudit={handleSelectItemForAudit} />
          )}
          {area === 'explorar' && sub === 'runas' && <FolioRunesTab />}

          {area === 'planejar' && sub === 'progressao' && <NoRaidRoadmapTab />}
          {area === 'planejar' && sub === 'delves' && (
            <DelveMasteryTab scenario={scenario as any} setScenario={setScenario as any} />
          )}
        </main>

        <AiConsultantDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          scenario={scenario}
          currentSpec={currentSpec}
        />

        <footer className="border-t border-zinc-900 py-6 text-zinc-600 text-xs text-center">
          <p>World of Warcraft: Midnight — Patch 12.1.5 · Temporada 2</p>
          <p className="text-[11px] text-zinc-700 mt-1">
            Números de DPS somente pelo SimulationCraft. Dados auditados do tooltip PT-BR.
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
}

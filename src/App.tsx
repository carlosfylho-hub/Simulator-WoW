import React, { useEffect, useState } from 'react';
import { Navbar, Aba, ABAS_AVANCADAS } from './components/Navbar';
import { SimcInspectorTab } from './components/SimcInspectorTab';
import { DelveMasteryTab } from './components/DelveMasteryTab';
import { FolioRunesTab } from './components/FolioRunesTab';
import { NoRaidRoadmapTab } from './components/NoRaidRoadmapTab';
import { DatabaseExplorerTab } from './components/DatabaseExplorerTab';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { BuildsSimulatorTab } from './components/BuildsSimulatorTab';
import { TopGearPanel } from './components/TopGearPanel';
import { DroptimizerPanel } from './components/DroptimizerPanel';
import { MasmorrasPanel } from './components/MasmorrasPanel';
import { PerfilTab } from './components/PerfilTab';
import { HistoricoTab } from './components/HistoricoTab';
import { ActiveSpec, CombatScenario } from './types/wow';
import { normalizarCenario } from './data/scenarios';
import { TooltipProvider } from './context/TooltipContext';
import { PerfilProvider, usePerfil } from './context/PerfilContext';
import { usePersistedState } from './services/persistedState';
import { fetchCatalogItems, fetchIconMap } from './services/catalogService';
import { aplicarCatalogo, aplicarIcones } from './data/items';

const SPECS_LEGADAS: ActiveSpec[] = ['demonology', 'affliction', 'destruction', 'balance', 'shadow'];

/** Faixa de uma linha nas telas do menu Avançado (docs/PLANO-REDESIGN-UI.md §5.5). */
const FaixaAvancado: React.FC<{ rotulo: string }> = ({ rotulo }) => (
    <div className="mb-6 rounded-lg border border-borda bg-superficie px-3 py-2 text-xs text-texto-2">
        <span className="font-medium text-texto">{rotulo}</span> · ferramenta avançada — o Raidbots/AMR cobre
        isto; mantida sem novas funções.
    </div>
);

function Conteudo() {
    const { temPerfil, resumo } = usePerfil();
    const [aba, setAbaPersistida] = usePersistedState<Aba>('wowsim.aba', temPerfil ? 'masmorras' : 'perfil');
    const [scenario, setScenario] = usePersistedState<CombatScenario>('wowsim.cenario', 'dungeon_slice' as CombatScenario);
    const [specManual, setSpecManual] = useState<ActiveSpec>('demonology');
    const [consultorAberto, setConsultorAberto] = useState(false);
    const [jobParaAbrir, setJobParaAbrir] = useState<string | null>(null);

    // A spec vem do perfil importado; as telas legadas ainda recebem ``ActiveSpec``.
    const specPerfil = (resumo?.spec ?? '') as ActiveSpec;
    const currentSpec = SPECS_LEGADAS.includes(specPerfil) ? specPerfil : specManual;

    // T14: preferências antigas podem ter cenários legados.
    useEffect(() => {
        const normalizado = normalizarCenario(scenario as string);
        if (normalizado !== (scenario as string)) setScenario(normalizado as CombatScenario);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Nomes e ícones vêm do catálogo do backend (Python).
    useEffect(() => {
        fetchCatalogItems().then(aplicarCatalogo).catch(() => undefined);
        fetchIconMap().then(aplicarIcones).catch(() => undefined);
    }, []);

    const setAba = (nova: Aba) => {
        if (nova === 'consultor') {
            setConsultorAberto(true);
            return;
        }
        setAbaPersistida(nova);
        window.scrollTo({ top: 0 });
    };

    const rotuloAvancado = ABAS_AVANCADAS.find((a) => a.id === aba)?.rotulo;
    const setCenario = setScenario as (c: string) => void;

    return (
        <div className="flex min-h-screen flex-col bg-fundo text-texto">
            <Navbar aba={aba} setAba={setAba} />

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
                {rotuloAvancado && <FaixaAvancado rotulo={rotuloAvancado} />}

                {aba === 'masmorras' && (
                    <MasmorrasPanel
                        scenario={scenario}
                        setScenario={setCenario}
                        abrirJob={jobParaAbrir}
                        onJobAberto={() => setJobParaAbrir(null)}
                        irParaPerfil={() => setAba('perfil')}
                    />
                )}
                {aba === 'perfil' && <PerfilTab onPronto={() => setAba('masmorras')} />}
                {aba === 'historico' && (
                    <HistoricoTab
                        onAbrir={(id) => {
                            setJobParaAbrir(id);
                            setAba('masmorras');
                        }}
                    />
                )}

                {aba === 'topgear' && <TopGearPanel scenario={scenario} setScenario={setCenario} />}
                {aba === 'droptimizer' && <DroptimizerPanel scenario={scenario} setScenario={setCenario} />}
                {aba === 'inspecionar' && (
                    <SimcInspectorTab scenario={scenario} setScenario={setScenario} currentSpec={currentSpec} />
                )}
                {aba === 'builds' && <BuildsSimulatorTab externalSpecId={currentSpec} onSpecChange={setSpecManual} />}
                {aba === 'itens' && <DatabaseExplorerTab onSelectItemForAudit={() => setAba('inspecionar')} />}
                {aba === 'runas' && <FolioRunesTab />}
                {aba === 'progressao' && <NoRaidRoadmapTab />}
                {aba === 'delves' && <DelveMasteryTab scenario={scenario as any} setScenario={setScenario as any} />}
            </main>

            <AiConsultantDrawer
                isOpen={consultorAberto}
                onClose={() => setConsultorAberto(false)}
                scenario={scenario}
                currentSpec={currentSpec}
            />

            <footer className="border-t border-borda py-4 text-center text-xs text-texto-3">
                Midnight 12.1.5 · Temporada 2 · números de DPS só do SimulationCraft
            </footer>

        </div>
    );
}

export default function App() {
    return (
        <TooltipProvider>
            <PerfilProvider>
                <Conteudo />
            </PerfilProvider>
        </TooltipProvider>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Hexagon, UserRound } from 'lucide-react';
import { classeSpecPt, usePerfil } from '../context/PerfilContext';

export type AbaPrincipal = 'masmorras' | 'perfil' | 'historico';
export type AbaAvancada =
    | 'topgear'
    | 'droptimizer'
    | 'inspecionar'
    | 'builds'
    | 'itens'
    | 'runas'
    | 'progressao'
    | 'delves'
    | 'consultor';
export type Aba = AbaPrincipal | AbaAvancada;

export const ABAS_PRINCIPAIS: { id: AbaPrincipal; rotulo: string }[] = [
    { id: 'masmorras', rotulo: 'Masmorras' },
    { id: 'perfil', rotulo: 'Perfil' },
    { id: 'historico', rotulo: 'Histórico' },
];

export const ABAS_AVANCADAS: { id: AbaAvancada; rotulo: string; grupo: string }[] = [
    { id: 'topgear', rotulo: 'Top Gear', grupo: 'Simulação' },
    { id: 'droptimizer', rotulo: 'Droptimizer', grupo: 'Simulação' },
    { id: 'inspecionar', rotulo: 'Inspecionar SimC', grupo: 'Simulação' },
    { id: 'builds', rotulo: 'Builds (antigo)', grupo: 'Simulação' },
    { id: 'itens', rotulo: 'Itens', grupo: 'Consulta' },
    { id: 'runas', rotulo: 'Runas do Fólio', grupo: 'Consulta' },
    { id: 'progressao', rotulo: 'Progressão sem raide', grupo: 'Consulta' },
    { id: 'delves', rotulo: 'Delves', grupo: 'Consulta' },
    { id: 'consultor', rotulo: 'Consultor IA', grupo: 'Consulta' },
];

interface Props {
    aba: Aba;
    setAba: (a: Aba) => void;
}

export const Navbar: React.FC<Props> = ({ aba, setAba }) => {
    const { resumo, temPerfil } = usePerfil();
    const [menu, setMenu] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const avancadaAtiva = ABAS_AVANCADAS.some((a) => a.id === aba);

    useEffect(() => {
        if (!menu) return;
        const fora = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false);
        const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
        document.addEventListener('mousedown', fora);
        document.addEventListener('keydown', esc);
        return () => {
            document.removeEventListener('mousedown', fora);
            document.removeEventListener('keydown', esc);
        };
    }, [menu]);

    const grupos = Array.from(new Set(ABAS_AVANCADAS.map((a) => a.grupo)));

    return (
        <header className="sticky top-0 z-40 border-b border-borda bg-fundo/95 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
                <div className="flex shrink-0 items-center gap-2">
                    <Hexagon className="w-5 h-5 text-destaque" />
                    <span className="text-sm font-semibold text-texto">Simulador WoW</span>
                </div>

                <nav className="flex h-full items-stretch gap-1" aria-label="Telas">
                    {ABAS_PRINCIPAIS.map((a) => {
                        const ativa = aba === a.id;
                        return (
                            <button
                                key={a.id}
                                onClick={() => setAba(a.id)}
                                aria-current={ativa ? 'page' : undefined}
                                className={`relative px-3 text-sm transition-colors ${
                                    ativa ? 'text-texto font-medium' : 'text-texto-2 hover:text-texto'
                                }`}
                            >
                                {a.rotulo}
                                {ativa && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded bg-destaque" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex-1" />

                <button
                    onClick={() => setAba('perfil')}
                    title={temPerfil ? 'Perfil importado — clique para trocar' : 'Nenhum perfil importado'}
                    className={`hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs sm:inline-flex ${
                        resumo ? 'border-borda text-texto-2 hover:text-texto' : 'border-aviso/50 text-aviso'
                    }`}
                >
                    <UserRound className="w-4 h-4" />
                    {resumo ? (
                        <span className="max-w-[16rem] truncate">
                            <span className="text-texto">{resumo.nome ?? 'Personagem'}</span>
                            {' · '}
                            {classeSpecPt(resumo.classe, resumo.spec)}
                        </span>
                    ) : (
                        'Importar perfil'
                    )}
                </button>

                <div className="relative" ref={ref}>
                    <button
                        onClick={() => setMenu((v) => !v)}
                        aria-expanded={menu}
                        aria-haspopup="menu"
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm ${
                            avancadaAtiva ? 'text-destaque' : 'text-texto-2 hover:text-texto'
                        }`}
                    >
                        Avançado
                        <ChevronDown className={`w-4 h-4 transition-transform ${menu ? 'rotate-180' : ''}`} />
                    </button>
                    {menu && (
                        <div
                            role="menu"
                            className="absolute right-0 top-10 z-50 w-60 rounded-xl border border-borda-campo bg-superficie-2 p-1.5 shadow-2xl"
                        >
                            {grupos.map((g) => (
                                <div key={g} className="py-1">
                                    <div className="px-2.5 pb-1 text-xs font-medium text-texto-3">{g}</div>
                                    {ABAS_AVANCADAS.filter((a) => a.grupo === g).map((a) => (
                                        <button
                                            key={a.id}
                                            role="menuitem"
                                            onClick={() => {
                                                setAba(a.id);
                                                setMenu(false);
                                            }}
                                            className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm ${
                                                aba === a.id ? 'bg-superficie text-destaque' : 'text-texto hover:bg-superficie'
                                            }`}
                                        >
                                            {a.rotulo}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

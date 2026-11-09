import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { carregarImportLocal, carregarImportRemoto, salvarImport } from '../services/simcStorage';
import {
    assinarAmrLocal,
    carregarAmrLocal,
    carregarAmrRemoto,
    salvarAmrLocal,
} from '../services/amrStorage';
import { CombinacaoResultado, validarCombinacao } from '../services/combinarService';
import { usePersistedState } from '../services/persistedState';

/**
 * Perfil importado UMA vez (aba Perfil) e lido por todas as telas.
 * Persistência: a mesma de antes (localStorage + /api/perfil e preferências),
 * então as telas legadas que leem o storage continuam vendo o mesmo texto.
 */
export interface PerfilEstado {
    addon: string;
    amr: string;
    primario: 'simc' | 'amr';
    resumo: CombinacaoResultado | null;
    validando: boolean;
    erro: string | null;
    temPerfil: boolean;
    setAddon: (texto: string) => void;
    setAmr: (texto: string) => void;
    setPrimario: (p: 'simc' | 'amr') => void;
    validar: () => Promise<void>;
}

const Ctx = createContext<PerfilEstado | null>(null);

const MINIMO = 20;

export const PerfilProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addon, setAddon] = useState<string>(() => carregarImportLocal() || '');
    const [amr, setAmr] = useState<string>(() => carregarAmrLocal() || '');
    const [primario, setPrimario] = usePersistedState<'simc' | 'amr'>('wowsim.perfil.primario', 'simc');
    const [resumo, setResumo] = useState<CombinacaoResultado | null>(null);
    const [validando, setValidando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const sequencia = useRef(0);

    // Hidrata do backend quando o localStorage veio vazio (porta nova do desktop).
    useEffect(() => {
        let ativo = true;
        if (!addon) carregarImportRemoto().then((t) => ativo && t && setAddon((a) => a || t));
        if (!amr) carregarAmrRemoto().then((t) => ativo && t && setAmr((a) => a || t));
        return () => {
            ativo = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Telas legadas ainda podem gravar o AMR: acompanha.
    useEffect(() => assinarAmrLocal((t) => setAmr((a) => ((t ?? '') === a ? a : t ?? ''))), []);

    useEffect(() => {
        if (addon.trim().length < MINIMO) return;
        const t = window.setTimeout(() => salvarImport(addon), 600);
        return () => window.clearTimeout(t);
    }, [addon]);

    useEffect(() => {
        if (amr.trim().length < MINIMO) return;
        const t = window.setTimeout(() => salvarAmrLocal(amr), 600);
        return () => window.clearTimeout(t);
    }, [amr]);

    useEffect(() => {
        if (primario === 'amr' && amr.trim().length < MINIMO) setPrimario('simc');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amr, primario]);

    const validar = async () => {
        const temSimc = addon.trim().length >= MINIMO;
        const temAmr = amr.trim().length >= MINIMO;
        if (!temSimc && !temAmr) {
            setResumo(null);
            setErro(null);
            return;
        }
        const minha = ++sequencia.current;
        setValidando(true);
        try {
            const r = await validarCombinacao({
                simc: temSimc ? addon : null,
                amr: temAmr ? amr : null,
                primario: temAmr ? primario : 'simc',
                incluir_inv: true,
            });
            if (minha === sequencia.current) {
                setResumo(r);
                setErro(null);
            }
        } catch (e: any) {
            if (minha === sequencia.current) {
                setResumo(null);
                setErro(e?.message || 'Não foi possível ler o perfil.');
            }
        } finally {
            if (minha === sequencia.current) setValidando(false);
        }
    };

    useEffect(() => {
        const t = window.setTimeout(() => void validar(), 800);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addon, amr, primario]);

    const valor: PerfilEstado = {
        addon,
        amr,
        primario,
        resumo,
        validando,
        erro,
        temPerfil: addon.trim().length >= MINIMO || amr.trim().length >= MINIMO,
        setAddon,
        setAmr,
        setPrimario,
        validar,
    };
    return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
};

export function usePerfil(): PerfilEstado {
    const v = useContext(Ctx);
    if (!v) throw new Error('usePerfil fora do PerfilProvider');
    return v;
}

const CLASSES: Record<string, string> = {
    warlock: 'Bruxo', druid: 'Druida', priest: 'Sacerdote', mage: 'Mago', shaman: 'Xamã',
    evoker: 'Conjurante', paladin: 'Paladino', warrior: 'Guerreiro', hunter: 'Caçador',
    rogue: 'Ladino', monk: 'Monge', death_knight: 'Cavaleiro da Morte', demon_hunter: 'Caçador de Demônios',
};
const SPECS: Record<string, string> = {
    demonology: 'Demonologia', affliction: 'Suplício', destruction: 'Destruição', balance: 'Equilíbrio',
    shadow: 'Sombra', arcane: 'Arcano', fire: 'Fogo', frost: 'Gélido', elemental: 'Elemental',
    devastation: 'Devastação', augmentation: 'Aprimoramento',
};

/** "Bruxo Demonologia" a partir de warlock/demonology (cai no texto cru se não conhecer). */
export function classeSpecPt(classe?: string | null, spec?: string | null): string {
    const c = classe ? CLASSES[classe] ?? classe : '';
    const s = spec ? SPECS[spec] ?? spec : '';
    return [c, s].filter(Boolean).join(' ');
}

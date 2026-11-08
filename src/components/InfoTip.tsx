import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

interface Props {
    titulo: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * Ícone "i" circulado que mostra uma explicação detalhada ao passar o mouse,
 * focar ou clicar. Fecha ao sair, ao clicar fora ou com Esc.
 */
export const InfoTip: React.FC<Props> = ({ titulo, children, className }) => {
    const [aberto, setAberto] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!aberto) return;
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAberto(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onEsc);
        };
    }, [aberto]);

    return (
        <span
            ref={ref}
            className={`relative inline-flex items-center ${className ?? ''}`}
            onMouseEnter={() => setAberto(true)}
            onMouseLeave={() => setAberto(false)}
        >
            <button
                type="button"
                aria-label={`Informação: ${titulo}`}
                aria-expanded={aberto}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAberto((v) => !v);
                }}
                onFocus={() => setAberto(true)}
                className="ml-0.5 inline-flex items-center justify-center rounded-full border border-zinc-600 text-zinc-500 hover:border-sky-400 hover:text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                style={{ width: 14, height: 14 }}
            >
                <Info className="w-3 h-3" />
            </button>
            {aberto && (
                <span
                    role="tooltip"
                    className="absolute left-0 top-5 z-50 w-72 rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-[11px] leading-snug text-zinc-300 shadow-2xl"
                >
                    <span className="mb-1 block text-xs font-semibold text-zinc-100">{titulo}</span>
                    {children}
                </span>
            )}
        </span>
    );
};

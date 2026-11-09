import React from 'react';
import { InfoTip } from '../components/InfoTip';

interface CampoProps {
    rotulo: string;
    dica?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

/** Rótulo de 12 px acima do controle; a explicação longa vai para o ⓘ. */
export const Campo: React.FC<CampoProps> = ({ rotulo, dica, className = '', children }) => (
    <label className={`flex flex-col gap-1 ${className}`}>
        <span className="flex items-center gap-1 text-xs font-medium text-texto-2">
            {rotulo}
            {dica && <InfoTip titulo={rotulo}>{dica}</InfoTip>}
        </span>
        {children}
    </label>
);

const CONTROLE =
    'h-9 rounded-lg border border-borda-campo bg-superficie-2 px-2.5 text-sm text-texto ' +
    'focus:outline-none focus:border-destaque disabled:opacity-50';

export const Selecao: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', ...p }) => (
    <select className={`${CONTROLE} ${className}`} {...p} />
);

export const Numero: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...p }) => (
    <input type="number" className={`${CONTROLE} num ${className}`} {...p} />
);

export const AreaTexto: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
    className = '',
    ...p
}) => (
    <textarea
        spellCheck={false}
        className={`w-full rounded-lg border border-borda-campo bg-superficie-2 p-3 font-mono text-xs text-texto placeholder:text-texto-3 focus:outline-none focus:border-destaque ${className}`}
        {...p}
    />
);

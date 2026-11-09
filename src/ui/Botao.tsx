import React from 'react';
import { Loader2 } from 'lucide-react';

type Variante = 'principal' | 'secundario' | 'discreto' | 'perigo';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: Variante;
    carregando?: boolean;
    icone?: React.ReactNode;
    tamanho?: 'md' | 'sm';
}

const ESTILOS: Record<Variante, string> = {
    principal: 'bg-destaque text-sobre-destaque font-semibold hover:bg-destaque-hover',
    secundario: 'border border-borda-campo text-texto hover:bg-superficie-2',
    discreto: 'text-texto-2 hover:text-texto hover:bg-superficie-2',
    perigo: 'border border-perda/60 text-perda hover:bg-perda/10',
};

/** Botão do sistema. Uma tela tem no máximo UM ``principal`` (dourado). */
export const Botao: React.FC<Props> = ({
    variante = 'secundario',
    carregando = false,
    icone,
    tamanho = 'md',
    className = '',
    disabled,
    children,
    ...resto
}) => (
    <button
        type="button"
        disabled={disabled || carregando}
        className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            tamanho === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm'
        } ${ESTILOS[variante]} ${className}`}
        {...resto}
    >
        {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : icone}
        {children}
    </button>
);

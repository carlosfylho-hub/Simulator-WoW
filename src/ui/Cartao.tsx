import React from 'react';

interface Props {
    titulo?: React.ReactNode;
    /** Nó à direita do título (ex.: botões de ordenação). */
    acao?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

export const Cartao: React.FC<Props> = ({ titulo, acao, className = '', children }) => (
    <section className={`rounded-xl border border-borda bg-superficie p-4 ${className}`}>
        {(titulo || acao) && (
            <header className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                {titulo && <h2 className="text-[15px] font-semibold text-texto">{titulo}</h2>}
                {acao}
            </header>
        )}
        {children}
    </section>
);

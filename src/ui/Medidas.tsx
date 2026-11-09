import React from 'react';

/** "+1,82%" em pt-BR, ou "—" quando não há número. */
export const formatarPct = (valor: number | null | undefined): string =>
    valor == null
        ? '—'
        : `${valor > 0 ? '+' : ''}${valor.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })}%`;

export const formatarDps = (valor: number | null | undefined): string =>
    valor == null ? '—' : Math.round(valor).toLocaleString('pt-BR');

interface DeltaProps {
    valor: number | null | undefined;
    /** Abaixo disso (em módulo) é empate: fica cinza. */
    limiar?: number | null;
    className?: string;
}

/** Percentual medido com cor semântica: verde ganho, vermelho perda, cinza empate. */
export const Delta: React.FC<DeltaProps> = ({ valor, limiar, className = '' }) => {
    const l = limiar ?? 0;
    const cor =
        valor == null ? 'text-texto-3' : valor > l ? 'text-ganho' : valor < -l ? 'text-perda' : 'text-texto-3';
    return (
        <span
            className={`num ${cor} ${className}`}
            title={limiar != null ? `Empate abaixo de ${formatarPct(limiar).replace('+', '')}` : undefined}
        >
            {formatarPct(valor)}
        </span>
    );
};

export type TipoEtiqueta = 'direto' | 'catalisar' | 'ambos' | 'nao_serve';

const ETIQUETAS: Record<TipoEtiqueta, { rotulo: string; classe: string }> = {
    direto: { rotulo: 'upgrade direto', classe: 'border-ganho/50 text-ganho' },
    catalisar: { rotulo: 'para catalisar', classe: 'border-aviso/50 text-aviso' },
    ambos: { rotulo: 'direto · melhor catalisado', classe: 'border-ganho/50 text-ganho' },
    nao_serve: { rotulo: 'não serve', classe: 'border-borda text-texto-3' },
};

export const Etiqueta: React.FC<{ tipo: TipoEtiqueta }> = ({ tipo }) => (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${ETIQUETAS[tipo].classe}`}>
        {ETIQUETAS[tipo].rotulo}
    </span>
);

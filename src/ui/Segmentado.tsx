import React from 'react';

interface Opcao<T extends string> {
    valor: T;
    rotulo: string;
}

interface Props<T extends string> {
    opcoes: Opcao<T>[];
    valor: T;
    onChange: (v: T) => void;
    rotuloAria?: string;
}

/** Botões mutuamente exclusivos (ex.: Masmorras M+ | Grande Cofre). */
export function Segmentado<T extends string>({ opcoes, valor, onChange, rotuloAria }: Props<T>) {
    return (
        <div role="radiogroup" aria-label={rotuloAria} className="inline-flex rounded-lg border border-borda-campo p-0.5">
            {opcoes.map((o) => {
                const ativo = o.valor === valor;
                return (
                    <button
                        key={o.valor}
                        type="button"
                        role="radio"
                        aria-checked={ativo}
                        onClick={() => onChange(o.valor)}
                        className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${
                            ativo ? 'bg-destaque text-sobre-destaque' : 'text-texto-2 hover:text-texto'
                        }`}
                    >
                        {o.rotulo}
                    </button>
                );
            })}
        </div>
    );
}

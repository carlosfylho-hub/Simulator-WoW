import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
    titulo: React.ReactNode;
    /** Texto curto à direita do título quando fechado (ex.: "2 marcadas"). */
    resumo?: React.ReactNode;
    abertoInicial?: boolean;
    children: React.ReactNode;
}

export const Recolhivel: React.FC<Props> = ({ titulo, resumo, abertoInicial = false, children }) => {
    const [aberto, setAberto] = useState(abertoInicial);
    return (
        <div>
            <button
                type="button"
                aria-expanded={aberto}
                onClick={() => setAberto((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-texto-2 hover:text-texto"
            >
                <ChevronRight className={`w-4 h-4 transition-transform ${aberto ? 'rotate-90' : ''}`} />
                <span className="font-medium">{titulo}</span>
                {!aberto && resumo && <span className="text-xs text-texto-3">· {resumo}</span>}
            </button>
            {aberto && <div className="mt-3">{children}</div>}
        </div>
    );
};

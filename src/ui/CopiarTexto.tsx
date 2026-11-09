import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Texto pronto para colar no jogo. Copia com a API do navegador; no WebView sem
 * contexto seguro, mostra o texto selecionado para Ctrl+C.
 */
export const CopiarTexto: React.FC<{ texto: string; rotulo?: string }> = ({ texto, rotulo = 'Copiar' }) => {
    const [copiado, setCopiado] = useState(false);
    const [selecionar, setSelecionar] = useState(false);
    const copiar = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(texto);
                setCopiado(true);
                window.setTimeout(() => setCopiado(false), 1500);
                return;
            }
        } catch {
            /* cai no fallback */
        }
        setSelecionar(true);
    };
    return (
        <div className="space-y-1.5">
            <div className="flex items-start gap-2">
                <code className="block max-h-24 flex-1 overflow-auto break-all rounded-lg border border-borda bg-superficie-2 px-2.5 py-2 font-mono text-xs text-texto-2">
                    {texto}
                </code>
                <button
                    type="button"
                    onClick={copiar}
                    title="Copiar para a área de transferência"
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-borda-campo px-3 text-xs text-texto hover:bg-superficie-2"
                >
                    {copiado ? <Check className="w-4 h-4 text-ganho" /> : <Copy className="w-4 h-4" />}
                    {copiado ? 'Copiado' : rotulo}
                </button>
            </div>
            {selecionar && (
                <textarea
                    readOnly
                    autoFocus
                    value={texto}
                    onFocus={(e) => e.currentTarget.select()}
                    className="h-16 w-full rounded-lg border border-aviso/60 bg-superficie-2 p-2 font-mono text-xs text-texto"
                    title="Texto selecionado: use Ctrl+C"
                />
            )}
        </div>
    );
};

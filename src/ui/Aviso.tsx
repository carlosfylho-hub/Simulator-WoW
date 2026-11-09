import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type Tom = 'erro' | 'aviso' | 'info';

const TONS: Record<Tom, { classe: string; Icone: typeof Info }> = {
    erro: { classe: 'border-perda/50 bg-perda/10 text-perda', Icone: AlertCircle },
    aviso: { classe: 'border-aviso/40 bg-aviso/10 text-aviso', Icone: AlertTriangle },
    info: { classe: 'border-borda bg-superficie-2 text-texto-2', Icone: Info },
};

export const Aviso: React.FC<{ tom?: Tom; acao?: React.ReactNode; children: React.ReactNode }> = ({
    tom = 'info',
    acao,
    children,
}) => {
    const { classe, Icone } = TONS[tom];
    return (
        <div role={tom === 'erro' ? 'alert' : undefined} className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${classe}`}>
            <Icone className="mt-0.5 w-4 h-4 shrink-0" />
            <div className="flex-1">{children}</div>
            {acao}
        </div>
    );
};

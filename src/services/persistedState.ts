import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { agendarSalvarPreferencia, obterTodasPreferencias } from './preferences';

/**
 * useState com persistência em dois níveis:
 * - localStorage (rápido, funciona offline);
 * - backend /api/preferencias (sobrevive ao port aleatório do desktop).
 *
 * A hidratação do backend NÃO sobrescreve um valor que o usuário já editou.
 * As gravações no backend são agrupadas num único PUT (ver preferences.ts).
 */
export function usePersistedState<T>(
    chave: string,
    inicial: T
): [T, Dispatch<SetStateAction<T>>] {
    const [valor, setValorInterno] = useState<T>(() => {
        try {
            const bruto = localStorage.getItem(chave);
            if (bruto != null) return JSON.parse(bruto) as T;
        } catch {
            /* localStorage indisponível ou JSON inválido */
        }
        return inicial;
    });
    const [hidratado, setHidratado] = useState(false);
    const editadoRef = useRef(false);

    const setValor: Dispatch<SetStateAction<T>> = (acao) => {
        editadoRef.current = true;
        setValorInterno(acao);
    };

    useEffect(() => {
        let vivo = true;
        obterTodasPreferencias().then((mapa) => {
            if (!vivo) return;
            const bruto = mapa[chave];
            if (bruto != null && !editadoRef.current) {
                try {
                    setValorInterno(JSON.parse(bruto) as T);
                } catch {
                    /* valor antigo inválido: mantém o atual */
                }
            }
            setHidratado(true);
        });
        return () => {
            vivo = false;
        };
    }, [chave]);

    useEffect(() => {
        if (!hidratado) return;
        const serializado = JSON.stringify(valor);
        try {
            localStorage.setItem(chave, serializado);
        } catch {
            /* ignora quota/modo privado */
        }
        agendarSalvarPreferencia(chave, serializado);
    }, [chave, valor, hidratado]);

    return [valor, setValor];
}

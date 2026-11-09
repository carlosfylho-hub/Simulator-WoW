import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { RankingResult, gerarStringAmr } from '../../services/masmorrasService';
import { AreaTexto, Aviso, Botao, Cartao, CopiarTexto, Recolhivel, Segmentado } from '../../ui';

const AVISO_PAWN =
    'O Pawn soma atributos e não enxerga bônus de tier, procs nem efeitos de berloque. Use como primeira indicação.';
const AVISO_BIB =
    'Importar com várias linhas apaga os Best in Bags importados antes, inclusive os do site do AMR.';

/** Strings para colar no jogo: escala do Pawn e importação do AMR (Best in Bags). */
export const LevarParaOJogo: React.FC<{ resultado: RankingResult }> = ({ resultado }) => {
    const builds = resultado.builds ?? [];
    const escalas: { valor: string; rotulo: string; texto: string }[] = [
        ...builds.filter((b) => b.pawn).map((b) => ({ valor: b.nome, rotulo: b.nome, texto: b.pawn as string })),
        ...(resultado.pawn_mistura ? [{ valor: '__mistura', rotulo: 'Mistura', texto: resultado.pawn_mistura }] : []),
        ...(resultado.pawn_atual ? [{ valor: '__atual', rotulo: 'Build atual', texto: resultado.pawn_atual }] : []),
    ];
    const [escala, setEscala] = useState(escalas[0]?.valor ?? '');
    const [modelo, setModelo] = useState('');
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [gerando, setGerando] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    if (escalas.length === 0 && builds.length === 0) return null;
    const atual = escalas.find((e) => e.valor === escala) ?? escalas[0];

    const gerar = async (nome: string, itens: Record<string, unknown>[]) => {
        setErro(null);
        setGerando(nome);
        try {
            const r = await gerarStringAmr({ modelo, build: nome, itens });
            setStrings((s) => ({ ...s, [nome]: r.string }));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao gerar a string.');
        } finally {
            setGerando(null);
        }
    };

    return (
        <Cartao titulo="Levar para o jogo">
            <div className="space-y-5">
                {escalas.length > 0 && atual && (
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-texto">Escala do Pawn</span>
                            {escalas.length > 1 && (
                                <Segmentado
                                    rotuloAria="Escala"
                                    opcoes={escalas.map((e) => ({ valor: e.valor, rotulo: e.rotulo }))}
                                    valor={atual.valor}
                                    onChange={setEscala}
                                />
                            )}
                        </div>
                        <CopiarTexto texto={atual.texto} />
                        {resultado.pawn_iguais.map(([a, b]) => (
                            <p key={`${a}-${b}`} className="text-xs text-aviso">
                                “{a}” e “{b}” têm a mesma escala dentro da margem de erro: use uma só.
                            </p>
                        ))}
                        <p className="text-xs text-texto-3">{AVISO_PAWN}</p>
                    </div>
                )}

                {builds.length > 0 && (
                    <div className="space-y-2 border-t border-borda pt-4">
                        <Recolhivel titulo="String do AMR (Best in Bags)" resumo="usa a sua última string do AMR como modelo">
                            <div className="space-y-3">
                                <AreaTexto
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    placeholder="Cole a string de Best in Bags que o AMR gerou (_bib_ $181;US;…)"
                                    className="h-20"
                                />
                                {erro && <Aviso tom="erro">{erro}</Aviso>}
                                {builds.map((b) => (
                                    <div key={b.nome} className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm text-texto">{b.nome}</span>
                                            <Botao
                                                tamanho="sm"
                                                icone={<Wand2 className="w-4 h-4" />}
                                                carregando={gerando === b.nome}
                                                disabled={modelo.trim().length < 20 || b.conjunto_itens.length === 0}
                                                onClick={() => gerar(b.nome, b.conjunto_itens)}
                                            >
                                                Gerar
                                            </Botao>
                                        </div>
                                        {strings[b.nome] && <CopiarTexto texto={strings[b.nome]} />}
                                    </div>
                                ))}
                                <p className="text-xs text-texto-3">{AVISO_BIB}</p>
                            </div>
                        </Recolhivel>
                    </div>
                )}
            </div>
        </Cartao>
    );
};

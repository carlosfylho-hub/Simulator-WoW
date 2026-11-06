import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Sparkles, Terminal } from 'lucide-react';
import { ParsedSimcProfile, ActiveSpec } from '../types/wow';
import { serializeSimcProfile } from '../engine/simcExporter';
import { SPEC_PROFILES } from '../data/specs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ParsedSimcProfile;
  activeSpec?: ActiveSpec;
}

export const SimcExportModal: React.FC<Props> = ({ isOpen, onClose, profile, activeSpec }) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const simcText = serializeSimcProfile(profile, activeSpec);
  const lines = simcText.split('\n');

  // Spec details
  let specKey: ActiveSpec = activeSpec || 'demonology';
  const specLower = (profile.spec || '').toLowerCase();
  if (specLower.includes('afflic') || specLower.includes('suplí') || specLower.includes('supli')) specKey = 'affliction';
  else if (specLower.includes('destro')) specKey = 'destruction';
  else if (specLower.includes('demo')) specKey = 'demonology';
  else if (specLower.includes('balan') || specLower.includes('equil')) specKey = 'balance';
  else if (specLower.includes('shad') || specLower.includes('somb')) specKey = 'shadow';

  const specProfile = SPEC_PROFILES[specKey];

  const SPEC_COLORS: Record<ActiveSpec, string> = {
    demonology: '#a855f7',
    affliction: '#22c55e',
    destruction: '#f97316',
    balance: '#06b6d4',
    shadow: '#ec4899'
  };
  const specColor = SPEC_COLORS[specKey];

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(simcText);
      } else {
        // Fallback for sandboxed iframes or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = simcText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([simcText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${profile.characterName || 'simc_profile'}_${specKey}_12.1.5.simc`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to download .simc file:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
              style={{ backgroundColor: `${specColor}20`, borderColor: `${specColor}40` }}
            >
              <Terminal className="w-5 h-5" style={{ color: specColor }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Exportar Perfil SimulationCraft (`/simc`)
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    color: specColor,
                    backgroundColor: `${specColor}15`,
                    borderColor: `${specColor}40`
                  }}
                >
                  {specProfile?.namePt || specKey}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pronto para colar diretamente no <strong className="text-zinc-200">Raidbots</strong> (Top Gear / Droptimizer) ou no simulador desktop.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Toolbar */}
        <div className="px-5 py-2.5 bg-zinc-950/40 border-b border-zinc-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center space-x-3">
            <span>Personagem: <strong className="text-zinc-200">{profile.characterName}</strong></span>
            <span>·</span>
            <span>Slots Equipados: <strong className="text-zinc-200">{Object.keys(profile.equipped).length}/16</strong></span>
            <span>·</span>
            <span>Linhas: <strong className="text-zinc-200">{lines.length}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-lg transition flex items-center space-x-1.5 text-xs"
              title="Baixar arquivo de texto .simc"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Baixar .simc</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-950 font-mono text-xs select-all text-zinc-300 leading-relaxed custom-scrollbar">
          <div className="grid grid-cols-[3rem_1fr] gap-3">
            {/* Line numbers */}
            <div className="text-right text-zinc-600 select-none space-y-0.5">
              {lines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Content with subtle syntax highlights */}
            <div className="space-y-0.5 overflow-x-auto">
              {lines.map((line, idx) => {
                if (line.startsWith('#')) {
                  return <div key={idx} className="text-zinc-500 italic">{line}</div>;
                }
                if (line.startsWith('talents=')) {
                  return (
                    <div key={idx} className="text-purple-300 truncate" title={line}>
                      <span className="text-purple-400 font-bold">talents=</span>
                      <span className="text-purple-200/90">{line.replace('talents=', '')}</span>
                    </div>
                  );
                }
                if (line.includes('=')) {
                  const [key, ...rest] = line.split('=');
                  const val = rest.join('=');
                  const isGear = ['head', 'neck', 'shoulders', 'back', 'chest', 'wrists', 'hands', 'waist', 'legs', 'feet', 'finger1', 'finger2', 'trinket1', 'trinket2', 'main_hand', 'off_hand'].includes(key);

                  return (
                    <div key={idx}>
                      <span className={isGear ? 'text-cyan-400 font-bold' : 'text-amber-400 font-semibold'}>{key}</span>
                      <span className="text-zinc-500">=</span>
                      <span className="text-zinc-300">{val}</span>
                    </div>
                  );
                }
                return <div key={idx} className="text-zinc-400">{line}</div>;
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-500 text-center sm:text-left">
            Totalmente compatível com o SimulationCraft 12.1.5 e motor Raidbots.
          </p>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
            >
              Fechar
            </button>

            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-initial px-5 py-2 font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2 ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-950/40'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar para Área de Transferência</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

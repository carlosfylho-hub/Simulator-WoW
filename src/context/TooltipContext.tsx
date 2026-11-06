import React, { createContext, useContext, useState, useCallback } from 'react';
import { FullItemTooltip, getItemTooltipSync } from '../services/itemTooltipService';
import { WowItemTooltip } from '../components/WowItemTooltip';

interface TooltipContextValue {
  showTooltip: (
    itemId: number,
    e: React.MouseEvent,
    fallbackOptions?: Parameters<typeof getItemTooltipSync>[1]
  ) => void;
  updateTooltipPosition: (e: React.MouseEvent) => void;
  hideTooltip: () => void;
  pinTooltip: (
    itemId: number,
    fallbackOptions?: Parameters<typeof getItemTooltipSync>[1]
  ) => void;
  closePinned: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTooltip, setActiveTooltip] = useState<FullItemTooltip | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<FullItemTooltip | null>(null);

  const showTooltip = useCallback(
    (
      itemId: number,
      e: React.MouseEvent,
      fallbackOptions?: Parameters<typeof getItemTooltipSync>[1]
    ) => {
      setPosition({ x: e.clientX, y: e.clientY });
      try {
        const data = getItemTooltipSync(itemId, fallbackOptions);
        setActiveTooltip(data);
      } catch (err) {
        console.warn('Erro ao carregar tooltip:', err);
      }
    },
    []
  );

  const updateTooltipPosition = useCallback((e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const hideTooltip = useCallback(() => {
    setActiveTooltip(null);
    setPosition(null);
  }, []);

  const pinTooltip = useCallback(
    (
      itemId: number,
      fallbackOptions?: Parameters<typeof getItemTooltipSync>[1]
    ) => {
      try {
        const data = getItemTooltipSync(itemId, fallbackOptions);
        setPinnedTooltip(data);
      } catch (err) {
        console.warn('Erro ao fixar tooltip:', err);
      }
    },
    []
  );

  const closePinned = useCallback(() => {
    setPinnedTooltip(null);
  }, []);

  return (
    <TooltipContext.Provider
      value={{
        showTooltip,
        updateTooltipPosition,
        hideTooltip,
        pinTooltip,
        closePinned
      }}
    >
      {children}
      <WowItemTooltip
        tooltipData={activeTooltip}
        position={position}
        pinnedItem={pinnedTooltip}
        onClosePinned={closePinned}
      />
    </TooltipContext.Provider>
  );
};

export function useItemTooltip(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    // Graceful fallback dummy if ever used outside provider
    return {
      showTooltip: () => {},
      updateTooltipPosition: () => {},
      hideTooltip: () => {},
      pinTooltip: () => {},
      closePinned: () => {}
    };
  }
  return ctx;
}

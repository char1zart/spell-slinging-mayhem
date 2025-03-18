
import React, { useRef } from 'react';
import { Player } from '@/lib/gameData';
import { animateSpellCast } from '@/lib/animations';

interface BattleAreaProps {
  players: Player[];
  currentPlayerIndex: number;
  targetPlayerIndex: number | null;
  onSelectTarget: (index: number) => void;
  animateAttack: boolean;
  onAnimationComplete: () => void;
  attackingSpellType?: 'source' | 'quality' | 'delivery';
}

const BattleArea: React.FC<BattleAreaProps> = ({
  players,
  currentPlayerIndex,
  targetPlayerIndex,
  onSelectTarget,
  animateAttack,
  onAnimationComplete,
  attackingSpellType = 'source'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const attackerRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Handle animation when animateAttack changes
  React.useEffect(() => {
    if (animateAttack && targetPlayerIndex !== null && attackerRef.current && targetRefs.current[targetPlayerIndex]) {
      animateSpellCast(
        attackerRef.current,
        targetRefs.current[targetPlayerIndex],
        attackingSpellType,
        containerRef.current,
        onAnimationComplete
      );
    }
  }, [animateAttack, targetPlayerIndex, attackingSpellType, onAnimationComplete]);
  
  return (
    <div ref={containerRef} className="relative w-full mb-8">
      <div className="flex flex-wrap justify-center gap-4 py-6">
        {players.map((player, index) => {
          const isCurrentPlayer = index === currentPlayerIndex;
          const isTargetPlayer = index === targetPlayerIndex;
          const canBeTarget = !isCurrentPlayer;
          
          return (
            <div 
              key={player.id}
              ref={isCurrentPlayer ? attackerRef : (el) => { targetRefs.current[index] = el; }}
              className={`glass-panel p-4 w-64 relative overflow-hidden transition-all duration-300
                         ${isCurrentPlayer ? 'ring-2 ring-wizard-primary animate-pulse-glow' : ''}
                         ${isTargetPlayer ? 'ring-2 ring-wizard-accent' : ''}
                         ${canBeTarget && !isTargetPlayer ? 'cursor-pointer hover:scale-105' : ''}`}
              onClick={() => canBeTarget && onSelectTarget(index)}
            >
              {/* Active player indicator */}
              {isCurrentPlayer && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-wizard-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    Current Player
                  </div>
                </div>
              )}
              
              {/* Target indicator */}
              {isTargetPlayer && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-wizard-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    Target
                  </div>
                </div>
              )}
              
              {/* Wizard avatar */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-wizard-primary">
                <img 
                  src={player.wizard.imageUrl} 
                  alt={player.wizard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Wizard name */}
              <h3 className="text-lg font-bold text-white mb-2">{player.wizard.name}</h3>
              
              {/* Health bar */}
              <div className="mb-4">
                <div className="flex justify-between text-white text-xs mb-1">
                  <span>Health</span>
                  <span>{player.wizard.health}/{player.wizard.maxHealth}</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 ease-out"
                    style={{ width: `${(player.wizard.health / player.wizard.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Cards in hand count */}
              <div className="text-xs text-wizard-light">
                <span>Cards in hand: {player.hand.length}</span>
              </div>
              
              {/* Target button (for non-current players) */}
              {canBeTarget && !isTargetPlayer && (
                <button 
                  className="mt-3 w-full py-1.5 bg-wizard-accent text-white rounded-lg text-sm font-medium
                            transform transition-transform hover:scale-105"
                  onClick={() => onSelectTarget(index)}
                >
                  Target
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BattleArea;

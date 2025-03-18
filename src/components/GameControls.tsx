
import React from 'react';

interface GameControlsProps {
  gamePhase: 'select-wizard' | 'draw' | 'craft' | 'battle' | 'aftermath' | 'game-over';
  onStartNewGame: () => void;
  onEndTurn: () => void;
  canEndTurn: boolean;
  round: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  gamePhase,
  onStartNewGame,
  onEndTurn,
  canEndTurn,
  round
}) => {
  const getPhaseText = () => {
    switch (gamePhase) {
      case 'select-wizard':
        return 'Select Your Wizard';
      case 'draw':
        return 'Draw Phase';
      case 'craft':
        return 'Craft Your Spell';
      case 'battle':
        return 'Battle Phase';
      case 'aftermath':
        return 'Aftermath';
      case 'game-over':
        return 'Game Over';
      default:
        return '';
    }
  };
  
  return (
    <div className="glass-panel p-4 flex justify-between items-center">
      {/* Game phase indicator */}
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-wizard-accent animate-pulse mr-2"></div>
        <span className="text-white font-bold">{getPhaseText()}</span>
      </div>
      
      {/* Round counter */}
      <div className="px-4 py-1 rounded-full bg-wizard-dark">
        <span className="text-wizard-light text-sm">Round: </span>
        <span className="text-white font-bold">{round}</span>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3">
        {gamePhase === 'game-over' ? (
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                     text-white font-medium transform transition-transform hover:scale-105"
            onClick={onStartNewGame}
          >
            New Game
          </button>
        ) : (
          canEndTurn && (
            <button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                       text-white font-medium transform transition-transform hover:scale-105"
              onClick={onEndTurn}
            >
              End Turn
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default GameControls;

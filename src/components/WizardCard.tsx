
import React, { useRef, useEffect } from 'react';
import { Wizard } from '@/lib/gameData';
import { animateCardEntrance, cardHoverEffect } from '@/lib/animations';

interface WizardCardProps {
  wizard: Wizard;
  isSelected?: boolean;
  onSelect?: () => void;
  animationDelay?: number;
}

const WizardCard: React.FC<WizardCardProps> = ({ 
  wizard, 
  isSelected = false, 
  onSelect,
  animationDelay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateCardEntrance(cardRef.current, animationDelay);
  }, [animationDelay]);

  const handleMouseEnter = () => {
    cardHoverEffect(cardRef.current, true);
  };

  const handleMouseLeave = () => {
    cardHoverEffect(cardRef.current, false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative group card-container w-56 h-80 m-2 rounded-xl cursor-pointer
                 transition-all duration-300 ${isSelected ? 'ring-4 ring-wizard-primary' : ''}`}
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`overflow-hidden h-full bg-wizard-dark rounded-xl shadow-card
                      ${isSelected ? 'animate-pulse-glow' : ''}`}>
        {/* Card Header */}
        <div className="h-12 flex items-center justify-center bg-gradient-to-r from-wizard-primary to-wizard-secondary">
          <h3 className="text-white font-bold pixelated-text tracking-wider">{wizard.name}</h3>
        </div>
        
        {/* Card Image */}
        <div className="h-40 overflow-hidden">
          <img 
            src={wizard.imageUrl} 
            alt={wizard.name} 
            className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
          />
        </div>
        
        {/* Health Bar */}
        <div className="px-3 py-2">
          <div className="flex justify-between items-center text-white text-xs mb-1">
            <span>Health</span>
            <span>{wizard.health}/{wizard.maxHealth}</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 ease-out"
              style={{ width: `${(wizard.health / wizard.maxHealth) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Description */}
        <div className="p-3 text-wizard-light text-sm">
          <p className="line-clamp-3">{wizard.description}</p>
        </div>
        
        {/* Select Button (visible on hover) */}
        <div className="absolute inset-x-0 bottom-0 h-16 flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="magical-border px-6 py-2 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                       text-white font-medium transform transition-transform hover:scale-105"
            onClick={onSelect}
          >
            Select Wizard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardCard;

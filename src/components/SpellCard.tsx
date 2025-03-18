
import React, { useRef, useEffect } from 'react';
import { SpellCard as SpellCardType } from '@/lib/gameData';
import { animateCardEntrance, cardHoverEffect, createMagicSpark } from '@/lib/animations';

interface SpellCardProps {
  card: SpellCardType;
  isSelected?: boolean;
  onSelect?: () => void;
  animationDelay?: number;
  disabled?: boolean;
}

const SpellCard: React.FC<SpellCardProps> = ({ 
  card, 
  isSelected = false, 
  onSelect,
  animationDelay = 0,
  disabled = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sparkContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateCardEntrance(cardRef.current, animationDelay);
  }, [animationDelay]);

  const handleMouseEnter = () => {
    if (!disabled) {
      cardHoverEffect(cardRef.current, true);
      
      // Add magic spark effect when hovering
      if (sparkContainerRef.current) {
        const rect = sparkContainerRef.current.getBoundingClientRect();
        createMagicSpark(
          rect.width / 2,
          rect.height / 2,
          sparkContainerRef.current
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      cardHoverEffect(cardRef.current, false);
    }
  };

  const getCardClassName = () => {
    switch (card.type) {
      case 'source':
        return 'spell-source';
      case 'quality':
        return 'spell-quality';
      case 'delivery':
        return 'spell-delivery';
      default:
        return '';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative w-40 h-60 m-2 rounded-xl cursor-pointer overflow-hidden
                transition-all duration-300 
                ${isSelected ? 'ring-4 ring-wizard-primary transform scale-105 rotate-3' : ''}
                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`overflow-hidden h-full bg-wizard-dark rounded-xl shadow-card
                   transition-all duration-300`}
      >
        {/* Card Header */}
        <div className={`h-10 flex items-center justify-center ${getCardClassName()}`}>
          <h3 className="text-white font-bold pixelated-text tracking-wider text-sm">{card.name}</h3>
        </div>
        
        {/* Card Type and Power */}
        <div className="flex justify-between items-center px-3 py-1 bg-wizard-dark bg-opacity-80">
          <span className="text-wizard-light text-xs capitalize">{card.type}</span>
          <span className="text-wizard-accent font-bold text-sm">{card.power} Power</span>
        </div>
        
        {/* Card Image */}
        <div className="h-24 overflow-hidden relative">
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="w-full h-full object-cover transform transition-transform hover:scale-110"
          />
          <div 
            ref={sparkContainerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          ></div>
        </div>
        
        {/* Description */}
        <div className="p-2 bg-wizard-dark bg-opacity-95 h-16">
          <p className="text-wizard-light text-xs line-clamp-3">{card.description}</p>
        </div>
        
        {/* Effect */}
        {card.effect && (
          <div className="p-2 bg-gradient-to-r from-wizard-primary to-wizard-secondary bg-opacity-90">
            <p className="text-white text-xs line-clamp-2 italic">{card.effect}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellCard;

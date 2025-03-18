
import React, { useRef } from 'react';
import { CardType, SpellCard as SpellCardType } from '@/lib/gameData';
import SpellCard from './SpellCard';
import { createMagicSpark } from '@/lib/animations';

interface SpellCraftingAreaProps {
  selectedCards: {
    source?: SpellCardType;
    quality?: SpellCardType;
    delivery?: SpellCardType;
  };
  onRemoveCard: (type: CardType) => void;
  spellPower: number;
  onCastSpell: () => void;
  canCast: boolean;
}

const SpellCraftingArea: React.FC<SpellCraftingAreaProps> = ({
  selectedCards,
  onRemoveCard,
  spellPower,
  onCastSpell,
  canCast
}) => {
  const areaRef = useRef<HTMLDivElement>(null);
  
  const handleCastClick = () => {
    if (canCast && areaRef.current) {
      const rect = areaRef.current.getBoundingClientRect();
      createMagicSpark(rect.width / 2, rect.height / 2, areaRef.current);
      onCastSpell();
    }
  };

  const isSpellComplete = selectedCards.source && selectedCards.quality && selectedCards.delivery;
  
  return (
    <div ref={areaRef} className="glass-panel p-6 relative overflow-hidden min-h-[300px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wizard-primary via-wizard-secondary to-wizard-accent"></div>
      
      <h2 className="text-xl font-bold text-white mb-4 pixelated-text">Spell Crafting</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="w-40 h-60 m-2 border-2 border-dashed border-spell-source rounded-xl flex flex-col items-center justify-center">
          {selectedCards.source ? (
            <SpellCard 
              card={selectedCards.source} 
              isSelected={true}
              onSelect={() => onRemoveCard('source')}
            />
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-spell-source bg-opacity-20 mx-auto flex items-center justify-center mb-2">
                <span className="text-spell-source text-2xl">+</span>
              </div>
              <p className="text-spell-source text-sm">Source</p>
            </div>
          )}
        </div>
        
        <div className="w-40 h-60 m-2 border-2 border-dashed border-spell-quality rounded-xl flex flex-col items-center justify-center">
          {selectedCards.quality ? (
            <SpellCard 
              card={selectedCards.quality} 
              isSelected={true}
              onSelect={() => onRemoveCard('quality')}
            />
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-spell-quality bg-opacity-20 mx-auto flex items-center justify-center mb-2">
                <span className="text-spell-quality text-2xl">+</span>
              </div>
              <p className="text-spell-quality text-sm">Quality</p>
            </div>
          )}
        </div>
        
        <div className="w-40 h-60 m-2 border-2 border-dashed border-spell-delivery rounded-xl flex flex-col items-center justify-center">
          {selectedCards.delivery ? (
            <SpellCard 
              card={selectedCards.delivery} 
              isSelected={true}
              onSelect={() => onRemoveCard('delivery')}
            />
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-spell-delivery bg-opacity-20 mx-auto flex items-center justify-center mb-2">
                <span className="text-spell-delivery text-2xl">+</span>
              </div>
              <p className="text-spell-delivery text-sm">Delivery</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <div className="inline-block mb-4 px-6 py-2 rounded-full bg-wizard-dark bg-opacity-60 border border-wizard-primary">
          <span className="text-white font-bold mr-2">Spell Power:</span>
          <span className="text-wizard-accent text-xl font-bold">{spellPower}</span>
        </div>
        
        <div>
          <button
            className={`magical-border px-8 py-3 rounded-lg 
                      text-white font-bold tracking-wider text-lg
                      transition-all duration-300 transform
                      ${isSpellComplete && canCast 
                        ? 'bg-gradient-to-r from-wizard-primary to-wizard-secondary hover:scale-105 hover:shadow-spell' 
                        : 'bg-gray-700 opacity-60 cursor-not-allowed'}`}
            onClick={handleCastClick}
            disabled={!isSpellComplete || !canCast}
          >
            CAST SPELL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpellCraftingArea;

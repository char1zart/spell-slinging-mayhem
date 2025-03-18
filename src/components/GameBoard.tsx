
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  CardType, 
  GameState, 
  Player, 
  SpellCard as SpellCardType, 
  Wizard as WizardType,
  calculateSpellPower,
  drawCard,
  initialGameState,
  wizards 
} from '@/lib/gameData';
import SpellCard from './SpellCard';
import SpellCraftingArea from './SpellCraftingArea';
import BattleArea from './BattleArea';
import GameControls from './GameControls';
import WizardCard from './WizardCard';

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({...initialGameState});
  const [selectedWizard, setSelectedWizard] = useState<WizardType | null>(null);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [animatingAttack, setAnimatingAttack] = useState(false);
  const [attackType, setAttackType] = useState<CardType>('source');
  
  // Initialize game with 2 players
  useEffect(() => {
    if (gameState.gamePhase === 'select-wizard' && selectedWizard) {
      const aiWizard = wizards.find(w => w.id !== selectedWizard.id) || wizards[0];
      
      // Create player objects
      const player1: Player = {
        id: 'p1',
        wizard: {...selectedWizard},
        hand: [],
        selectedCards: {}
      };
      
      const player2: Player = {
        id: 'p2',
        wizard: {...aiWizard},
        hand: [],
        selectedCards: {}
      };
      
      // Initialize game with players
      setGameState(prev => ({
        ...prev,
        players: [player1, player2],
        gamePhase: 'draw',
        deck: [...prev.deck] // Copy the deck to avoid reference issues
      }));
      
      toast.success(`Game started with ${selectedWizard.name} vs ${aiWizard.name}!`);
    }
  }, [selectedWizard, gameState.gamePhase]);
  
  // Handle draw phase
  useEffect(() => {
    if (gameState.gamePhase === 'draw') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      // Draw cards until player has 3 cards
      let updatedDeck = [...gameState.deck];
      let updatedHand = [...currentPlayer.hand];
      
      while (updatedHand.length < 3) {
        const [card, newDeck] = drawCard(updatedDeck);
        updatedHand.push(card);
        updatedDeck = newDeck;
      }
      
      // Update player's hand
      const updatedPlayers = [...gameState.players];
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        hand: updatedHand
      };
      
      // Move to craft phase
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        deck: updatedDeck,
        gamePhase: 'craft'
      }));
      
      toast.info(`${currentPlayer.wizard.name}'s turn - Craft your spell!`);
    }
  }, [gameState.gamePhase, gameState.currentPlayerIndex, gameState.deck, gameState.players]);
  
  // Calculate current spell power
  const getCurrentSpellPower = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer) return 0;
    
    return calculateSpellPower(currentPlayer.selectedCards);
  };
  
  // Handle card selection
  const handleCardSelect = (card: SpellCardType) => {
    if (gameState.gamePhase !== 'craft') return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // If card is already selected, deselect it
    if (
      (currentPlayer.selectedCards.source?.id === card.id) ||
      (currentPlayer.selectedCards.quality?.id === card.id) ||
      (currentPlayer.selectedCards.delivery?.id === card.id)
    ) {
      handleRemoveCard(card.type);
      return;
    }
    
    // Add card to selected cards
    const updatedSelectedCards = {
      ...currentPlayer.selectedCards,
      [card.type]: card
    };
    
    // Remove card from hand
    const updatedHand = currentPlayer.hand.filter(c => c.id !== card.id);
    
    // Update player
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      hand: updatedHand,
      selectedCards: updatedSelectedCards
    };
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers
    }));
    
    toast.info(`Added ${card.name} to your spell!`);
  };
  
  // Handle removing a card from the spell
  const handleRemoveCard = (type: CardType) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const cardToRemove = currentPlayer.selectedCards[type];
    
    if (!cardToRemove) return;
    
    // Remove card from selected cards
    const updatedSelectedCards = {...currentPlayer.selectedCards};
    delete updatedSelectedCards[type];
    
    // Add card back to hand
    const updatedHand = [...currentPlayer.hand, cardToRemove];
    
    // Update player
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      hand: updatedHand,
      selectedCards: updatedSelectedCards
    };
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers
    }));
    
    toast.info(`Removed ${cardToRemove.name} from your spell.`);
  };
  
  // Handle casting a spell
  const handleCastSpell = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Check if spell is complete
    if (!currentPlayer.selectedCards.source || 
        !currentPlayer.selectedCards.quality || 
        !currentPlayer.selectedCards.delivery) {
      toast.error("Your spell is incomplete!");
      return;
    }
    
    // Move to battle phase
    setGameState(prev => ({
      ...prev,
      gamePhase: 'battle'
    }));
    
    // Set default target (opponent for simplicity)
    const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
    setTargetPlayerIndex(opponentIndex);
    
    toast.success(`${currentPlayer.wizard.name} is ready to cast their spell!`);
  };
  
  // Handle selecting a target
  const handleSelectTarget = (index: number) => {
    setTargetPlayerIndex(index);
  };
  
  // Handle dealing damage to a target
  const handleDealDamage = () => {
    if (targetPlayerIndex === null) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const targetPlayer = gameState.players[targetPlayerIndex];
    
    // Calculate spell power
    const spellPower = getCurrentSpellPower();
    
    // Animate the attack
    setAnimatingAttack(true);
    
    // Determine which card to animate based on priority (delivery > quality > source)
    if (currentPlayer.selectedCards.delivery) {
      setAttackType('delivery');
    } else if (currentPlayer.selectedCards.quality) {
      setAttackType('quality');
    } else {
      setAttackType('source');
    }
    
    // The actual damage will be applied after animation completes
  };
  
  // Handle attack animation completion
  const handleAttackAnimationComplete = () => {
    setAnimatingAttack(false);
    
    if (targetPlayerIndex === null) return;
    
    const spellPower = getCurrentSpellPower();
    const targetPlayer = gameState.players[targetPlayerIndex];
    
    // Apply damage
    const updatedHealth = Math.max(0, targetPlayer.wizard.health - spellPower);
    
    // Update target player
    const updatedPlayers = [...gameState.players];
    updatedPlayers[targetPlayerIndex] = {
      ...targetPlayer,
      wizard: {
        ...targetPlayer.wizard,
        health: updatedHealth
      }
    };
    
    // Reset selected cards for current player
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...updatedPlayers[gameState.currentPlayerIndex],
      selectedCards: {}
    };
    
    // Check if game is over
    if (updatedHealth <= 0) {
      toast.success(`${targetPlayer.wizard.name} has been defeated!`);
      
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        gamePhase: 'game-over',
        winner: updatedPlayers[gameState.currentPlayerIndex]
      }));
      return;
    }
    
    // Move to aftermath phase
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      gamePhase: 'aftermath'
    }));
    
    toast.info(`${targetPlayer.wizard.name} took ${spellPower} damage!`);
  };
  
  // Handle ending turn
  const handleEndTurn = () => {
    // Switch to next player
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // Move to draw phase
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextPlayerIndex,
      gamePhase: 'draw',
      round: nextPlayerIndex === 0 ? prev.round + 1 : prev.round // Increment round when it's back to player 1
    }));
    
    setTargetPlayerIndex(null);
  };
  
  // Handle starting a new game
  const handleStartNewGame = () => {
    setGameState({...initialGameState});
    setSelectedWizard(null);
    setTargetPlayerIndex(null);
    toast.info("Starting a new game!");
  };
  
  // Render functions based on game phase
  const renderWizardSelection = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8 pixelated-text">Choose Your Wizard</h1>
      
      <div className="flex flex-wrap justify-center gap-4">
        {wizards.map((wizard, index) => (
          <WizardCard
            key={wizard.id}
            wizard={wizard}
            isSelected={selectedWizard?.id === wizard.id}
            onSelect={() => setSelectedWizard(wizard)}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  );
  
  const renderGameBoard = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    return (
      <div className="container mx-auto px-4 py-6">
        {/* Game controls */}
        <div className="mb-6">
          <GameControls
            gamePhase={gameState.gamePhase}
            onStartNewGame={handleStartNewGame}
            onEndTurn={handleEndTurn}
            canEndTurn={gameState.gamePhase === 'aftermath'}
            round={gameState.round}
          />
        </div>
        
        {/* Battle area (always visible once game starts) */}
        <BattleArea
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          targetPlayerIndex={targetPlayerIndex}
          onSelectTarget={handleSelectTarget}
          animateAttack={animatingAttack}
          onAnimationComplete={handleAttackAnimationComplete}
          attackingSpellType={attackType}
        />
        
        {/* Game over message */}
        {gameState.gamePhase === 'game-over' && gameState.winner && (
          <div className="glass-panel p-8 mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 pixelated-text">
              {gameState.winner.wizard.name} Wins!
            </h2>
            <p className="text-wizard-light mb-6">
              After an epic magical battle, {gameState.winner.wizard.name} emerges victorious!
            </p>
            <button
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                       text-white font-bold transform transition-transform hover:scale-105"
              onClick={handleStartNewGame}
            >
              Play Again
            </button>
          </div>
        )}
        
        {/* Action area based on game phase */}
        {gameState.gamePhase === 'craft' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Player's hand */}
            <div className="lg:col-span-2 glass-panel p-6">
              <h2 className="text-xl font-bold text-white mb-4 pixelated-text">Your Hand</h2>
              <div className="flex flex-wrap justify-center">
                {currentPlayer.hand.map((card, index) => (
                  <SpellCard
                    key={card.id}
                    card={card}
                    onSelect={() => handleCardSelect(card)}
                    animationDelay={index * 100}
                  />
                ))}
              </div>
            </div>
            
            {/* Spell crafting area */}
            <div>
              <SpellCraftingArea
                selectedCards={currentPlayer.selectedCards}
                onRemoveCard={handleRemoveCard}
                spellPower={getCurrentSpellPower()}
                onCastSpell={handleCastSpell}
                canCast={
                  !!currentPlayer.selectedCards.source &&
                  !!currentPlayer.selectedCards.quality &&
                  !!currentPlayer.selectedCards.delivery
                }
              />
            </div>
          </div>
        )}
        
        {gameState.gamePhase === 'battle' && (
          <div className="glass-panel p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4 pixelated-text">
              Select a target for your spell!
            </h2>
            <p className="text-wizard-light mb-6">
              Your spell power: <span className="font-bold text-wizard-accent">{getCurrentSpellPower()}</span>
            </p>
            <button
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                       text-white font-bold transform transition-transform hover:scale-105"
              onClick={handleDealDamage}
              disabled={targetPlayerIndex === null}
            >
              Cast Spell!
            </button>
          </div>
        )}
        
        {gameState.gamePhase === 'aftermath' && (
          <div className="glass-panel p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4 pixelated-text">
              Spell Cast!
            </h2>
            <p className="text-wizard-light mb-6">
              Your turn is complete. End your turn to continue.
            </p>
            <button
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-wizard-primary to-wizard-secondary
                       text-white font-bold transform transition-transform hover:scale-105"
              onClick={handleEndTurn}
            >
              End Turn
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Main render
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background magic circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-wizard-primary opacity-5 animate-rotate-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-wizard-secondary opacity-5 animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>
      
      {/* Game content */}
      <div className="relative z-10">
        {gameState.gamePhase === 'select-wizard' ? renderWizardSelection() : renderGameBoard()}
      </div>
    </div>
  );
};

export default GameBoard;

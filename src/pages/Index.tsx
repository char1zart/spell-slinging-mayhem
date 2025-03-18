
import React from 'react';
import GameBoard from '@/components/GameBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wizard-primary via-wizard-secondary to-wizard-accent mb-2 pixelated-text tracking-wider">
          Epic Spell Wars
        </h1>
        <p className="text-wizard-light text-lg">Craft powerful spells and battle your opponent!</p>
      </header>
      
      <main>
        <GameBoard />
      </main>
      
      <footer className="text-center py-6 text-wizard-light text-sm">
        <p>A digital adaptation of the Epic Spell Wars card game</p>
      </footer>
    </div>
  );
};

export default Index;

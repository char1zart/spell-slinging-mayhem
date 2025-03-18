
export type CardType = 'source' | 'quality' | 'delivery';
export type WizardName = string;

export interface SpellCard {
  id: string;
  name: string;
  type: CardType;
  power: number; 
  description: string;
  imageUrl: string;
  effect?: string;
}

export interface Wizard {
  id: string;
  name: WizardName;
  health: number;
  maxHealth: number;
  imageUrl: string;
  description: string;
}

export interface Player {
  id: string;
  wizard: Wizard;
  hand: SpellCard[];
  selectedCards: {
    source?: SpellCard;
    quality?: SpellCard;
    delivery?: SpellCard;
  };
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  deck: SpellCard[];
  gamePhase: 'select-wizard' | 'draw' | 'craft' | 'battle' | 'aftermath' | 'game-over';
  winner: Player | null;
}

// Wizard data
export const wizards: Wizard[] = [
  {
    id: 'w1',
    name: 'Presto Change-O',
    health: 20,
    maxHealth: 20,
    imageUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=2070&auto=format&fit=crop',
    description: 'A flamboyant illusionist with a penchant for dramatic transformations and explosive entrances.'
  },
  {
    id: 'w2',
    name: 'Lady Luck',
    health: 18,
    maxHealth: 18,
    imageUrl: 'https://images.unsplash.com/photo-1518799175676-a0fed7996acb?q=80&w=2127&auto=format&fit=crop',
    description: 'Fortune favors the bold, and no one is bolder than this luck-manipulating sorceress.'
  },
  {
    id: 'w3',
    name: 'Dr. Necronius',
    health: 22,
    maxHealth: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2022&auto=format&fit=crop',
    description: 'A macabre scientist who blends forbidden magic with questionable experiments.'
  },
  {
    id: 'w4',
    name: 'Mystic Inferno',
    health: 19,
    maxHealth: 19,
    imageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=2069&auto=format&fit=crop',
    description: 'A pyromancer whose spells burn with the intensity of a thousand suns.'
  }
];

// Card data
export const allSpellCards: SpellCard[] = [
  // Source cards
  {
    id: 's1',
    name: 'Arcane',
    type: 'source',
    power: 3,
    description: 'Pure magical energy tapped from the fabric of reality.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2384&auto=format&fit=crop',
    effect: 'Draw an extra card next turn.'
  },
  {
    id: 's2',
    name: 'Elemental',
    type: 'source',
    power: 4,
    description: 'Primal forces of nature channeled into destructive power.',
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2070&auto=format&fit=crop',
    effect: 'Deal +2 damage if target has less than half health.'
  },
  {
    id: 's3',
    name: 'Void',
    type: 'source',
    power: 5,
    description: 'Power drawn from the empty spaces between realities.',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2427&auto=format&fit=crop',
    effect: 'Sacrifice 2 health to gain +3 power.'
  },
  {
    id: 's4',
    name: 'Blood',
    type: 'source',
    power: 3,
    description: 'Life essence transformed into raw magical power.',
    imageUrl: 'https://images.unsplash.com/photo-1611432580340-af03c25b144e?q=80&w=2070&auto=format&fit=crop',
    effect: 'Heal 1 health for each point of damage dealt.'
  },
  {
    id: 's5',
    name: 'Wild',
    type: 'source',
    power: 3,
    description: 'Chaotic and unpredictable energy that defies control.',
    imageUrl: 'https://images.unsplash.com/photo-1514241516423-6c0a5e031aa2?q=80&w=2070&auto=format&fit=crop',
    effect: 'Your spell power is randomized between 1-8.'
  },
  
  // Quality cards
  {
    id: 'q1',
    name: 'Explosive',
    type: 'quality',
    power: 4,
    description: 'Unstable energy that detonates with tremendous force.',
    imageUrl: 'https://images.unsplash.com/photo-1599685315640-8ed28b8903f7?q=80&w=2070&auto=format&fit=crop',
    effect: 'Deal 2 splash damage to all other players.'
  },
  {
    id: 'q2',
    name: 'Prismatic',
    type: 'quality',
    power: 3,
    description: 'Crystalline energy that refracts and amplifies magic.',
    imageUrl: 'https://images.unsplash.com/photo-1586076100131-32505c71d0d1?q=80&w=2127&auto=format&fit=crop',
    effect: 'Copy the effect of your Source card.'
  },
  {
    id: 'q3',
    name: 'Warped',
    type: 'quality',
    power: 5,
    description: 'Reality-bending magic that distorts space and time.',
    imageUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=2032&auto=format&fit=crop',
    effect: 'Swap health with target until your next turn.'
  },
  {
    id: 'q4',
    name: 'Vampiric',
    type: 'quality',
    power: 3,
    description: 'Parasitic energy that drains life and power.',
    imageUrl: 'https://images.unsplash.com/photo-1633300248724-30b616c1c361?q=80&w=2070&auto=format&fit=crop',
    effect: 'Steal 2 health from target.'
  },
  {
    id: 'q5',
    name: 'Freezing',
    type: 'quality',
    power: 2,
    description: 'Bitter cold that slows and immobilizes.',
    imageUrl: 'https://images.unsplash.com/photo-1612635901022-20ecb7a202b3?q=80&w=2080&auto=format&fit=crop',
    effect: 'Target skips their next Quality card.'
  },
  
  // Delivery cards
  {
    id: 'd1',
    name: 'Blast',
    type: 'delivery',
    power: 3,
    description: 'A focused explosion of magical energy.',
    imageUrl: 'https://images.unsplash.com/photo-1638976964899-a6701349bcd1?q=80&w=2070&auto=format&fit=crop',
    effect: 'Your spell affects all opponents.'
  },
  {
    id: 'd2',
    name: 'Bolt',
    type: 'delivery',
    power: 4,
    description: 'A high-velocity projectile of condensed magic.',
    imageUrl: 'https://images.unsplash.com/photo-1629654757095-d6dea4ce5e8c?q=80&w=2000&auto=format&fit=crop',
    effect: 'Your spell cannot be countered.'
  },
  {
    id: 'd3',
    name: 'Wave',
    type: 'delivery',
    power: 3,
    description: 'A rippling wave of force that crashes outward.',
    imageUrl: 'https://images.unsplash.com/photo-1518144591331-17a5dd71c477?q=80&w=2080&auto=format&fit=crop',
    effect: 'Push target to the back of the initiative order.'
  },
  {
    id: 'd4',
    name: 'Rain',
    type: 'delivery',
    power: 2,
    description: 'A shower of magical projectiles from above.',
    imageUrl: 'https://images.unsplash.com/photo-1620385019251-b490897fa894?q=80&w=1974&auto=format&fit=crop',
    effect: 'Deal 1 damage to all players, including yourself.'
  },
  {
    id: 'd5',
    name: 'Touch',
    type: 'delivery',
    power: 6,
    description: 'Direct application of magic through physical contact.',
    imageUrl: 'https://images.unsplash.com/photo-1541336744128-c4b211f96a42?q=80&w=1974&auto=format&fit=crop',
    effect: '+3 power, but can only target adjacent players.'
  }
];

// Initial game state
export const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  round: 1,
  deck: [...allSpellCards],
  gamePhase: 'select-wizard',
  winner: null
};

// Game functions
export const drawCard = (deck: SpellCard[]): [SpellCard, SpellCard[]] => {
  if (deck.length === 0) {
    return [allSpellCards[0], [...allSpellCards]]; // If deck is empty, refresh with all cards
  }
  
  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  const newDeck = [...deck.slice(0, randomIndex), ...deck.slice(randomIndex + 1)];
  
  return [card, newDeck];
};

export const calculateSpellPower = (spell: { source?: SpellCard; quality?: SpellCard; delivery?: SpellCard }): number => {
  let power = 0;
  if (spell.source) power += spell.source.power;
  if (spell.quality) power += spell.quality.power;
  if (spell.delivery) power += spell.delivery.power;
  
  // Apply any special effects here
  
  return power;
};

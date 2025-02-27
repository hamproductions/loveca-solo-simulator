export type PresetInfo = number[];
export type Preset = {
  name: string;
  deck: PresetInfo;
};
export type GameState = {
  turn: number;
  score: {
    you: number;
    them: number;
  };
  liveScore: number | null;
  liveHistory: { you: number; them: number }[];
  deck: PresetInfo;
};

export const initGameState = (deck: PresetInfo): GameState => {
  return {
    turn: 0,
    score: {
      you: 0,
      them: 0
    },
    liveScore: null,
    liveHistory: [],
    deck
  };
};

export const isEnded = (state?: GameState | null) =>
  state?.score.you === 3 || state?.score.them === 3;
export const isPlaying = (state?: GameState | null) => !state || !isEnded(state);

export const livePhase = (state: GameState): GameState => {
  const max = state.deck[Math.min(state.turn, state.deck.length - 1)];
  const a = 10;
  const b = 4.5;
  const z = Math.random();
  const h = 1 / (1 + Math.exp(-(a * z) + b));
  console.log(max, z, h, Math.round(h));

  return {
    ...state,
    liveScore: Math.round(h * max)
  };
};

export const advanceTurn = (state: GameState, playerScore: number): GameState => {
  if (state.liveScore === null) return state;
  if (state.liveScore === playerScore) {
    if (state.liveScore === 0) {
      return {
        ...state,
        liveHistory: [...state.liveHistory, { you: playerScore, them: state.liveScore }],
        liveScore: null,
        turn: state.turn + 1
      };
    }
    return {
      ...state,
      turn: state.turn + 1,
      score: {
        ...state.score,
        you: Math.min(state.score.you + 1, 2),
        them: Math.min(state.score.them + 1, 2)
      },
      liveHistory: [...state.liveHistory, { you: playerScore, them: state.liveScore }],
      liveScore: null
    };
  } else if (state.liveScore > playerScore) {
    return {
      ...state,
      turn: state.turn + 1,
      score: { ...state.score, them: state.score.them + 1 },
      liveHistory: [...state.liveHistory, { you: playerScore, them: state.liveScore }],
      liveScore: null
    };
  } else {
    return {
      ...state,
      turn: state.turn + 1,
      score: { ...state.score, you: state.score.you + 1 },
      liveHistory: [...state.liveHistory, { you: playerScore, them: state.liveScore }],
      liveScore: null
    };
  }
};

export const PRESETS: Preset[] = [
  {
    name: 'Liella Aggro',
    deck: [1, 3, 3, 3, 3]
  },
  {
    name: 'Liella Aggro 2',
    deck: [2, 3, 5, 7, 8]
  },
  {
    name: 'Tsuzuri',
    deck: [0, 2, 3, 5, 8]
  },
  {
    name: 'Niji Chisato',
    deck: [1, 2, 3, 5, 10]
  },
  {
    name: 'Niji Mirapa',
    deck: [1, 2, 3, 5, 9]
  }
];

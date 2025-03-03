import type { Preset } from './presets';

export type DifficultyPreset = {
  id: string;
  a: number;
  b: number;
};

export type GameState = {
  turn: number;
  score: {
    you: number;
    them: number;
  };
  liveScore: number | null;
  liveHistory: { you: number; them: number }[];
  deck: Preset;
  difficulty: DifficultyPreset;
};

export const DIFFICULTIES = [
  {
    id: 'easy',
    a: 10,
    b: 5.5
  },
  {
    id: 'normal',
    a: 10,
    b: 4.5
  },
  {
    id: 'hard',
    a: 15,
    b: 5
  },
  {
    id: 'god',
    a: 50,
    b: 5
  }
] as const satisfies DifficultyPreset[];

export const initGameState = (deck: Preset, difficulty: DifficultyPreset): GameState => {
  return {
    turn: 0,
    score: {
      you: 0,
      them: 0
    },
    liveScore: null,
    liveHistory: [],
    deck,
    difficulty
  };
};

export const isEnded = (state?: GameState | null) =>
  state?.score.you === 3 || state?.score.them === 3;
export const isPlaying = (state?: GameState | null) => !state || !isEnded(state);

const mapScoreFn = (z: number, m: number, a: number, b: number) => {
  return Math.round(m * (1 / (1 + Math.exp(-(a * z) + b))));
};

const inverseMapScoreFn = (score: number, m: number, a: number, b: number) => {
  if (score > m) return 1;
  if (score < 0) return 0;
  const s = score;
  return (Math.log(s / (m - s)) + b) / a;
};

export const getTurnMaxScore = (deck: GameState['deck'], turn: number) => {
  const overflow = Math.max(turn + 1 - deck.deck.length, 0);
  return deck.deck[Math.min(turn, deck.deck.length - 1)] + overflow;
};

export const getTurnScoreProbability = (
  deck: GameState['deck'],
  difficulty: GameState['difficulty'],
  turn: number,
  score: number
) => {
  const maxTurnScore = getTurnMaxScore(deck, turn);
  const { a, b } = difficulty;
  return (
    inverseMapScoreFn(score + 0.5, maxTurnScore, a, b) -
    inverseMapScoreFn(score - 0.5, maxTurnScore, a, b)
  );
};

export const livePhase = (state: GameState): GameState => {
  const max = getTurnMaxScore(state.deck, state.turn);
  const { a, b } = state.difficulty;
  const z = Math.random();
  const liveScore = mapScoreFn(z, max, a, b);

  return {
    ...state,
    liveScore
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

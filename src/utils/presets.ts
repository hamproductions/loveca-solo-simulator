export type PresetInfo = number[];
export type Preset = {
  id: string;
  deck: PresetInfo;
  link?: string;
};

export const PRESETS = [
  {
    id: 'purple-liella',
    deck: [1, 1, 5, 6],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  },
  {
    id: 'purple-liella-aggro',
    deck: [2, 3, 5, 6],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  },
  {
    id: 'niji-lanzhu',
    deck: [1, 2, 4, 6, 10],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  },
  {
    id: 'goddess-mirapa',
    deck: [1, 2, 3, 8],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  },
  {
    id: 'liella-midrange',
    deck: [0, 2, 4, 6, 7],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  },
  {
    id: 'hasu-midrange',
    deck: [0, 2, 3, 6, 8],
    link: 'https://note.com/kasiwamoti_y/n/n6302d85baa85'
  }
] as const satisfies Preset[];

export type _DeckId<Curr = typeof PRESETS, Acc extends string[] = []> = Curr extends [
  infer C extends Preset,
  ...infer Rest extends Preset[]
]
  ? _DeckId<Rest, [...Acc, C['id']]>
  : Acc;

export type DeckId = _DeckId<typeof PRESETS>;

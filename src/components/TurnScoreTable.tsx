import { Table } from './ui/table';
import { getTurnMaxScore, getTurnScoreProbability, type DifficultyPreset } from '~/utils';
import type { Preset } from '~/utils/presets';

const MAX_TURNS = 8;
const MAX_SCORE = 16;

export function TurnScoreTable({
  difficulty,
  preset
}: {
  difficulty: DifficultyPreset;
  preset: Preset;
}) {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header
            borderRight="1px solid"
            borderRightColor="border.subtle"
            textAlign="center"
          ></Table.Header>
          {Array(MAX_SCORE)
            .fill(undefined)
            .map((_, i) => (
              <Table.Header key={i} w={5} textAlign={'center'} fontWeight="bold">
                {i}
              </Table.Header>
            ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Array(MAX_TURNS)
          .fill(undefined)
          .map((_, idx) => {
            const maxTurnScore = getTurnMaxScore(preset, idx);
            return (
              <Table.Row key={idx}>
                <Table.Cell
                  borderRight="1px solid"
                  borderRightColor="border.subtle"
                  textAlign={'center'}
                  fontWeight="bold"
                >
                  T{idx + 1}
                </Table.Cell>
                {Array(MAX_SCORE)
                  .fill(undefined)
                  .map((_, i) => {
                    const p =
                      i <= maxTurnScore
                        ? getTurnScoreProbability(preset, difficulty, idx, i)
                        : undefined;

                    const formatted = p ? Math.round(p * 100) + '%' : '';
                    return (
                      <Table.Cell key={i} textAlign={'center'}>
                        {formatted}
                      </Table.Cell>
                    );
                  })}
              </Table.Row>
            );
          })}
      </Table.Body>
    </Table.Root>
  );
}

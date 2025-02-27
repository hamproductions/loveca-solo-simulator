import { useTranslation } from 'react-i18next';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';

import { Center, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { Button } from '~/components/ui/button';
import { Heading } from '~/components/ui/heading';
import { createListCollection, Select } from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { advanceTurn, initGameState, isEnded, livePhase, PRESETS, type GameState } from '~/utils';

const collection = createListCollection({
  items: PRESETS.map((a) => a.name)
});

export function Page() {
  const { t } = useTranslation();

  const [gameState, setGameState] = useLocalStorage<GameState>('gameState', null);
  const [preset, setPreset] = useLocalStorage<string[]>('deckPreset', []);

  const startGame = () => {
    const p = PRESETS.find((p) => p.name === preset?.[0])?.deck;
    if (!p) return;
    const s = initGameState(p);
    setGameState(livePhase(s));
  };

  const selectScore = (score: number) => () => {
    if (!gameState) return;
    const s = advanceTurn(gameState, score);
    setGameState(livePhase(s));
  };

  const reset = () => {
    startGame();
  };

  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-lg">
          <Heading as="h1" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')}</Text>
          <Select.Root
            value={preset ?? []}
            onValueChange={({ items }) => {
              setPreset(items);
            }}
            positioning={{ sameWidth: true }}
            collection={collection}
            width="2xs"
          >
            <Select.Label>{t('deck')}</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t('select_deck')} />
                <FaChevronDown />
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {collection.items.map((item) => (
                  <Select.Item key={item} item={item}>
                    <Select.ItemText>{item}</Select.ItemText>
                    <Select.ItemIndicator>
                      <FaCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          {gameState ? (
            <Stack justifyContent="center" textAlign="center">
              <Text fontSize="xl" fontWeight="bold">
                {t('turn')} {gameState.turn + 1}
              </Text>
              <Stack justifyContent="center">
                <Text variant="heading">{t('score')}</Text>
                <HStack justifyContent="center" fontSize="7xl">
                  <Text>{gameState.score.you}</Text>
                  <Text>-</Text>
                  <Text>{gameState.score.them}</Text>
                </HStack>
              </Stack>
              {!isEnded(gameState) && (
                <HStack flexWrap="wrap">
                  {Array(16)
                    .fill(undefined)
                    .map((_, i) => {
                      return (
                        <Button key={i} size="md" variant="subtle" onClick={selectScore(i)}>
                          {i}
                        </Button>
                      );
                    })}
                </HStack>
              )}
              <Button onClick={reset}>{t('reset')}</Button>
              {gameState.liveHistory && (
                <Stack>
                  <Heading as="h4" fontSize="lg">
                    {t('live_history')}
                  </Heading>
                  {gameState.liveHistory.map((score, turn) => {
                    return (
                      <HStack key={turn} justifyContent="center" fontSize="lg">
                        <Text>
                          {t('turn')} {turn + 1} :{' '}
                        </Text>
                        <Text>{score.you}</Text>
                        <Text>-</Text>
                        <Text>{score.them}</Text>
                      </HStack>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          ) : (
            <Button onClick={startGame}>{t('start_game')}</Button>
          )}
        </Stack>
      </Center>
    </>
  );
}

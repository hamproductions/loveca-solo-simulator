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
  items: PRESETS
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
            multiple={false}
            onValueChange={({ value }) => setPreset(value)}
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
                  <Select.Item key={item.name} item={item.name}>
                    <Select.ItemText>{item.name}</Select.ItemText>
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
              <Text>
                {t('turn')} : {gameState.turn}
              </Text>
              <Stack justifyContent="center">
                <Text variant="heading">{t('score')}</Text>
                <Text>
                  {gameState.score.you} - {gameState.score.them}
                </Text>
              </Stack>
              <Text>
                {t('live_score')} : {gameState.liveScore}
              </Text>
              {!isEnded(gameState) && (
                <HStack>
                  {Array(16)
                    .fill(undefined)
                    .map((_, i) => {
                      return (
                        <Button size="sm" variant="ghost" onClick={selectScore(i)}>
                          {i}
                        </Button>
                      );
                    })}
                </HStack>
              )}
              <Button onClick={reset}>{t('reset')}</Button>
            </Stack>
          ) : (
            <Button onClick={startGame}>{t('start_game')}</Button>
          )}
        </Stack>
      </Center>
    </>
  );
}

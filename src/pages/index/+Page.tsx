import { useTranslation } from 'react-i18next';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';

import { Box, Center, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { TurnScoreTable } from '~/components/TurnScoreTable';
import { Button } from '~/components/ui/button';
import { Heading } from '~/components/ui/heading';
import { Link } from '~/components/ui/link';
import { RadioGroup } from '~/components/ui/radio-group';
import { createListCollection, Select } from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import {
  advanceTurn,
  DIFFICULTIES,
  initGameState,
  isEnded,
  livePhase,
  type GameState
} from '~/utils';
import { PRESETS } from '~/utils/presets';

export function Page() {
  const { t } = useTranslation();

  const [gameState, _setGameState] = useLocalStorage<GameState>('gameState', null);
  const [previousGameState, setPreviousState] = useLocalStorage<GameState>('previousState', null);
  const [preset, setPreset] = useLocalStorage<string[]>('deckPreset', null);
  const [difficulty, setDifficulty] = useLocalStorage<string>('difficulty', 'normal');

  const setGameState = (newGameState: GameState) => {
    setPreviousState(gameState);
    _setGameState(newGameState);
  };

  const startGame = () => {
    const p = PRESETS.find((p) => p.id === preset?.[0]) ?? PRESETS[0];
    const d = DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[0];
    if (!p) return;
    const s = initGameState(p, d);
    setGameState(livePhase(s));
  };

  const selectScore = (score: number) => () => {
    if (!gameState) return;
    const s = advanceTurn(gameState, score);
    setGameState(livePhase(s));
  };

  const undo = () => {
    _setGameState(previousGameState);
    setPreviousState(null);
  };

  const reset = () => {
    startGame();
  };

  const collection = createListCollection({
    items: PRESETS.map((a) => ({
      label: t(`decks.${a.id}`),
      value: a.id
    }))
  });

  const selectedDifficulty = DIFFICULTIES.find((d) => d.id === difficulty);
  const selectedPreset = PRESETS.find((p) => p.id === preset?.[0]);
  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-lg">
          <Heading as="h1" textAlign="center" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')}</Text>
          {gameState ? (
            <Stack justifyContent="center" textAlign="center">
              <Stack gap="0.5">
                <Text fontSize="md">
                  {t('current_deck')}: {t(`decks.${gameState.deck.id}`)} (
                  {t(`difficulties.${gameState.difficulty?.id ?? 'normal'}`)})
                </Text>
                {gameState.deck.link && (
                  <Text>
                    {t('deck_info')}:{' '}
                    <Link href={gameState.deck.link} target="_blank">
                      {gameState.deck.link}
                    </Link>
                  </Text>
                )}
              </Stack>
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
                <Stack>
                  <Text fontSize="xl" fontWeight="bold">
                    {t('live_score')}
                  </Text>
                  <HStack justifyContent="center" flexWrap="wrap">
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
                </Stack>
              )}
              <HStack justifyContent={'center'} flexWrap={'wrap'}>
                <Button onClick={reset}>{t('reset')}</Button>
                <Button variant="subtle" disabled={!previousGameState} onClick={undo}>
                  {t('undo')}
                </Button>
              </HStack>
              {gameState.liveHistory.length > 0 && (
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
          <Select.Root
            value={preset ?? []}
            onValueChange={({ items }) => {
              setPreset(items.map((i) => i.value));
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
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <FaCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          <HStack justifyContent="center" flexWrap="wrap">
            <Text fontSize="lg" fontWeight="bold">
              {t('difficulty')}
            </Text>
            <RadioGroup.Root
              value={difficulty ?? ''}
              onValueChange={({ value }) => {
                setDifficulty(value);
              }}
              defaultValue="normal"
              flexDirection="row"
              justifyContent="center"
              flexWrap="wrap"
            >
              {DIFFICULTIES.map((option) => (
                <RadioGroup.Item key={option.id} value={option.id}>
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>{t(`difficulties.${option.id}`)}</RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </HStack>
          {selectedDifficulty && selectedPreset && (
            <Stack>
              <Text px="4" textAlign="center" fontSize="lg" fontWeight="bold">
                {t('score_table')}
              </Text>
              <Box position="relative" maxW="screen" px="4" overflowX="auto">
                <TurnScoreTable difficulty={selectedDifficulty} preset={selectedPreset} />
              </Box>
            </Stack>
          )}
        </Stack>
      </Center>
    </>
  );
}

"use client";

import { useSounds } from "@/sounds/sounds";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useStyleConfig,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Maze {
  board: number[][];
  player: [number, number];
}

interface MoveResponse {
  movedPlayer: [number, number];
  isMoved: boolean;
}

const wallSize = 1;
const pathSize = 4;
const maxN = 8;
const mag = 1.4;

export default function Maze() {
  const {
    clickButtonSound,
    clickCommandSound,
    runCommandSound,
    clearStageSound,
    moveMazeSound,
  } = useSounds();

  const [n, setN] = useState<number>(0);
  const board = useRef<number[][] | null>(null);
  const [player, setPlayer] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [commands, setCommands] = useState<string[]>([]);
  const [commandIndex, setCommandIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startTime, setStartTime] = useState<number>(0);
  const [clearTime, setClearTime] = useState<string>("0:00:00");

  const router = useRouter();

  useEffect(() => {
    let saved_n = n;
    if (n == 0) {
      const saved_value = localStorage.getItem("n");
      if (saved_value) {
        saved_n = Number(saved_value);
        setN(saved_n);
      } else {
        saved_n = 3;
        setN(3);
      }
    }
    getMaze(saved_n);
    setCommands([]);
    setCommandIndex(null);
    setIsRunning(false);
    setStartTime(Date.now());
  }, [n]);

  const getMaze = async (n: number) => {
    const newMaze = (await invoke("create_maze", { n: n })) as Maze;
    console.log(newMaze);
    const newBoard = newMaze.board;
    const newPlayer = newMaze.player;
    board.current = newBoard;
    setPlayer(newPlayer);
    setLoading(false);
  };

  const runCommands = async () => {
    setIsRunning(true);
    setCommandIndex(-1);
    commands.forEach((command, index) => {
      setTimeout(async () => {
        setCommandIndex((prev) => prev! + 1);
        switch (command) {
          case "ArrowUp":
            move(0, -1);
            break;
          case "ArrowDown":
            move(0, 1);
            break;
          case "ArrowLeft":
            move(-1, 0);
            break;
          case "ArrowRight":
            move(1, 0);
            break;
          default:
            break;
        }
        if (index === commands.length - 1) {
          await new Promise((res) => setTimeout(res, 900));
          setPlayer([1, 1]);
          setIsRunning(false);
          setCommands([]);
          setCommandIndex(null);
        }
      }, index * 700);
    });
  };

  const move = async (dx: number, dy: number) => {
    if (board.current) {
      setPlayer((prevPlayer) => {
        if (board.current![prevPlayer![0]][prevPlayer![1]] != 3) {
          invoke("move_maze", {
            board: board.current,
            player: prevPlayer,
            dx: dx,
            dy: dy,
          }).then(async (response) => {
            const { movedPlayer } = response as MoveResponse;
            setPlayer(movedPlayer);
            if (board.current![movedPlayer[0]][movedPlayer[1]] == 3) {
              const time = Date.now() - startTime;
              setClearTime(
                `${Math.floor(time / 3600000) % 24}:${("00" + (Math.floor(time / 60000) % 60)).slice(-2)}:${("00" + (Math.floor(time / 1000) % 60)).slice(-2)}.${("00" + Math.floor((time % 1000) / 100)).slice(-2)}`
              );
              await new Promise((res) => setTimeout(res, 400));
              onOpen();
              await new Promise((res) => setTimeout(res, 300));
              clearStageSound();
            } else if (
              prevPlayer![0] != movedPlayer[0] ||
              prevPlayer![1] != movedPlayer[1]
            ) {
              moveMazeSound();
            }
          });
        }
        return prevPlayer;
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isOpen) {
      switch (e.key) {
        case "Home":
        case "ArrowLeft":
          if (n == 8) {
            localStorage.clear();
          } else {
            localStorage.setItem("n", JSON.stringify(n + 1));
          }
          router.back();
          break;
        case "End":
        case "ArrowRight":
          if (n < 8) {
            setLoading(true);
            setN((prev) => prev + 1);
            onClose();
          }
          break;
        default:
          break;
      }
    } else if (board.current && !isRunning) {
      switch (e.key) {
        case "ArrowUp":
        case "PageUp":
          clickCommandSound();
          setCommands((prev) => prev.concat(["ArrowUp"]));
          break;
        case "ArrowDown":
        case "PageDown":
          clickCommandSound();
          setCommands((prev) => prev.concat(["ArrowDown"]));
          break;
        case "ArrowLeft":
        case "Home":
          clickCommandSound();
          setCommands((prev) => prev.concat(["ArrowLeft"]));
          break;
        case "ArrowRight":
        case "End":
          clickCommandSound();
          setCommands((prev) => prev.concat(["ArrowRight"]));
          break;
        case "Enter":
          if (commands.length > 0) {
            runCommandSound();
            runCommands();
          }
          break;
        default:
          break;
      }
    }
    switch (e.key) {
      case "Backspace":
        clickButtonSound();
        localStorage.setItem("n", JSON.stringify(n));
        router.back();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const defaultButtonStyles = useStyleConfig("Button", { variant: "ghost" });

  return (
    <Stack spacing={0} overflowY="hidden">
      <Stack direction="row">
        <Button
          variant="ghost"
          onClick={() => {
            clickButtonSound();
            if (n == 3) {
              localStorage.clear();
            } else {
              localStorage.setItem("n", JSON.stringify(n));
            }
            router.back();
          }}
          paddingLeft={1}
          marginTop={2}
          marginLeft={2}
          _hover={{
            ...defaultButtonStyles,
            transform: "scale(1.06)",
            paddingLeft: 1,
            marginTop: 2,
            marginLeft: 2,
          }}
        >
          <ChevronLeftIcon boxSize={"2.5vh"} />
          <Text fontSize={"3vh"} className="itim">
            HOME
          </Text>
        </Button>
        <Spacer />
      </Stack>
      <Grid h="100%" position="relative" templateColumns="repeat(9, 1fr)">
        <GridItem />
        <GridItem colSpan={2}>
          <SimpleGrid columns={6} spacing={2} spacingY={4} cursor={"default"}>
            {commands.map((command, index) => {
              switch (command) {
                case "ArrowUp":
                  return (
                    <Box key={index}>
                      <Kbd
                        bgColor={index === commandIndex ? "yellow.100" : ""}
                        fontSize={"4vh"}
                      >
                        ↑
                      </Kbd>
                    </Box>
                  );
                case "ArrowDown":
                  return (
                    <Box key={index}>
                      <Kbd
                        bgColor={index === commandIndex ? "yellow.100" : ""}
                        fontSize={"4vh"}
                      >
                        ↓
                      </Kbd>
                    </Box>
                  );
                case "ArrowLeft":
                  return (
                    <Box key={index}>
                      <Kbd
                        bgColor={index === commandIndex ? "yellow.100" : ""}
                        fontSize={"4vh"}
                      >
                        ←
                      </Kbd>
                    </Box>
                  );
                case "ArrowRight":
                  return (
                    <Box key={index}>
                      <Kbd
                        bgColor={index === commandIndex ? "yellow.100" : ""}
                        fontSize={"4vh"}
                      >
                        →
                      </Kbd>
                    </Box>
                  );
                default:
                  break;
              }
            })}
          </SimpleGrid>
        </GridItem>
        <GridItem colSpan={3}>
          <Stack
            w="100%"
            overflowX="auto"
            whiteSpace="nowrap"
            position="relative"
          >
            {loading ? (
              <Stack h={`${((pathSize + wallSize) * maxN + wallSize) * mag}vh`}>
                <Spinner
                  marginX="auto"
                  marginY="auto"
                  thickness="0.7vh"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Stack>
            ) : (
              <Stack
                id="maze"
                h="58vh"
                overflow={"auto"}
                aspectRatio={1}
                marginX="auto"
                position="relative"
                spacing={0}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="100%"
                >
                  <Stack marginX={"auto"} spacing={0} position="relative">
                    {board.current &&
                      board.current.map((row, rowIndex) => (
                        <Grid
                          h={
                            rowIndex % 2 == 0
                              ? `${wallSize * mag}vh`
                              : `${pathSize * mag}vh`
                          }
                          w={`${((pathSize + wallSize) * n + wallSize) * mag}vh`}
                          templateColumns={`repeat(${(pathSize + wallSize) * n + wallSize}, 1fr)`}
                          key={rowIndex}
                        >
                          {row.map((cell, cellIndex) => (
                            <GridItem
                              colSpan={cellIndex % 2 == 0 ? wallSize : pathSize}
                              key={cellIndex}
                              bg={
                                cell == 0
                                  ? "black"
                                  : cell == 1
                                    ? "white"
                                    : cell == 2
                                      ? "blue.400"
                                      : "red.400"
                              }
                            />
                          ))}
                        </Grid>
                      ))}
                    <Box
                      position="absolute"
                      top={0}
                      left={`calc(calc(100%-${((pathSize + wallSize) * n + wallSize) * mag}vh)/2)`}
                      w={`${((pathSize + wallSize) * n + wallSize) * mag}vh`}
                      h={`${((pathSize + wallSize) * n + wallSize) * mag}vh`}
                      bg="rgba(0, 0, 0, 1.0)"
                      zIndex={1}
                      pointerEvents="none"
                      style={{
                        maskImage: `radial-gradient(circle at ${(((pathSize + wallSize) * (player![0] - 1)) / 2 + wallSize + pathSize / 2) * mag}vh ${(((pathSize + wallSize) * (player![1] - 1)) / 2 + wallSize + pathSize / 2) * mag}vh, transparent ${pathSize * 3.75}px, rgba(0, 0, 0, 1.0) ${pathSize * 0.75 * mag}vh)`,
                        WebkitMaskImage: `radial-gradient(circle at ${(((pathSize + wallSize) * (player![0] - 1)) / 2 + wallSize + pathSize / 2) * mag}vh ${(((pathSize + wallSize) * (player![1] - 1)) / 2 + wallSize + pathSize / 2) * mag}vh, transparent ${pathSize * 3.75}px, rgba(0, 0, 0, 1.0) ${pathSize * 0.75 * mag}vh)`,
                      }}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={`calc(calc(100%-${((pathSize + wallSize) * n + wallSize) * mag}vh)/2)`}
                      w={`${((pathSize + wallSize) * n + wallSize) * mag}vh`}
                      h={`${((pathSize + wallSize) * n + wallSize) * mag}vh`}
                      padding={`calc(${wallSize * mag}vh/2)`}
                      zIndex={2}
                      pointerEvents="none"
                    >
                      <Stack w="100%" h="100%" spacing={0}>
                        {Array.from({ length: n }).map((_, row) => (
                          <Grid
                            h={`calc(${(pathSize + wallSize) * mag}vh)`}
                            w="100%"
                            templateColumns={`repeat(${n}, 1fr)`}
                            key={row}
                          >
                            {Array.from({ length: n }).map((_, col) => (
                              <GridItem key={col} border="0.1px solid #333" />
                            ))}
                          </Grid>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Flex>
              </Stack>
            )}
            <Stack marginX="auto">
              <Grid gap={3} templateColumns="repeat(3, 1fr)">
                <GridItem>
                  <Spacer />
                </GridItem>
                <GridItem>
                  <IconButton
                    disabled={isRunning}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    aria-label="up"
                    onClick={() => {
                      clickCommandSound();
                      setCommands((prev) => prev.concat(["ArrowUp"]));
                    }}
                    icon={<ArrowUpIcon boxSize={6} />}
                  />
                </GridItem>
                <GridItem>
                  <Spacer />
                </GridItem>
              </Grid>
              <Grid gap={3} templateColumns="repeat(3, 1fr)">
                <GridItem>
                  <IconButton
                    disabled={isRunning}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    aria-label="left"
                    onClick={() => {
                      clickCommandSound();
                      setCommands((prev) => prev.concat(["ArrowLeft"]));
                    }}
                    icon={<ArrowBackIcon boxSize={6} />}
                  />
                </GridItem>
                <GridItem margin={"auto"}>
                  <IconButton
                    disabled={
                      isRunning || !board.current || commands.length === 0
                    }
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    aria-label="run"
                    onClick={() => {
                      runCommandSound();
                      runCommands();
                    }}
                    icon={
                      <TriangleUpIcon
                        boxSize={7}
                        style={{ transform: "rotate(90deg)" }}
                      />
                    }
                  />
                </GridItem>
                <GridItem>
                  <IconButton
                    disabled={isRunning}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    aria-label="right"
                    onClick={() => {
                      clickCommandSound();
                      setCommands((prev) => prev.concat(["ArrowRight"]));
                    }}
                    icon={<ArrowForwardIcon boxSize={6} />}
                  />
                </GridItem>
              </Grid>
              <Grid gap={3} templateColumns="repeat(3, 1fr)">
                <GridItem>
                  <Spacer />
                </GridItem>
                <GridItem>
                  <IconButton
                    disabled={isRunning}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    aria-label="down"
                    onClick={() => {
                      clickCommandSound();
                      setCommands((prev) => prev.concat(["ArrowDown"]));
                    }}
                    icon={<ArrowDownIcon boxSize={6} />}
                  />
                </GridItem>
                <GridItem>
                  <Spacer />
                </GridItem>
              </Grid>
            </Stack>
          </Stack>
        </GridItem>
        <GridItem colSpan={3} />
      </Grid>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h1">Congratulations!</Heading>
          </ModalHeader>
          <ModalBody fontSize="2xl">
            <Stack h="20vh">
              <Text className="itim">{`cleared the ${n}x${n} maze`}</Text>
              <Text className="itim">{`clear time: ${clearTime}`}</Text>
              {n == 8 && <Text className="itim">clear all stage!</Text>}
              <Spacer />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              marginRight={2}
              onClick={() => {
                if (n == 8) {
                  localStorage.clear();
                } else {
                  localStorage.setItem("n", JSON.stringify(n + 1));
                }
                router.back();
              }}
            >
              HOME
            </Button>
            <Spacer />
            <Button
              marginRight={2}
              onClick={() => {
                setLoading(true);
                localStorage.setItem("n", JSON.stringify(n));
                setN(0);
                onClose();
              }}
            >
              RETRY
            </Button>
            <Spacer />
            {n < 8 && (
              <Button
                onClick={() => {
                  setLoading(true);
                  setN((prev) => prev + 1);
                  onClose();
                }}
              >
                NEXT
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

"use client";

import { useSounds } from "@/sounds/sounds";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Stack,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Description() {
  const { clickButtonSound } = useSounds();

  const router = useRouter();
  const defaultButtonStyles = useStyleConfig("Button", { variant: "ghost" });

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Backspace":
        clickButtonSound();
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

  return (
    <Stack height="100%" spacing={0} overflowY="hidden">
      <Stack direction="row">
        <Button
          variant="ghost"
          onClick={() => {
            clickButtonSound();
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
      <Stack height="100%">
        <Stack>
          <Heading
            as="h1"
            size="3xl"
            color="orange.400"
            marginX="auto"
            className="dynapuff"
          >
            HOW TO PLAY{" "}
            <Text as="span" size="3xl" color="purple.800">
              MAXIMIZE MAZE
            </Text>
            <Text as="span"> </Text>?
          </Heading>
        </Stack>
        <Stack height="100%">
          <Grid
            width="100%"
            height="100%"
            templateColumns="repeat(5, 1fr)"
            templateRows="repeat(5, 1fr)"
          >
            <GridItem colSpan={2} rowSpan={2}>
              <Stack width="100%" height="100%">
                <Spacer />
                <Center>
                  <Image
                    src="/commands.png"
                    alt="commands"
                    width={400}
                    height={150}
                  />
                </Center>
              </Stack>
            </GridItem>
            <GridItem rowSpan={2}>
              <Image src="/maze.png" alt="maze" />
            </GridItem>
            <GridItem colSpan={2} rowSpan={2}>
              <Stack marginTop="30px" marginRight="120px">
                <Heading as="h1" size="lg" className="mPlus">
                  迷路の画面
                </Heading>
                <Text as="p" fontSize="lg" className="mPlus">
                  迷路には黒い霧がかかっており，プレイヤーの周囲4方向が通路か壁か，かろうじて判別できる程度しか見えません．
                  <br />
                  何度も挑戦して着実にゴールに近づいていきましょう！
                </Text>
              </Stack>
            </GridItem>
            <GridItem colSpan={2} rowSpan={3}>
              <Stack marginLeft="80px" marginRight="60px">
                <Heading as="h1" size="lg" className="mPlus">
                  入力されたコマンド一覧
                </Heading>
                <Text as="p" fontSize="lg" className="mPlus">
                  それまでに入力されたコマンドの一覧が表示されており，実行ボタンを押すとこのコマンド一覧の左上から右下に向かって実行されます．
                </Text>
              </Stack>
            </GridItem>
            <GridItem rowSpan={3}>
              <Stack height="90%">
                <Spacer />
                <Center>
                  <Image src="/keys.png" alt="keys" boxSize="200px" />
                </Center>
              </Stack>
            </GridItem>
            <GridItem colSpan={2} rowSpan={3}>
              <Stack marginTop="120px" marginRight="120px">
                <Heading as="h1" size="lg" className="mPlus">
                  コマンド入力ボタン
                </Heading>
                <Text as="p" fontSize="lg" className="mPlus">
                  プレイヤーをどのように動かすか決めるコマンドを入力します．中心の再生ボタンを押すと，それまでに入力したコマンドを実行します．
                  <br />
                  キーボードの矢印キーとEnterキーでも同様の操作をすることが出来ます．
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}

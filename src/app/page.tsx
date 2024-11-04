"use client";

import { useSounds } from "@/sounds/sounds";
import { Button, Heading, Stack, Text, useStyleConfig } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { clickButtonSound } = useSounds();

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "n":
        clickButtonSound(() => router.push("game"));
        localStorage.clear();
        break;
      case "c":
        clickButtonSound(() => router.push("game"));
        break;
      case "h":
        clickButtonSound(() => router.push("description"));
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

  const router = useRouter();
  const defaultBlueButtonStyles = useStyleConfig("Button", {
    variant: "solid",
    colorScheme: "blue",
  });
  const defaultTealButtonStyles = useStyleConfig("Button", {
    variant: "solid",
    colorScheme: "teal",
  });
  const defaultGreenButtonStyles = useStyleConfig("Button", {
    variant: "solid",
    colorScheme: "green",
  });

  const [hasSaveData, setHasSaveData] = useState<boolean | null>(null);
  useEffect(() => {
    const stored_value = localStorage.getItem("n");
    if (stored_value) {
      setHasSaveData(true);
    } else {
      setHasSaveData(false);
    }
  }, []);

  return (
    <Stack overflowY="hidden">
      <Stack paddingTop="220px" paddingBottom="160px">
        <Heading
          color="purple.800"
          as="h1"
          size="4xl"
          marginX="auto"
          className="dynapuff"
        >
          MAXIMIZE MAZE
        </Heading>
      </Stack>
      <Stack marginX="auto">
        <Button
          colorScheme="blue"
          w={350}
          onClick={() => {
            clickButtonSound(() => router.push("game"));
            localStorage.clear();
          }}
          _hover={{
            ...defaultBlueButtonStyles,
            transform: "scale(1.01)",
          }}
        >
          <Text as="p" className="itim">
            NEW GAME (OR PUSH N KEY)
          </Text>
        </Button>
        {hasSaveData && (
          <Button
            colorScheme="teal"
            w={350}
            onClick={() => {
              clickButtonSound(() => router.push("game"));
            }}
            _hover={{
              ...defaultTealButtonStyles,
              transform: "scale(1.01)",
            }}
          >
            <Text as="p" className="itim">
              CONTINUE (OR PUSH C KEY)
            </Text>
          </Button>
        )}
        <Button
          colorScheme="green"
          w={350}
          onClick={() => {
            console.log("from home");
            clickButtonSound(() => router.push("description"));
          }}
          _hover={{
            ...defaultGreenButtonStyles,
            transform: "scale(1.01)",
          }}
        >
          <Text as="p" size="xl" className="itim">
            HOW TO PLAY (OR PUSH H KEY)
          </Text>
        </Button>
      </Stack>
    </Stack>
  );
}

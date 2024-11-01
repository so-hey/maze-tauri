"use client";

import { useSounds } from "@/sounds/sounds";
import { Button, Heading, Stack, Text, useStyleConfig } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { clickButtonSound } = useSounds();

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "s":
        clickButtonSound();
        router.push("game");
        break;
      case "h":
        clickButtonSound();
        router.push("description");
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
  const defaultGreenButtonStyles = useStyleConfig("Button", {
    variant: "solid",
    colorScheme: "green",
  });

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
            clickButtonSound();
            router.push("game");
          }}
          _hover={{
            ...defaultBlueButtonStyles,
            transform: "scale(1.01)",
          }}
        >
          <Text as="p" className="itim">
            START (OR PUSH S KEY)
          </Text>
        </Button>
        <Button
          colorScheme="green"
          w={350}
          onClick={() => {
            clickButtonSound();
            router.push("description");
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

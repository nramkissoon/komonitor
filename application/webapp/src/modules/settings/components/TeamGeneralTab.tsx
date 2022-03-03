import { Box, Divider, Text, useColorModeValue } from "@chakra-ui/react";
import { SimpleLoadingSpinner } from "../../../common/components/Loading-Spinner";
import { useUserTimezoneAndOffset } from "../../user/client";
import { SignOutButton } from "./AccountTab";
import { ColorModeToggle } from "./ColorModeToggle";
import { TimezoneSelector } from "./Timezone-Selector";

export function TeamGeneralTab() {
  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
    mutate: tzMutate,
  } = useUserTimezoneAndOffset();

  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="10px"
        px="20px"
      >
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Appearance:
        </Text>
        <ColorModeToggle />
        <Divider mb="1em" />
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Timezone Preference:
        </Text>
        {!tzPrefIsLoading && tzAndOffset ? (
          <TimezoneSelector
            initialTz={tzAndOffset?.tz ?? "Etc/GMT"}
            mutate={tzMutate}
          />
        ) : (
          <SimpleLoadingSpinner />
        )}
        <Divider mb="1em" />
        <SignOutButton />
      </Box>
    </>
  );
}

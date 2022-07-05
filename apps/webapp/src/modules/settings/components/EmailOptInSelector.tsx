import { chakra, Checkbox, Flex } from "@chakra-ui/react";
import React from "react";
import { KeyedMutator } from "swr";
import { updateEmailOptIn } from "../client";
import { SaveButton } from "./Save-Button";

interface EmailOptInSelectorProps {
  initialValue: boolean;
  mutate: KeyedMutator<any>;
}

export const EmailOptInSelector = (props: EmailOptInSelectorProps) => {
  const { initialValue, mutate } = props;

  const [optIn, setOptIn] = React.useState(initialValue);

  return (
    <Flex justifyContent="space-between" width="100%" mb="1em">
      <Checkbox
        colorScheme="blue"
        isChecked={optIn}
        onChange={(e) => {
          setOptIn(e.target.checked);
        }}
      >
        <chakra.span fontSize="md" fontWeight="medium">
          Receive weekly monitor reports via email
        </chakra.span>
      </Checkbox>
      <SaveButton
        postFunction={updateEmailOptIn}
        initialData={initialValue}
        newData={optIn}
        mutate={mutate}
      />
    </Flex>
  );
};

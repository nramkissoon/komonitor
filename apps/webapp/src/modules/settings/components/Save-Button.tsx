import { Button, ScaleFade, useToast } from "@chakra-ui/react";
import React from "react";
import { KeyedMutator } from "swr";

interface SaveButtonProps {
  postFunction: (
    data: any,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => Promise<void>;
  initialData: any;
  newData: any;
  mutate: KeyedMutator<any>;
}

export function SaveButton(props: SaveButtonProps) {
  const { postFunction, newData, initialData, mutate } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const errorToast = useToast();
  const successToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to save",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  const postSuccessToast = (message: string) =>
    successToast({
      title: "Saved changes",
      description: message,
      status: "success",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  return (
    <ScaleFade
      in={!(newData === initialData || newData.value === initialData)}
      initialScale={0.8}
    >
      <Button
        isLoading={isLoading}
        loadingText="Saving..."
        spinner={<></>}
        size="md"
        fontSize="md"
        fontWeight="medium"
        px="1em"
        colorScheme="blue"
        bgColor="blue.400"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
        display={
          newData === initialData || newData.value === initialData
            ? "hidden"
            : "inherit"
        }
        onClick={async () => {
          setIsLoading(true);
          await postFunction(
            newData.value ?? newData,
            postSuccessToast,
            postErrorToast
          );
          await mutate();
          setIsLoading(false);
        }}
      >
        Save Changes
      </Button>
    </ScaleFade>
  );
}

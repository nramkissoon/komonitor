import { CopyIcon, DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { RefObject } from "react";
import { timeAgo } from "../../../common/client-utils";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import {
  createWebhookSecret,
  deleteWebhookSecret,
  useProductId,
  useWebhookSecret,
} from "../client";

interface DeleteSecretDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
}

export function SecretDeleteDialog(props: DeleteSecretDialogProps) {
  const { isOpen, onClose, leastDestructiveRef } = props;

  const { teamId } = useRouter().query;
  let { secret, secretIsLoading, secretMutate } = useWebhookSecret(
    teamId as string
  );
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete Webhook Secret
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards. Any applications
          using this secret must be updated.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            mr="1.5em"
            fontWeight="normal"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            color="white"
            bgColor="red.500"
            fontWeight="normal"
            onClick={async () => {
              const deleted = await deleteWebhookSecret(teamId as string);
              if (deleted) await secretMutate();
              onClose();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DevelopersTab() {
  const [showSecret, setShowSecret] = React.useState(false);
  const { teamId } = useRouter().query;
  const { productId, productIdIsLoading, productIdIsError } = useProductId(
    teamId as string
  );
  let { secret, secretIsLoading, secretMutate } = useWebhookSecret(
    teamId as string
  );
  const toast = useToast();
  const ref = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <SecretDeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={ref}
      />
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="20px"
        px="20px"
      >
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Webhooks:
        </Text>
        {productId === PLAN_PRODUCT_IDS.STARTER && (
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              Webhooks are a paid feature.{" "}
              <Link href="/pricing" passHref>
                <chakra.a
                  color="blue.400"
                  _hover={{
                    color: "blue.600",
                  }}
                  target="_blank"
                >
                  Upgrade your account now.
                </chakra.a>
              </Link>
            </Box>
            <Box>
              <Link href="/docs/webhooks/getting-started" passHref>
                <Button
                  as="a"
                  target="_blank"
                  rightIcon={<ExternalLinkIcon />}
                  variant="unstyled"
                  color="blue.400"
                  _hover={{
                    color: "blue.600",
                  }}
                >
                  Learn more about webhooks
                </Button>
              </Link>
            </Box>
          </Flex>
        )}

        {productId !== PLAN_PRODUCT_IDS.STARTER && secret && (
          <Box>
            <Box ml="2px">Webhook Secret: </Box>
            <Flex>
              <Input
                type={showSecret ? "text" : "password"}
                isReadOnly
                value={secret?.value ?? ""}
                _hover={{ cursor: "default" }}
                maxW="3xl"
                mr="8px"
              />
              <Flex>
                <Button
                  bgColor="gray.500"
                  color="white"
                  _hover={{
                    bg: "gray.600",
                  }}
                  size="md"
                  w="80px"
                  onClick={() => setShowSecret(!showSecret)}
                  mr="8px"
                >
                  {showSecret ? "Hide" : "Show"}
                </Button>
                <IconButton
                  colorScheme="blue"
                  bgColor="blue.400"
                  color="white"
                  _hover={{
                    bg: "blue.600",
                  }}
                  aria-label="Copy to clipboard"
                  icon={<CopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(secret?.value ?? "");
                    toast({
                      description: "Copied to clipboard!",
                      status: "success",
                      isClosable: true,
                      position: "top",
                      variant: "subtle",
                      duration: 4000,
                    });
                  }}
                />
                <IconButton
                  colorScheme="red"
                  bgColor="red.500"
                  color="white"
                  _hover={{
                    bg: "red.600",
                  }}
                  aria-label="Delete secret"
                  icon={<DeleteIcon />}
                  onClick={onOpen}
                  ml="8px"
                />
              </Flex>
            </Flex>
            <Box mt="5px" ml="2px">
              Created {timeAgo.format(secret.created_at)}
            </Box>
          </Box>
        )}
        {productId !== PLAN_PRODUCT_IDS.STARTER && !secretIsLoading && !secret && (
          <Button
            size="md"
            fontSize="md"
            fontWeight="medium"
            px="1em"
            shadow="md"
            colorScheme="blue"
            bgColor="blue.400"
            color="white"
            _hover={{
              bg: "blue.600",
            }}
            onClick={async () => {
              const created = await createWebhookSecret(teamId as string);
              if (created) await secretMutate();
            }}
          >
            Create Webhook Secret
          </Button>
        )}
      </Box>
    </>
  );
}

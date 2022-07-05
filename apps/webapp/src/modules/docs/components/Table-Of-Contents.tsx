import {
  Box,
  BoxProps,
  chakra,
  ListItem,
  OrderedList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

export function useScrollSpy(
  selectors: string[],
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = React.useState<string>();
  const observer = React.useRef<IntersectionObserver | null>(null);
  React.useEffect(() => {
    const elements = selectors.map((selector) =>
      document.querySelector(selector)
    );
    observer.current?.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute("id") as any);
        }
      });
    }, options);
    elements.forEach((el) => {
      if (el) observer.current?.observe(el);
    });
    return () => observer.current?.disconnect();
  }, [selectors, options]);

  return activeId;
}

interface TableOfContentProps extends BoxProps {
  headings: any;
}

function TableOfContent(props: TableOfContentProps) {
  const { headings, ...rest } = props;
  const activeId = useScrollSpy(
    headings.map(({ id }: any) => `[id="${id}"]`).reverse(),
    {
      rootMargin: "0% 0% -24% 0%",
    }
  );
  return (
    <Box
      as="nav"
      aria-labelledby="toc-title"
      width="16rem"
      flexShrink={0}
      display={{ base: "none", xl: "block" }}
      position="sticky"
      py="10"
      pr="4"
      top="6rem"
      right="0"
      fontSize="sm"
      alignSelf="start"
      maxHeight="calc(100vh - 8rem)"
      overflowY="hidden"
      pl="1em"
      sx={{ overscrollBehavior: "contain" }}
      _after={{
        content: '""',
        position: "absolute",
        background: useColorModeValue("gray.300", "gray.700"),
        height: "80%",
        w: "1px",
        left: "0",
        top: "2.5em",
      }}
      {...rest}
    >
      <Text
        as="h2"
        id="toc-title"
        textTransform="uppercase"
        fontWeight="bold"
        fontSize="md"
        color={useColorModeValue("gray.700", "gray.400")}
        letterSpacing="wide"
      >
        On this page
      </Text>
      <OrderedList spacing={1} ml="0" mt="4" styleType="none">
        {headings.map(({ id, text, level }: any) => (
          <ListItem key={id} title={text} ml={level === "h3" ? "4" : undefined}>
            <chakra.a
              py="1"
              display="block"
              fontWeight={id === activeId ? "bold" : "medium"}
              fontSize="lg"
              href={`#${id}`}
              aria-current={id === activeId ? "location" : undefined}
              color={
                id === activeId
                  ? useColorModeValue("blue.400", "blue.300")
                  : useColorModeValue("gray.600", "gray.400")
              }
              _hover={{
                color: useColorModeValue("blue.400", "blue.300"),
              }}
            >
              {text}
            </chakra.a>
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}

export default TableOfContent;

// https://www.emgoto.com/react-table-of-contents/

import { chakra, HTMLChakraProps, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = (setActiveId: any) => {
  const headingElementsRef = useRef({});

  useEffect(() => {
    const callback = (headings: any) => {
      headingElementsRef.current = headings.reduce(
        (map: any, headingElement: any) => {
          map[headingElement.target.id] = headingElement;
          return map;
        },
        headingElementsRef.current
      );
      const visibleHeadings: any[] = [];
      Object.keys(headingElementsRef.current).forEach((key: any) => {
        const headingElement = (headingElementsRef.current as any[])[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: any) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort((a, b) =>
          getIndexFromId(a.target.id) > getIndexFromId(b.target.id) ? 1 : -1
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -40% 0px",
    });
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
};

const getNestedHeadings = (headingElements: any) => {
  const nestedHeadings: any[] = [];

  headingElements.forEach(
    (heading: { nodeName?: any; innerText?: any; id?: any }, index: any) => {
      const { innerText: title, id } = heading;

      if (heading.nodeName === "H2") {
        nestedHeadings.push({ id, title, items: [] });
      } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push({
          id,
          title,
        });
      }
    }
  );

  return nestedHeadings;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<any[]>([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2.content, h3.content")
    );

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const Headings = ({ headings, activeId }: any) => {
  const linkStyle = (active: boolean): HTMLChakraProps<"a"> => ({
    fontSize: "2xl",
    color: active ? "blue.400" : useColorModeValue("black", "gray.400"),
    _hover: {
      color: active ? "blue.400" : useColorModeValue("gray.500", "white"),
      cursor: active ? "inherit" : "pointer",
    },
  });

  return (
    <chakra.ul listStyleType="none">
      {headings.map((heading: any) => (
        <chakra.li key={heading.id} mb=".7em">
          <chakra.a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`${heading.id}`)!.scrollIntoView({
                behavior: "smooth",
              });
            }}
            {...linkStyle(heading.id === activeId)}
          >
            {heading.title}
          </chakra.a>
          {heading.items.length > 0 && (
            <chakra.ul listStyleType="none">
              {heading.items.map((child: any) => (
                <chakra.li key={child.id}>
                  <chakra.a
                    href={`#${child.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`${child.id}`)!.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    {...linkStyle(child.id === activeId)}
                    fontSize="xl"
                    ml="1.5em"
                  >
                    {child.title}
                  </chakra.a>
                </chakra.li>
              ))}
            </chakra.ul>
          )}
        </chakra.li>
      ))}
    </chakra.ul>
  );
};

export const TableOfContents = () => {
  const [activeId, setActiveId] = useState();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <chakra.nav aria-label="Table of contents" position="sticky" mt="700px">
      <Headings headings={nestedHeadings} activeId={activeId} />
    </chakra.nav>
  );
};

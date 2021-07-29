import { ComponentMultiStyleConfig } from "@chakra-ui/react";
import { SPACING_X_REACTIVE_VALUES } from "../utils";

export const hoverColor = "gray.600";

export const TopNavBar: ComponentMultiStyleConfig = {
  parts: ["topNavBar", "brandingImg", "links", "dropDownLinks"],
  baseStyle: {
    topNavBar: {
      w: "100vw",
      py: "1em",
      px: SPACING_X_REACTIVE_VALUES,
      display: "flex",
      flexWrap: "wrap",
      shadow: "sm",
      flexDirection: ["column", "row"],
      alignItems: ["center", "flex-start"],
    },
    brandingImg: {
      w: "7.5em",
      h: "100%",
    },
    links: {
      verticalAlign: "middle",
      display: "inline-block",
      marginRight: "1.5vw",
      marginLeft: "1.5vw",
      fontSize: "1em",
      fontWeight: "bold",
      _hover: {
        color: hoverColor,
      },
    },
    dropDownLinks: {
      fontSize: "1em",
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
};

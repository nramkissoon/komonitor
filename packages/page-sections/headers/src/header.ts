import {
  BoxProps,
  FlexProps,
  HTMLChakraProps,
  IconButtonProps,
  StackProps,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

/**
 * @description Props for a base header with centered page links.
 */
export interface BaseHeaderProps {
  /**
   * Optional mobile navigation component.
   */
  mobileNavigation?: {
    /**
     * Menu component to display when toggled.
     */
    menu: React.ReactNode;

    /**
     * Function to call to open the menu. Passed to the onClick prop of a toggle button.
     */
    onOpen: MouseEventHandler<HTMLButtonElement>;
  };

  /**
   * Link components. Can be custom components or pre-built link components.
   */
  links: React.ReactNode[];

  /**
   * Logo component. Usually an SVG icon.
   */
  logo: React.ReactNode;

  /**
   * Login button component that displays on the right side of the header.
   */
  loginButton: React.ReactNode;

  /**
   * A component to display that will redirect to sign in page or app page based on user's authentication status.
   */
  signInOrAppLink: React.ReactNode;

  /**
   * Props to control the styling and functionality of subcomponents of this header.
   */
  styles?: {
    /**
     * Custom icons for the color mode toggle instead of defaults.
     */
    colorModeToggleIcons?: {
      darkIcon: IconType;
      lightIcon: IconType;
    };

    /**
     * Props for the header element housing the entire component.
     */
    headerContainerProps?: HTMLChakraProps<"header">;

    /**
     * Props for the flex box housing the header's subcomponents.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the flex box housing the logo.
     */
    logoFlexContainerProps?: FlexProps;

    /**
     * Props for the Box component housing the logo. Logo sizing can be controlled through these props.
     */
    logoBoxContainerProps?: BoxProps;

    /**
     * Props for the Stack component housing the page links.
     */
    linksHstackContainerProps?: StackProps;

    /**
     * Props for the flex box housing the subcomponents on the right side of the header.
     */
    rightSectionFlexContainerProps?: FlexProps;

    /**
     * Props for the Stack component housing the subcomponents on the right side of the header.
     */
    rightSectionHstackContainerProps?: StackProps;

    /**
     * Props for the color mode toggle button.
     */
    colorModeToggleProps?: IconButtonProps;

    /**
     * Props for the mobile navigation menu toggle that displays when screen width is small enough.
     */
    mobileNavHamburgerProps?: IconButtonProps;
  };
}

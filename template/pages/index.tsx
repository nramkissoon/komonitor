import * as React from "react";
import { LoginButton } from "../src/template/prebuiltUI/buttons/loginButton";
import { SimpleSocialFooter } from "../src/template/prebuiltUI/footers/simpleSocialFooter";
import { SimpleCenteredFooter } from "../src/template/prebuiltUI/footers/simpleCenteredFooter";
import FacebookIcon from "./../public/svg/social/facebook.svg";
import InstaIcon from "./../public/svg/social/instagram.svg";
import TwitterIcon from "./../public/svg/social/twitter.svg";
import BorderSvg from "./../public/svg/backgrounds/angledBottomBorder.svg";
import { SimpleSignUpCtaSection } from "../../packages/page-sections/cta-sections/src/simple-sign-up-cta-section";
import { BasicEmailSubmissionForm } from "../src/template/prebuiltUI/forms/basicEmailSubmissionForm";
import { SimpleEmailSubmissionCtaSection } from "../../packages/page-sections/cta-sections/src/simple-email-submission-cta-section";
import {
  Button,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { SectionLink } from "../src/template/prebuiltUI/navigation/links/sectionLink";
import { LeftIconLink } from "../src/template/prebuiltUI/navigation/links/leftIconLink";
import { SlideMobileNavigation } from "../src/template/prebuiltUI/navigation/slideMobileNavigation";
import { DropDownMenu } from "../src/template/prebuiltUI/navigation/dropDownMenu";
import { FullWidthFlyoutMenu } from "../src/template/prebuiltUI/navigation/fullWidthFlyoutMenu";
import { SimpleLink } from "../src/template/prebuiltUI/navigation/links/simpleLink";
import { BaseHeader } from "../../packages/page-sections/headers/src/base-header";
import { BasicCard } from "../src/template/prebuiltUI/cards/basicCard";
import { GridListFeatureSection } from "../src/template/prebuiltUI/featureSections/gridListFeatureSection";
import { IoCheckmark } from "react-icons/io5";
import { LeftIconListItem } from "../src/template/prebuiltUI/listItems/leftIconListItem";
import {
  BasicPricingCardA,
  BasicPricingCardB,
} from "../src/template/prebuiltUI/cards/basicPricingCard";
import { FancyPricingCard } from "../src/template/prebuiltUI/cards/fancyPricingCard";

const featureList = [
  <LeftIconListItem key="a" icon={IoCheckmark} text="This is a list item." />,
  <LeftIconListItem key="a" icon={IoCheckmark} text="This is a list item." />,
  <LeftIconListItem key="a" icon={IoCheckmark} text="This is a list item." />,
  <LeftIconListItem key="a" icon={IoCheckmark} text="This is a list item." />,
];

const iconLinks = [
  <LeftIconLink
    key="a"
    icon={<FacebookIcon />}
    href="/pricing"
    text="Go Here"
    styles={{
      boxContainerProps: { w: "full" },
    }}
  />,
  <LeftIconLink
    key="b"
    icon={<FacebookIcon />}
    href="/pricing"
    text="Go Here"
    styles={{
      boxContainerProps: { w: "full" },
    }}
  />,
];

const headerLinks = [
  <SimpleLink href="#" key="a" text="link 1" />,
  <SimpleLink href="#" key="b" text="link 2" />,
  <FullWidthFlyoutMenu key="c" buttonText="Fly Out" links={iconLinks} />,
];

const Home = () => {
  const isAuthed = false;
  const { colorMode, toggleColorMode } = useColorMode();
  const mobileNav = useDisclosure();

  return (
    <>
      <BaseHeader
        signInOrAppLink={<SimpleLink text="Sign in" href="/" />}
        mobileNavigation={{
          menu: (
            <SlideMobileNavigation
              links={iconLinks}
              onClose={mobileNav.onClose}
              isOpen={mobileNav.isOpen}
            />
          ),
          onOpen: mobileNav.onOpen,
        }}
        logo={<FacebookIcon />}
        links={headerLinks}
        loginButton={
          <LoginButton
            isAuthed={isAuthed}
            logout={toggleColorMode}
            size="md"
            authRoute="/api/test"
            isAuthedButtonText="Log out"
            notAuthedButtonText="Log in"
          />
        }
      />
      <BasicPricingCardB
        featureItems={featureList}
        price="$100"
        buttonOnClick={() => {}}
        buttonText="Get Started"
        productTitle="Punani"
      />
    </>
  );
};

export default Home;

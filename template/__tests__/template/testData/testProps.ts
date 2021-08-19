import { BasicEmailSubmissionForm } from "../../../../src/template/prebuiltUI/forms/basicEmailSubmissionForm";
import { FooterLinksColumnProps } from "./../../../../src/template/prebuiltUI/footers/footer";

export class TEST_PROPS {
  COL1: FooterLinksColumnProps = {
    columnTitle: "title1",
    links: [
      { text: "link1", href: "/link1" },
      { text: "link2", href: "/link2" },
    ],
  };

  COL2: FooterLinksColumnProps = {
    columnTitle: "title2",
    links: [
      { text: "link1", href: "/link1" },
      { text: "link2", href: "/link2" },
      { text: "link3", href: "/link3" },
    ],
  };

  COL3: FooterLinksColumnProps = {
    columnTitle: "title3",
    links: [
      { text: "link1", href: "/link1" },
      { text: "link2", href: "/link2" },
      { text: "link3", href: "/link3" },
      { text: "link4", href: "/link4" },
    ],
  };

  COL4: FooterLinksColumnProps = {
    columnTitle: "title4",
    links: [
      { text: "link1", href: "/link1" },
      { text: "link2", href: "/link2" },
    ],
  };

  EMAIL_SUB_FORM = BasicEmailSubmissionForm({
    onSubmit: () => {},
    styles: {
      inputProps: { size: "sm" },
      submitButtonProps: { size: "sm" },
    },
  });
}

import { AppHeader } from "../../../src/common/components/App-Header";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  return <AppHeader />;
};

Uptime.requiresAuth = true;
export default Uptime;

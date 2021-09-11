import { AppHeader } from "../../../src/components/app/App-Header";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  return <AppHeader />;
};

Uptime.requiresAuth = true;
export default Uptime;

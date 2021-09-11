import { AppHeader } from "../../../src/components/app/App-Header";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  return <AppHeader />;
};

App.requiresAuth = true;
export default App;

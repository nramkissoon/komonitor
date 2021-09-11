import { AppHeader } from "../../src/common/components/App-Header";
import { ExtendedNextPage } from "../_app";

const App: ExtendedNextPage = () => {
  return <AppHeader />;
};

App.requiresAuth = true;
export default App;

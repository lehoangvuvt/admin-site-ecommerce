import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "../App";
import Login from "../Login";
import AuthComponent from "./AuthComponent";

const Index = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <AuthComponent>
          <Route path="/" component={App} />
        </AuthComponent>
      </Switch>
    </BrowserRouter>
  );
};

export default Index;

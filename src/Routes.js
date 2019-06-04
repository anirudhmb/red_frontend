import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import NewElection from "./containers/NewElection";
import IssueDevice from "./containers/IssueDevice";
import Elections from "./containers/Elections";
import AddCandidate from "./containers/AddCandidate";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/election/new" exact component={NewElection} props={childProps} />
    <AppliedRoute path="/device/new" exact component={IssueDevice} props={childProps} />
    <AppliedRoute path="/elections/:id" exact component={Elections} props={childProps} />
    <AppliedRoute path="/add/candidate/:id" exact component={AddCandidate} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;

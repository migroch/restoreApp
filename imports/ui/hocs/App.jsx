import React from 'react';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from '../reusable/Footer.jsx';
import PlanEditor from './planEditor';
import PlanView from './planView';
import Map from './map';


const App = () => (
  <Router>
    <Nav />
    <div className="app-body">
      <Switch>
        <Route exact path="/map" component={Map}/>
        <Route path="/plan-editor/:id" component={PlanEditor}/>
        <Route exact path="/plan-viewer" component={PlanView}/>
        <Redirect to="/map" from="/"/>
      </Switch>
    </div>
    <Footer />
  </Router>
);

export default App;

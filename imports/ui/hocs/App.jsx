import React from 'react';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from '../reusable/Footer.jsx';
import GuidanceView from './GuidanceItems'
import Map from './Map';
import Plan from './Plan';

const App = () => (
  <Router>
    <Nav />
    <div className="app-body">
      <Switch>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/plan-viewer" component={Plan}/>
        {/* <Route exact path="/plan-viewer/edit" component={Plan}/>
        <Route exact path="/plan-viewer/edit/:id" component={Plan}/> */}
	      <Route exact path="/guidance" component={()=><GuidanceView isMultiSelectable/>}/>
        <Redirect to="/map" from="/"/>
      </Switch>
    </div>
    <Footer />
  </Router>
);

export default App;

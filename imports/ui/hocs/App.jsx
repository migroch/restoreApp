import React, { useState } from 'react';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Nav from './Nav.jsx';
import Footer from '../reusable/Footer.jsx';
import GuidanceView from './GuidanceItems'
import Map from './Map';
import Plan from './Plan';
import UserContext from '../context/user'

App = (auth) => {
  const [isAuthModalOpened, setAuthModalState] = useState(false);
  const value = { isAuthModalOpened, setAuthModalState };
  return(
  <UserContext.Provider value={value}>
    <Router>
      <Nav />
      <div className="app-body">
        <Switch>
          <Route exact path="/map" component={Map}/>
          <Route exact path="/plan-viewer" component={Plan}/>
          <Route exact path="/guidance" component={()=><GuidanceView isMultiSelectable/>}/>
          {auth.isAuthenticated && <Route exact path="/my-plans" component={()=><Plan auth={auth}/>}/>}
          <Redirect to="/map" from="/"/>
        </Switch>
      </div>
      <Footer />
    </Router>
  </UserContext.Provider>
)};
App = withTracker(() => {
  return {
    isAuthenticated: Meteor.userId() !== null,
    user: Meteor.user()
  };
})(App);
export default App;

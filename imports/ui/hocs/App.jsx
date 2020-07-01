import React from 'react';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from '../reusable/Footer.jsx';
import PlanEdit from './planEditor';
import PlanView from './planView';
import GuidanceItems from './GuidanceItems'
import Map from './Map';
import Plan from './Plan';

// Couldn't make it work this way, will try again. For now I inserted the GuidanceItems component into the PlanEditor component
/* const PlanEditorWrapper = () =>(
   <React.Fragment>
   <GuidanceItems />
   <PlanEditor />
   </React.Fragment>
   ) */

const App = () => (
  <Router>
    <Nav />
    <div className="app-body">
      <Switch>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/plan-viewer" component={Plan}/>
        {/* <Route exact path="/plan-viewer/edit" component={Plan}/>
        <Route exact path="/plan-viewer/edit/:id" component={Plan}/> */}
	 <Route exact path="/guidance" component={GuidanceItems}/>
        <Redirect to="/map" from="/"/>
      </Switch>
    </div>
    <Footer />
  </Router>
);

export default App;

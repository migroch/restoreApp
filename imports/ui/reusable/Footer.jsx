// Footer.jsx
// Footer component

import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';


class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inview: true,
    };
  }

  handleClick(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container-fluid bg-primary text-center text-white mt-3" >
	<p className="pt-3 m-0">Santa Cruz County Office of Education | 400 Encinal Street, Santa Cruz, CA 95060</p>
	<p className="pb-3 m-0"><a className="text-white" href="mailto:data@santacruzcoe.org">data@santacruzcoe.org</a></p>
      </div>
    );
  }
}

export default Footer;

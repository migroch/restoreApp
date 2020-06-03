import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/hocs/App';
import '/imports/startup/client';
import 'antd/dist/antd.css';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});

// publications.js
// Publish mongo collections

import { Meteor } from 'meteor/meteor';

import {menuitems} from '../../api/collections.js';

Meteor.publish("menuitems", function(){
    return menuitems.find({});
});


Meteor.publish(null, function(){
    if (this.userId) {
	return Meteor.users.find({_id: this.userId}, {fields: {email: 1, verified_email: 1} });   
    } else {
	return this.ready();
    }
});

Meteor.publish(null, function () {
  if (this.userId) {
      return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
      return this.ready();
  }
});



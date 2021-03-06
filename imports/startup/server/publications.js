// publications.js
// Publish mongo collections

import { Meteor } from 'meteor/meteor';
import { plans, planitems, guidanceitems, categories, subcategories, units, mapnodes, menuitems} from '../../api/collections.js';

// User custom top level fields
// Meteor.publish(null, function(){
//     if (this.userId) {
// 	return Meteor.users.find({_id: this.userId}, {fields: {email: 1, verified_email: 1, county: 1, district: 1, schools: 1,} });   
//     } else {
// 	return this.ready();
//     }
// });

// All user data
Meteor.publish(null, function () {
    return Meteor.users.find({});
});

// Roles
Meteor.publish(null, function () {
  if (this.userId) {
      return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
      return this.ready();
  }
});

// Plans
Meteor.publish("plans", function(){
    return plans.find({});
});

// Plan Items
Meteor.publish("planitems", function(){
    return planitems.find({});
});

// Guidance Items
Meteor.publish("guidanceitems", function(){
    return guidanceitems.find({});
});

// Categories
Meteor.publish("categories", function(){
    return categories.find({});
});

// Subcategories
Meteor.publish("subcategories", function(){
    return subcategories.find({});
});

// Units
Meteor.publish("units", function(){
    return units.find({});
});

// Mapnodes
Meteor.publish("mapnodes", function(){
    return mapnodes.find({});
});

// Menu Items
Meteor.publish("menuitems", function(){
    return menuitems.find({});
});



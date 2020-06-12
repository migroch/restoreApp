// collections.js
// Create and export mongo collections

import { Mongo } from 'meteor/mongo';
import Schemas from './schemas.js';

let plans = new Mongo.Collection('plans');
plans.schema = Schemas.plans;
plans.attachSchema(Schemas.plans);

let planitems = new Mongo.Collection('planitems');
planitems.schema = Schemas.planitems;
planitems.attachSchema(Schemas.planitems);

let guidanceitems = new Mongo.Collection('guidanceitems');
guidanceitems.schema = Schemas.guidanceitems;
guidanceitems.attachSchema(Schemas.guidanceitems);

let categories = new Mongo.Collection('categories');
categories.schema = Schemas.categories;
categories.attachSchema(Schemas.categories);

let subcategories = new Mongo.Collection('subcategories');
subcategories.schema = Schemas.subcategories;
subcategories.attachSchema(Schemas.subcategories);

let units = new Mongo.Collection('units');
units.schema = Schemas.units;
units.attachSchema(Schemas.units);

let mapnodes = new Mongo.Collection('mapnodes');

let menuitems = new Mongo.Collection('menuitems');
menuitems.schema = Schemas.menuitems;
menuitems.attachSchema(Schemas.menuitems);

// Add helper functions to collections

// planitems helpers
planitems.helpers({
    // unit names
    unitNames(){
	return  this.units.map(u => u.name);
    },
    // districts
    districts(){
	let districts = [];
	districts.concat(this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).district ));
	districts.push( Meteor.users.findOne({_id:this.ownerId}).district);
	return districts;
    },
    // schools
    schools(){
	let schools = [];
	schools.concat(this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).shools));
	schools.push( Meteor.users.findOne({_id:this.ownerId}).schools);
	return schools;
    },
    // owner name
    ownerName(){
	return Meteor.users.findOne({_id:this.ownerId}).profile.name;
    },
    // assignedTo names
    assignedToNames(){
	return this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).profile.name );
    }
});

// plans helpers
plans.helpers({
    // unit names
    unitNames(){
	return this.planItems.map(pi => pi.unitNames()).flat();
    },
    // unit ids
    unitIds(){
	return this.planItems.map(pi => pi.unitIds).flat();
    },
    // dimensions
    dimensions(){
	return this.planItems.map(pi => pi.dimension);
    },
    // districts
    districts(){
	return this.planItems.map(pi => pi.districts()).flat();
    },
    // schools
    schools(){
	return this.planItems.map(pi => pi.schools()).flat().flat();
    },
    // user names
    userNames(){
	return this.planItems.map(pi=> [ pi.ownerName() ].concat( pi.assignedToNames() )).flat();
    },
     // user Ids
    userIds(){
	return this.planItems.map(pi=> [pi.ownerId].concat(pi.assignedToIds)).flat();
    },
});



export { plans, planitems, guidanceitems, categories, subcategories, units, mapnodes, menuitems};

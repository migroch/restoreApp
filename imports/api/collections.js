// collections.js
// Create and export mongo collections

import { Mongo } from 'meteor/mongo';
import Schemas from './schemas.js';
import { Index, MongoDBEngine } from 'meteor/easy:search';

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

let schools = new Mongo.Collection('schools');
schools.schema = Schemas.schools;
schools.attachSchema(Schemas.schools);

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
	//districts.concat(this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).district ));
	//districts.push( Meteor.users.findOne({_id:this.ownerId}).district);
	if (this.assignedTo) districts = this.assignedTo.map(user=>user.district).flat();
	if (this.owner) districts.push( this.owner.district);
	return districts;
    },
    // schools
    schools(){
	let schools = [];
	//schools.concat(this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).schools));
	//schools.push( Meteor.users.findOne({_id:this.ownerId}).schools);
	if (this.assignedTo) schools = this.assignedTo.map(user=>user.schools);
	if (this.owner) schools.push( this.owner.schools);
	return schools.flat();
    },
    // shcool names
    schoolNames(){
	return this.schools().map(s => s.name);
    },
    // owner name
    ownerName(){
	let name;
	if (this.owner) name = this.owner.profile.name;
	return name;
	//return Meteor.users.findOne({_id:this.ownerId}).profile.name;
    },
    // assignedTo names
    assignedToNames(){
	let names = [];
	// names = this.assignedToIds.map(id => Meteor.users.findOne({_id:id}).profile.name);
	if (this.assignedTo) names = this.assignedTo.map(user => user.profile.name );
	return names;
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
	return this.planItems.map(pi => pi.schools().flat()).flat();
    },
    // school names
    schoolNames(){
	return this.planItems.map(pi => pi.schoolNames()).flat();
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


const PlansIndex = new Index({
    'collection': plans,
    'fields': ['title', 'scenario'],
    'engine': new MongoDBEngine({
        'selector': function (searchObject, options, aggregation) {
            const selector = this.defaultConfiguration().selector(searchObject, options, aggregation);
            // console.log('default selector', selector); 
            // console.log('search object', searchObject); 
            // console.log('search object name: ', searchTerm)
            return selector;
        },
        'fields': (searchObject, options) => ({
            '_id': 1,
        }),
    }),
    'permission': () => true,
});
const PlanItemsIndex = new Index({
    'collection': planitems,
    'fields': ['item.text', 'item.type', 'dimension'],
    'engine': new MongoDBEngine({
        'selector': function (searchObject, options, aggregation) {
            const selector = this.defaultConfiguration().selector(searchObject, options, aggregation);
            return selector;
        },
        'fields': (searchObject, options) => ({
            '_id': 1,
        }),
    }),
    'permission': () => true,
});

export { plans, planitems, guidanceitems, categories, subcategories, units, mapnodes, menuitems, schools, PlansIndex, PlanItemsIndex };

